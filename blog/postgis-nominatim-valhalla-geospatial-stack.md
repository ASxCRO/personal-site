---
title: "PostGIS, Nominatim, and Valhalla: Building a Geospatial Stack That Actually Knows the Roads"
date: 2026-07-26
description: "A practical deep dive into PostGIS: geometry vs geography, GiST indexes, and nearest-neighbor queries — plus how Nominatim turns addresses into coordinates and Valhalla turns coordinates into real driving times."
tags: ["PostgreSQL", "PostGIS", "Nominatim", "Valhalla", "GIS", ".NET"]
author: "Antonio Supan"
---

# PostGIS, Nominatim, and Valhalla: Building a Geospatial Stack That Actually Knows the Roads

Almost every business application eventually grows a map-shaped requirement. It usually arrives disguised as something innocent:

- "Show me the five closest service technicians to this customer."
- "Which delivery zone does this address belong to?"
- "Can we promise 30-minute delivery to that neighbourhood?"
- "How much did our drivers actually drive last month?"

The first instinct is to add `latitude` and `longitude` columns to a table and write some trigonometry in the application layer. That works for about two weeks. Then someone asks a question your `double` columns cannot answer, and you discover that "location" is not a pair of numbers — it is a whole data type with its own algebra.

This post walks through three open-source pieces that solve three genuinely different problems:

| Tool | The question it answers | Rough analogy |
|---|---|---|
| **PostGIS** | *Where are things, and how do they relate to each other?* | A filing cabinet that understands shapes |
| **Nominatim** | *What are the coordinates of "Ilica 5, Zagreb"?* (and the reverse) | A translator between human addresses and coordinates |
| **Valhalla** | *How long does it actually take to drive there?* | A driver who knows every street and one-way sign |

They are complementary, not competing. In fact, Nominatim is itself a PostgreSQL + PostGIS application, so once you understand PostGIS you already understand half of Nominatim's internals.

Let's build the picture from the bottom up.

---

## Part 1: PostGIS — teaching PostgreSQL what a "place" is

PostGIS is a PostgreSQL extension. It adds new column types (`geometry`, `geography`), a few hundred functions (`ST_Distance`, `ST_Contains`, `ST_Intersects`, ...), and — most importantly — index support so those functions do not degenerate into full table scans.

### Getting it running

The official Docker image ships PostgreSQL with the extension already compiled:

```yaml
# compose.yaml
services:
  db:
    image: postgis/postgis:17-3.5
    environment:
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: fieldservice
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Then enable it once per database:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
SELECT PostGIS_Full_Version();
```

### The core idea: a column that holds a shape

Instead of two numeric columns, you get one column holding a real geometric object:

```sql
CREATE TABLE stores (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text NOT NULL,
    location    geography(Point, 4326) NOT NULL
);

INSERT INTO stores (name, location) VALUES
    ('Zagreb Centar',  ST_MakePoint(15.9772, 45.8131)),
    ('Zagreb Jarun',   ST_MakePoint(15.9186, 45.7830)),
    ('Velika Gorica',  ST_MakePoint(16.0755, 45.7125));
```

Three things in that snippet deserve a full explanation, because misunderstanding them causes roughly 90% of all PostGIS bugs.

#### Trap #1: `ST_MakePoint` takes longitude *first*

Humans say "45.81, 15.97" — latitude, then longitude. Google Maps shows it that way. GPS devices show it that way.

PostGIS (and GeoJSON, and most of the OGC world) uses **X, Y** ordering, and X is longitude. So it is `ST_MakePoint(lon, lat)`.

If you swap them, nothing throws an exception. Your Zagreb store simply relocates to a point off the coast of Somalia, and every distance query returns garbage that is *plausible enough* to survive code review. Write the parameter names in a comment and never trust yourself on this one:

```sql
-- lon = 15.9772, lat = 45.8131
SELECT ST_MakePoint(15.9772, 45.8131);
```

A cheap sanity check for any European dataset: latitude is the number between 35 and 71, longitude is the smaller one.

#### Trap #2: SRID 4326 is not a unit of length

`4326` is the ID of a **spatial reference system** — WGS 84, the same one GPS uses. Coordinates are degrees on a slightly squashed sphere.

The important consequence: a degree is not a fixed distance. One degree of latitude is ~111 km everywhere, but one degree of longitude is ~111 km at the equator and only ~78 km at Zagreb's latitude — the meridians converge as you go north.

You will also run into **SRID 3857** (Web Mercator), which is what map tiles use. It has metre-like units, which makes it tempting, but it stretches distances badly the further you get from the equator. In Croatia the error is around 43%. Use 3857 for drawing tiles, not for measuring.

#### Trap #3: `geometry` vs `geography` — pick deliberately

This is the single most consequential schema decision in PostGIS.

**`geometry`** treats coordinates as flat Cartesian points. Fast, supports the full function library, and completely wrong about the curvature of the Earth if you store degrees in it:

```sql
SELECT ST_Distance(
    ST_SetSRID(ST_MakePoint(15.9772, 45.8131), 4326)::geometry,
    ST_SetSRID(ST_MakePoint(15.9186, 45.7830), 4326)::geometry
);
-- 0.06623... ← degrees. Not metres. Not kilometres. Degrees.
```

**`geography`** treats coordinates as points on a spheroid and returns honest **metres**:

```sql
SELECT ST_Distance(
    ST_MakePoint(15.9772, 45.8131)::geography,
    ST_MakePoint(15.9186, 45.7830)::geography
);
-- 5107.9 ← metres, great-circle distance
```

The rule of thumb I use:

- Data spread across a country or the globe, and you mostly ask "how far / within how many metres" → **`geography`**.
- Data inside a single city where you can project to a local metre-based system (Croatia: EPSG:3765, HTRS96/TM), or you need the exotic functions → **`geometry`** in that projected SRID.

`geography` supports fewer functions than `geometry`, but it supports the ones you use daily, and it removes an entire category of unit confusion. For most business applications, start there.

### Indexing: the difference between 4 ms and 4 seconds

A spatial index in PostGIS is a **GiST** index. Conceptually it stores each shape's bounding box in a tree, so the database can discard most of the table before doing any expensive geometric maths.

```sql
CREATE INDEX idx_stores_location ON stores USING GIST (location);
```

But the index only helps if you write queries it can use. This is the part people get wrong:

```sql
-- ❌ Sequential scan. ST_Distance is computed for every single row,
--    then the WHERE filter throws most of them away.
SELECT name FROM stores
WHERE ST_Distance(location, ST_MakePoint(15.98, 45.81)::geography) < 5000;

-- ✅ Index-assisted. ST_DWithin uses the bounding-box index first,
--    then computes exact distances only for the survivors.
SELECT name FROM stores
WHERE ST_DWithin(location, ST_MakePoint(15.98, 45.81)::geography, 5000);
```

Both return the same rows. On a table with 2 million points, the first one takes seconds and the second one takes milliseconds. `ST_DWithin` is one of a handful of functions with a special index-aware implementation — learn that list (`ST_DWithin`, `ST_Intersects`, `ST_Contains`, `ST_Within`, `ST_Covers`) and reach for those first.

### Nearest neighbour: the `<->` operator

"Give me the 5 closest stores" is a different query shape from "give me everything within 5 km". You do not know the radius in advance, and guessing one is how you end up with a query that returns 0 rows in the countryside and 4,000 in the city centre.

PostGIS supports **KNN** (k-nearest-neighbour) search directly through the index using the `<->` distance operator:

```sql
SELECT
    name,
    ST_Distance(location, ST_MakePoint(15.98, 45.81)::geography) AS metres
FROM stores
ORDER BY location <-> ST_MakePoint(15.98, 45.81)::geography
LIMIT 5;
```

The important part is that `ORDER BY ... <-> ...` combined with `LIMIT` lets the planner walk the GiST index in distance order and stop after five hits. It never touches the rest of the table. This works on tables with tens of millions of rows and stays in single-digit milliseconds.

Note the split: `<->` in the `ORDER BY` for the index, `ST_Distance` in the `SELECT` for the exact number you show the user.

### Polygons: "which zone is this in?"

Points are the easy half. The other half is areas — delivery zones, sales territories, city districts, coverage areas.

```sql
CREATE TABLE delivery_zones (
    id       int PRIMARY KEY,
    name     text NOT NULL,
    surcharge numeric(6,2) NOT NULL,
    area     geography(Polygon, 4326) NOT NULL
);

CREATE INDEX idx_zones_area ON delivery_zones USING GIST (area);
```

A polygon is a closed ring of coordinates. In WKT (Well-Known Text) it looks like this — note that the first and last coordinate must be identical to close the ring:

```sql
INSERT INTO delivery_zones (id, name, surcharge, area) VALUES (
    1, 'Zagreb Inner City', 0.00,
    ST_GeogFromText('POLYGON((
        15.94 45.83,
        16.01 45.83,
        16.01 45.79,
        15.94 45.79,
        15.94 45.83
    ))')
);
```

Now the business question — *which zone does this customer belong to, and what do we charge them?* — becomes a single join:

```sql
SELECT z.name, z.surcharge
FROM delivery_zones z
WHERE ST_Covers(z.area, ST_MakePoint(15.9772, 45.8131)::geography);
```

This is called a **point-in-polygon** test. Implementing it by hand means ray casting and edge cases around holes and shared borders. PostGIS does it correctly, and the GiST index means it stays fast even with thousands of zones.

A few relatives worth knowing:

```sql
-- Do two zones overlap? (Useful as a data-quality check.)
SELECT a.name, b.name
FROM delivery_zones a
JOIN delivery_zones b ON a.id < b.id
WHERE ST_Intersects(a.area, b.area);

-- How big is a zone, in km²?
SELECT name, ROUND((ST_Area(area) / 1000000)::numeric, 2) AS km2
FROM delivery_zones;

-- Everything within 500 m of a zone's border (the "edge case" customers)
SELECT c.id
FROM customers c
JOIN delivery_zones z ON ST_DWithin(c.location, z.area, 500)
WHERE NOT ST_Covers(z.area, c.location);
```

### Using it from .NET

With EF Core and Npgsql this integrates surprisingly cleanly through **NetTopologySuite**:

```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite
```

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        npgsql => npgsql.UseNetTopologySuite()));
```

```csharp
using NetTopologySuite.Geometries;

public class Store
{
    public long Id { get; set; }
    public string Name { get; set; } = default!;
    public Point Location { get; set; } = default!;
}

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Store>()
        .Property(s => s.Location)
        .HasColumnType("geography (Point, 4326)");
}
```

Queries translate to real SQL rather than being evaluated in memory:

```csharp
// Remember: Point(x, y) means Point(longitude, latitude)
var origin = new Point(15.9772, 45.8131) { SRID = 4326 };

var nearby = await db.Stores
    .Where(s => s.Location.IsWithinDistance(origin, 5000))   // → ST_DWithin(..., 5000)
    .OrderBy(s => s.Location.Distance(origin))               // → ST_Distance
    .Take(5)
    .Select(s => new
    {
        s.Name,
        Metres = s.Location.Distance(origin)
    })
    .ToListAsync();
```

`IsWithinDistance` maps to `ST_DWithin`, so you keep the index. If you need strict KNN index usage for a very large table, drop to `FromSqlRaw` with the `<->` operator — EF cannot express that operator today.

---

## Part 2: The two things PostGIS deliberately does not do

Here is where most projects hit a wall, and it is worth being precise about *why*.

### Wall #1: PostGIS does not know what an address is

PostGIS stores and compares shapes. It has no idea that "Ilica 5, Zagreb" is a place. Give it a string and it can do nothing with it — it needs coordinates.

Converting text to coordinates is **geocoding**, and it is a genuinely hard problem: abbreviations, typos, missing house numbers, streets with the same name in five cities, "bb" for buildings with no number, diacritics that half your users omit. That is Nominatim's job.

### Wall #2: PostGIS distance is a straight line, and straight lines lie

This one deserves a concrete example.

Take two points in Zagreb on opposite banks of the Sava. `ST_Distance` might report **400 metres**. It is perfectly correct — that *is* the distance a bird would fly. But your driver cannot swim, so the real trip is to the nearest bridge and back: **3.8 km and 11 minutes**.

Straight-line distance ignores every constraint that makes driving hard:

- rivers, railways, motorways with no crossing
- one-way streets and turn restrictions
- pedestrian zones that a car cannot enter
- speed limits — 5 km on a motorway is 3 minutes, 5 km through the city centre is 15
- a 3.5-tonne truck that is banned from half the streets a car can use

If you sort your technicians by `ST_Distance` and dispatch the top one, you will regularly send the person on the wrong side of a river while someone genuinely closer sits idle. The metric that matters to the business is **travel time**, and travel time requires a road network. That is Valhalla's job.

---

## Part 3: Nominatim — addresses in, coordinates out

Nominatim is the geocoder behind openstreetmap.org's search box. It imports OpenStreetMap data into PostgreSQL + PostGIS, builds a searchable hierarchy of places, and answers two kinds of question.

### Forward geocoding: text → coordinates

```bash
curl "https://nominatim.openstreetmap.org/search\
?q=Ilica+5,+Zagreb\
&format=jsonv2\
&addressdetails=1\
&limit=1" \
  -H "User-Agent: my-app/1.0 (antonio.suups@gmail.com)"
```

```json
[
  {
    "place_id": 123456789,
    "lat": "45.8129",
    "lon": "15.9755",
    "display_name": "5, Ilica, Donji grad, Zagreb, 10000, Croatia",
    "type": "house",
    "importance": 0.31,
    "address": {
      "house_number": "5",
      "road": "Ilica",
      "suburb": "Donji grad",
      "city": "Zagreb",
      "postcode": "10000",
      "country_code": "hr"
    },
    "boundingbox": ["45.8128", "45.8130", "15.9754", "15.9756"]
  }
]
```

Two fields are worth paying attention to in production code:

- **`type`** tells you the precision you actually got. `house` means a real building. `road` means Nominatim found the street but not the number, so you are pointing at the street's midpoint — possibly hundreds of metres off. `city` means it gave up and returned the city centre. Storing a `city`-level result as if it were a rooftop address is how you end up dispatching drivers to Ban Jelačić Square.
- **`importance`** is a relevance score used for ranking. Low scores on ambiguous queries are a signal to ask the user rather than guess.

For structured input — which you almost always have, because your form has separate fields — use the structured query form. It is significantly more accurate than concatenating everything into `q`:

```bash
curl "https://nominatim.openstreetmap.org/search\
?street=5+Ilica\
&city=Zagreb\
&postalcode=10000\
&countrycodes=hr\
&format=jsonv2&addressdetails=1"
```

Useful extras: `countrycodes=hr` restricts the search to Croatia, and `viewbox=<lon1>,<lat1>,<lon2>,<lat2>&bounded=1` restricts it to a rectangle — handy when you know the customer is in one region and want to eliminate same-named streets elsewhere.

### Reverse geocoding: coordinates → text

The other direction, which is what you use to turn a GPS ping into something a human can read:

```bash
curl "https://nominatim.openstreetmap.org/reverse\
?lat=45.8131&lon=15.9772\
&format=jsonv2&zoom=18" \
  -H "User-Agent: my-app/1.0 (antonio.suups@gmail.com)"
```

`zoom` controls granularity: 18 gives you a building, 16 a street, 10 a city. Ask for the level you actually need.

### The usage policy is not a suggestion

The public `nominatim.openstreetmap.org` instance is donated infrastructure. Its policy is explicit:

- **maximum 1 request per second**
- a **real** `User-Agent` or `Referer` identifying your application
- **no bulk geocoding** — do not push your 50,000-row customer table through it
- cache results on your side

Ignoring this gets your IP blocked, usually on the day of the demo. And the deeper reason to cache anyway: geocoding the same address repeatedly is pure waste. Addresses do not move.

### Self-hosting

If you geocode at any volume, run your own. The community Docker image handles the import:

```yaml
services:
  nominatim:
    image: mediagis/nominatim:4.5
    environment:
      PBF_URL: https://download.geofabrik.de/europe/croatia-latest.osm.pbf
      REPLICATION_URL: https://download.geofabrik.de/europe/croatia-updates/
      IMPORT_STYLE: address
      NOMINATIM_PASSWORD: verysecret
    ports:
      - "8080:8080"
    volumes:
      - nominatim-data:/var/lib/postgresql/16/main
    shm_size: 1gb
```

Sizing expectations, roughly:

| Extract | Import time | Disk |
|---|---|---|
| Croatia | ~20–40 min | ~10 GB |
| Central Europe | a few hours | ~150 GB |
| Planet | 2–5 days, 64 GB+ RAM | ~1 TB |

Start with a country extract from [Geofabrik](https://download.geofabrik.de/). Setting `REPLICATION_URL` lets the container apply OSM diffs so your data does not go stale.

Once it is yours, the rate limit disappears and you can geocode as fast as your hardware allows.

### Caching geocodes in PostGIS

The natural pattern: geocode once at write time, store the result as a `geography` column, and never call the geocoder again for that address.

```sql
CREATE TABLE customers (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name          text NOT NULL,
    address_raw   text NOT NULL,
    location      geography(Point, 4326),
    geocode_type  text,          -- 'house' | 'road' | 'city' | ...
    geocoded_at   timestamptz
);

CREATE INDEX idx_customers_location ON customers USING GIST (location);
-- Find addresses that need re-geocoding or manual review
CREATE INDEX idx_customers_poor_geocode ON customers (geocode_type)
    WHERE geocode_type IS DISTINCT FROM 'house';
```

That partial index gives your operations team a free work queue: every address Nominatim could not resolve to a building.

### Where Nominatim struggles

Be honest with stakeholders about this. Nominatim is only as good as OpenStreetMap coverage in your area. In Croatia, city centres are excellent; rural house numbers are patchy. Newly built streets can lag by months. Some house numbers are **interpolated** — OSM knows the street runs from 1 to 45 and estimates where 23 falls, which can be tens of metres off.

If you need guaranteed rooftop-level accuracy for every address in a country, you will eventually want an official cadastral dataset as a fallback. Nominatim handles the long tail well and costs nothing; it does not handle "legally exact" requirements.

---

## Part 4: Valhalla — coordinates in, real travel time out

Valhalla is an open-source routing engine built on OpenStreetMap. It reads the road network, builds a tiled and hierarchical graph, and answers questions about actually moving through it.

The design detail that matters: **costing is dynamic**. Valhalla does not precompute "the shortest path" once. It applies a costing model at query time, so the same tiles serve a car, a 3.5-tonne truck avoiding low bridges, a bicycle preferring cycle lanes, and a pedestrian who can use stairs — from one deployment.

```yaml
services:
  valhalla:
    image: ghcr.io/gis-ops/docker-valhalla/valhalla:latest
    ports:
      - "8002:8002"
    environment:
      tile_urls: https://download.geofabrik.de/europe/croatia-latest.osm.pbf
      server_threads: 4
      use_tiles_ignore_pbf: "True"
    volumes:
      - valhalla-tiles:/custom_files
```

The first start builds tiles (minutes for a country extract, hours for a continent). After that, startup is fast because the tiles are cached in the volume.

### `/route` — the basic answer

```bash
curl -X POST http://localhost:8002/route -d '{
  "locations": [
    {"lat": 45.8131, "lon": 15.9772},
    {"lat": 45.7125, "lon": 16.0755}
  ],
  "costing": "auto",
  "directions_options": {"units": "kilometers"}
}'
```

```json
{
  "trip": {
    "summary": { "length": 18.42, "time": 1284, "has_toll": false },
    "legs": [{
      "shape": "mnq~Ho{qvB...",
      "maneuvers": [
        { "instruction": "Drive east on Vlaška ulica.", "time": 47, "length": 0.4 }
      ]
    }]
  }
}
```

`length` is kilometres, `time` is **seconds**. Straight-line distance between those two points is about 12.5 km; the real drive is 18.4 km and 21 minutes. That gap is exactly the value Valhalla adds over `ST_Distance`.

One integration gotcha: `shape` is an **encoded polyline with precision 6**, not the precision-5 format Google's classic library uses. Decode with the wrong precision and your route lands in the Atlantic. Most libraries take precision as a parameter — pass `6`.

### `/sources_to_targets` — the matrix, and the query that changes your architecture

This is the endpoint that makes "find the closest technician *by driving time*" possible in one call:

```bash
curl -X POST http://localhost:8002/sources_to_targets -d '{
  "sources": [
    {"lat": 45.8131, "lon": 15.9772},
    {"lat": 45.7830, "lon": 15.9186},
    {"lat": 45.7125, "lon": 16.0755}
  ],
  "targets": [
    {"lat": 45.8000, "lon": 16.0000}
  ],
  "costing": "auto"
}'
```

You get back an N×M grid of `{distance, time}`. Sort by `time` and you have your answer — one that respects rivers, one-way streets, and speed limits.

The cost grows as N×M, so do not send it 500 candidates. Which brings us to the pattern that ties this entire post together.

### `/isochrone` — the endpoint that hands data back to PostGIS

An isochrone is the polygon of everywhere you can reach within a time budget. "Everything within 15 minutes' drive of this warehouse."

```bash
curl -X POST http://localhost:8002/isochrone -d '{
  "locations": [{"lat": 45.8131, "lon": 15.9772}],
  "costing": "auto",
  "contours": [{"time": 15}, {"time": 30}],
  "polygons": true
}'
```

The response is a **GeoJSON FeatureCollection** — a set of polygons. And PostGIS speaks GeoJSON natively:

```sql
INSERT INTO service_areas (warehouse_id, minutes, area)
VALUES (
    1, 15,
    ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[15.89,45.77], ...]]}')::geography
);
```

Now the road network's knowledge lives inside your database, and every subsequent question is a plain SQL join with an index behind it:

```sql
-- Which customers can we reach within 15 minutes?
SELECT c.id, c.name
FROM customers c
JOIN service_areas s ON ST_Covers(s.area, c.location)
WHERE s.warehouse_id = 1 AND s.minutes = 15;

-- How many customers fall outside every service area? (The expansion business case.)
SELECT count(*)
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM service_areas s WHERE ST_Covers(s.area, c.location)
);
```

That second query is the kind of thing that ends up on a slide in a management meeting, and it costs you one index scan.

Two more endpoints worth knowing:

- **`/optimized_route`** — the travelling-salesman variant. Give it one start and ten stops, and it returns the order that minimises total driving. This is a genuinely hard optimisation problem you do not want to implement yourself.
- **`/trace_route`** (map matching) — feed it noisy GPS pings and it snaps them onto real roads. This is how you turn a phone's jittery breadcrumb trail into an accurate "the van drove 143 km today" figure instead of a number inflated by GPS drift.

---

## Part 5: Putting the three together

Here is the dispatch problem end to end: *a customer calls, we have their address, send the closest available technician.*

```
1. Nominatim   "Ilica 5, Zagreb"  →  (45.8129, 15.9755)     [once, then cached]
2. PostGIS     45 available technicians  →  8 within 15 km   [ST_DWithin + GiST, ~2 ms]
3. Valhalla    8 candidates  →  driving time for each        [1 matrix call, ~50 ms]
4. Sort by real driving time, dispatch the winner
```

Step 2 is the one people skip, and skipping it is what makes the whole thing slow. Valhalla is fast, but a matrix call is orders of magnitude more expensive than an index scan. **PostGIS is the cheap filter; Valhalla is the expensive ranker.** Straight-line distance is a bad final answer but an excellent first-pass filter, because road distance is always *at least* straight-line distance — so nobody outside your radius could have been the winner anyway.

Pick the radius with a safety margin: if you want the best candidate within a 15-minute drive, filter at roughly 20–25 km, not 12. In dense city traffic the ratio of road distance to straight-line distance is typically 1.2–1.5×; in mountainous or river-cut terrain it can exceed 2×.

```csharp
public async Task<Technician?> FindClosestAsync(Point customerLocation, CancellationToken ct)
{
    // Step 2: cheap spatial pre-filter in PostGIS
    var candidates = await db.Technicians
        .Where(t => t.IsAvailable)
        .Where(t => t.Location.IsWithinDistance(customerLocation, 20_000))
        .OrderBy(t => t.Location.Distance(customerLocation))
        .Take(10)
        .ToListAsync(ct);

    if (candidates.Count == 0) return null;
    if (candidates.Count == 1) return candidates[0];

    // Step 3: one matrix call for real driving times
    var matrix = await valhalla.SourcesToTargetsAsync(
        sources: candidates.Select(t => t.Location),
        targets: [customerLocation],
        costing: "auto",
        ct);

    // Step 4: rank by seconds behind the wheel, not metres through the air
    return candidates
        .Zip(matrix.Times, (technician, seconds) => (technician, seconds))
        .MinBy(x => x.seconds)
        .technician;
}
```

Two operational notes on this shape:

**Keep the technician positions fresh.** A `UPDATE technicians SET location = ..., updated_at = now()` on every GPS ping is cheap, but it does churn the GiST index. If you have thousands of vehicles reporting every 10 seconds, write positions to a separate lightweight table and keep the indexed "last known position" table updated at a coarser interval.

**Have a fallback.** If Valhalla is unreachable, degrade to the PostGIS straight-line ordering and log it, rather than failing the dispatch entirely. A slightly suboptimal technician is much better than no technician.

---

## Which piece solves which problem

To close the loop on the table from the beginning:

| Requirement | Tool |
|---|---|
| Store and query locations | PostGIS |
| "Within 5 km of..." | PostGIS (`ST_DWithin` + GiST) |
| "The 5 closest..." | PostGIS (`<->` KNN) |
| "Which zone is this in?" | PostGIS (`ST_Covers`) |
| Address text → coordinates | Nominatim |
| Coordinates → readable address | Nominatim (reverse) |
| Real driving distance and time | Valhalla (`/route`) |
| Closest by driving time, many candidates | PostGIS filter → Valhalla (`/sources_to_targets`) |
| Best order for a multi-stop route | Valhalla (`/optimized_route`) |
| "Everything within 20 minutes' drive" | Valhalla (`/isochrone`) → stored in PostGIS |
| Clean up noisy GPS traces | Valhalla (`/trace_route`) |

## A checklist before you ship

1. **`ST_MakePoint(lon, lat)`** — longitude first. Verify with a known landmark before trusting any import.
2. **Choose `geography` or projected `geometry` on purpose**, and write down which one in a comment on the column. Mixing them silently produces degrees where you expected metres.
3. **Create the GiST index**, then run `EXPLAIN ANALYZE` to confirm it is actually being used. It is not automatic.
4. **Use `ST_DWithin`, never `ST_Distance(...) < x`** in a `WHERE` clause.
5. **Cache every geocode.** Store the precision (`type`) alongside the coordinates so you know which ones to distrust.
6. **Respect the public Nominatim rate limit**, and self-host before you need to.
7. **Never present straight-line distance as travel time** in a UI. Users check it against their maps app and lose trust in the whole system.
8. **Filter in PostGIS before calling Valhalla.** Matrix calls scale as N×M.
9. **Decode Valhalla polylines with precision 6.**
10. **Keep OSM data updated.** A geocoder or router that is two years stale will confidently route around a road that opened last spring.

None of these three tools require a licence, a per-request bill, or sending your customer addresses to a third party. That last point alone is often what makes the difference for GDPR-sensitive projects — the entire stack runs inside your own infrastructure, and the data never leaves it.

The learning curve is mostly a vocabulary problem. Once "SRID", "geography", "GiST", "isochrone", and "costing model" stop being unfamiliar words, the rest is ordinary engineering: a database, two HTTP services, and the good sense to put the cheap filter before the expensive one.
