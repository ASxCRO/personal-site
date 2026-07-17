---
title: "From Documents to Semantic Search: pgvector, HNSW, and Azure AI Foundry"
date: 2026-07-17
description: "A practical guide to the RAG pipeline: pgvector in Docker, cosine distance, chunking, embedding models in Azure AI Foundry, ingestion, and HNSW indexing."
tags: ["PostgreSQL", "pgvector", "RAG", "Azure AI Foundry", "Embeddings"]
author: "Antonio Supan"
---

# From Documents to Semantic Search: pgvector, HNSW, and Azure AI Foundry

Traditional SQL search works great when we know exactly what we are looking for: a user ID, an order date, or an exact product name. The problem begins when a user asks, **"How can I cancel my contract before it expires?"**, while the document contains the sentence **"Early termination of the subscription agreement is possible under..."**

The words are different, but the meaning is the same. This is where embedding models and vector search come in.

In this post, we will put the entire picture together:

1. split a document into smaller pieces called chunks
2. send each chunk to an embedding model in Azure AI Foundry
3. store the resulting vector in PostgreSQL with the pgvector extension
4. convert the user's query into a vector using the same model
5. use cosine distance to find the most semantically similar chunks
6. speed up retrieval with an HNSW index as the number of records grows

This is the foundation of most RAG systems. The LLM is not the knowledge base. It receives relevant context from the database and generates an answer based on that context.

## What is an embedding?

An embedding model converts text into an array of numbers, for example:

```text
"early contract termination"
    ↓
[0.018, -0.043, 0.127, ..., -0.009]
```

Each number represents one dimension of the vector. An individual dimension has no useful meaning to a human, but together they describe the semantic characteristics of the text. Texts with similar meanings end up close to each other in this multidimensional space.

An embedding is not a summary, a hash, or encryption. It is a numerical representation of meaning optimized for comparison.

One important rule is that documents and user queries must be embedded with **the same model and the same number of dimensions**. We cannot store chunks as 1,536-dimensional vectors and then compare them with a 3,072-dimensional query vector.

## Why pgvector?

pgvector is a PostgreSQL extension that adds the `vector` type and operators for comparing vectors. This allows us to keep the following in the same database:

- the original chunk content
- metadata such as the document name, page number, and tenant ID
- the embedding
- traditional relationships to a user, project, or permission model

This is very practical for systems that already use PostgreSQL. We do not need to introduce a separate vector database just because we need semantic search, and we still retain transactions, SQL, backups, migrations, and a familiar operational model.

pgvector is not always the best answer. If we have hundreds of millions of vectors, extreme throughput requirements, or need advanced distributed vector infrastructure, a specialized system may make more sense. For a large number of business RAG applications, PostgreSQL and pgvector are an excellent starting point.

## Running pgvector in Docker

The quickest local setup uses the official pgvector image, which already contains PostgreSQL and the installed extension.

```yaml
# compose.yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    container_name: rag-postgres
    environment:
      POSTGRES_DB: knowledge
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local-development-only
    ports:
      - "5432:5432"
    volumes:
      - pgvector-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d knowledge"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  pgvector-data:
```

Start it with:

```bash
docker compose up -d
```

The image contains the extension, but we still need to enable it in the specific database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

In production, the password does not belong in the Compose file. It should come from a secret store, while PostgreSQL needs backups, monitoring, restricted network access, and an upgrade plan. Docker gives us reproducible local development here; it does not solve the entire production operating model.

## Data model

Suppose we deployed an embedding model in Azure AI Foundry and selected an output of 1,536 dimensions. We can define the table like this:

```sql
CREATE TABLE document_chunks (
    id              bigserial PRIMARY KEY,
    document_id     uuid NOT NULL,
    chunk_index     integer NOT NULL,
    content         text NOT NULL,
    source          text,
    page_number     integer,
    metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
    embedding_model text NOT NULL,
    embedding       vector(1536) NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (document_id, chunk_index)
);
```

The dimension in `vector(1536)` is not arbitrary. It must match the model configuration. If we change the model or its dimensions, it is safer to create a new column or table and re-embed the documents than to silently mix two incompatible vector spaces.

The `metadata` column is useful for flexible data, but frequently filtered values such as `tenant_id`, `document_id`, or a security classification are better stored in dedicated, indexed columns.

## Cosine distance

Cosine similarity measures the angle between two vectors:

```text
cosine_similarity(A, B) = (A · B) / (||A|| × ||B||)
```

If the vectors point in nearly the same direction, they are semantically similar. pgvector uses the `<=>` operator for cosine **distance**:

```sql
SELECT
    id,
    content,
    embedding <=> :query_embedding AS distance
FROM document_chunks
ORDER BY embedding <=> :query_embedding
LIMIT 5;
```

A smaller distance means a better result. If we want to show cosine similarity in the result, we can calculate it as follows:

```sql
SELECT
    id,
    content,
    1 - (embedding <=> :query_embedding) AS similarity
FROM document_chunks
ORDER BY embedding <=> :query_embedding
LIMIT 5;
```

These are the pgvector operators we will encounter most often:

| Operator | Metric | Typical use |
|---|---|---|
| `<=>` | cosine distance | text embedding models |
| `<->` | Euclidean, or L2, distance | when absolute distance matters |
| `<#>` | negative inner product | normalized vectors and certain models |

We should not choose a metric based on intuition. Follow the model's recommendation and use the same metric in both the index and the query.

## HNSW index

Without a vector index, PostgreSQL calculates the distance to every row. This is exact nearest-neighbor search: it is precise, but becomes expensive as the table grows.

HNSW, or **Hierarchical Navigable Small World**, builds a graph in which each vector is connected to neighboring vectors. The search does not visit every record. Instead, it navigates through the graph's layers and quickly approaches the relevant area.

```sql
CREATE INDEX CONCURRENTLY ix_document_chunks_embedding_hnsw
ON document_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

Here, `vector_cosine_ops` matches the `<=>` operator used by the query.

The most important parameters are:

- `m` — the number of connections retained by each node; a higher value usually improves recall but increases index size and build time
- `ef_construction` — the search width used while building the index; a higher value creates a better graph at the cost of a slower build
- `hnsw.ef_search` — the search width used at query time; a higher value usually improves recall at the cost of greater latency

We can configure the value for a single transaction like this:

```sql
BEGIN;
SET LOCAL hnsw.ef_search = 100;

SELECT id, content
FROM document_chunks
ORDER BY embedding <=> :query_embedding
LIMIT 5;

COMMIT;
```

HNSW is an approximate nearest-neighbor index. We gain significant speed, but the result is not mathematically guaranteed to be identical to a full scan. This is why we should not tune the index for speed alone. We measure both latency and recall@k against a real evaluation dataset.

For a small number of chunks, an index may not be necessary. Measure exact search first, then add HNSW when the volume and latency justify it.

## Document ingestion

Ingestion is more than "load a PDF and call the embedding endpoint." Retrieval quality often depends more on the ingestion pipeline than on the choice of LLM.

A typical pipeline looks like this:

```text
PDF / DOCX / HTML
        ↓
text and structure extraction
        ↓
cleaning and normalization
        ↓
chunking with metadata
        ↓
batch calls to the embedding model
        ↓
storing chunks and vectors in pgvector
```

The pipeline should be idempotent. Re-ingesting the same document must not create uncontrolled duplicate chunks. A practical approach is to calculate a hash of the source document and a hash of each chunk. If the content has not changed, we do not need to calculate its embedding again.

It is also useful to store:

- the document version
- the embedding model name and version
- the embedding dimensions
- chunking parameters
- ingestion time
- the source URL, page, and section title

This information later enables re-embedding, auditing, and displaying citations to the user.

## Chunking: where quality is usually gained or lost

An entire document is usually too large and thematically broad for a single embedding, so we divide it into chunks.

A chunk that is too small lacks context. A chunk that is too large mixes several topics, which makes the embedding less precise and gives the LLM unnecessary text. There is no universal size, but **400 to 800 tokens** with **10 to 20 percent overlap** is often a reasonable starting point.

It is better to split on natural structure than blindly after every N characters:

1. headings and subheadings
2. paragraphs
3. sentences
4. only then the maximum token count

It is useful to prepend the section heading to each chunk because a sentence such as "The conditions do not apply to business customers" can lose its meaning without the heading.

Overlap helps when an important idea lies on the boundary between two chunks, but it is not free. It increases the number of vectors, embedding cost, index size, and the chance that retrieval returns nearly identical results.

Tables, code, and lists need special treatment. A table often needs to be converted into readable text while preserving column headings. Code is better split by classes and functions than by character count.

Chunking parameters are not constants that we guess once. They are part of the evaluation process.

## Embedding models in Azure AI Foundry

Azure AI Foundry provides a central place to discover and deploy models, manage access, and connect them to Azure applications. For embeddings, we can select a model from the available catalog and create a deployment, for example using a model from the `text-embedding-3` family.

When selecting a model, we consider:

- quality for the language and domain of our documents
- maximum input length
- output dimensions and whether dimension reduction is supported
- cost and quotas
- latency and regional availability
- data processing requirements and network isolation

A larger embedding does not automatically create a better system. More dimensions require more database storage, a larger HNSW index, more memory, and more expensive searches. The model should be evaluated against real user questions, including the Croatian language and the application's specialist terminology when relevant.

A conceptual call to the embedding endpoint looks like this:

```http
POST {foundry-endpoint}/openai/deployments/{deployment}/embeddings?api-version={api-version}
Content-Type: application/json

{
  "input": [
    "Heading: Early termination\nThe customer may terminate the contract..."
  ],
  "dimensions": 1536
}
```

The exact endpoint and supported parameters depend on the deployment type and API version. We keep them in application configuration, and we should prefer Microsoft Entra ID and managed identities for authentication instead of hardcoded keys.

Batching multiple chunks into one request reduces overhead, but we must respect input and request limits. The pipeline needs retries with backoff for transient failures and controlled concurrency so it does not continuously hit rate limits.

## End-to-end retrieval

Once the documents have been ingested, the retrieval flow is short:

```text
user question
        ↓
embedding with the same model and dimensions
        ↓
SQL filters for tenant, permissions, and version
        ↓
HNSW cosine search, top K
        ↓
optional reranking
        ↓
chunks supplied to the LLM as context
        ↓
answer with citations
```

Here is an example query with a mandatory tenant filter:

```sql
SELECT
    id,
    document_id,
    content,
    source,
    page_number,
    1 - (embedding <=> :query_embedding) AS similarity
FROM document_chunks
WHERE tenant_id = :tenant_id
ORDER BY embedding <=> :query_embedding
LIMIT 8;
```

In the real schema, `tenant_id` must exist as a column and have a regular B-tree index. A security filter is not something we delegate to a prompt. We must not retrieve data from all tenants first and then expect the LLM to ignore it.

Top K does not mean "send everything you find." We might retrieve 20 candidates, rerank them, and send the best 5 that fit within the planned context budget.

## How it all fits together as an architecture

Each component has one clear responsibility:

| Component | Responsibility |
|---|---|
| document parser | extract text and structure |
| chunker | create semantically useful units |
| Azure AI Foundry embedding deployment | convert text into vectors |
| PostgreSQL and pgvector | persist content, metadata, and vectors |
| HNSW | quickly find approximate nearest vectors |
| LLM | compose an answer from the retrieved context |

The key point is that the embedding model **does not answer the question**. pgvector **does not understand the document like a human**. HNSW **does not generate text**. The LLM **should not invent the knowledge base**. The system works because each part solves a limited problem and the pipeline connects them.

This separation also gives us practical benefits:

- we embed documents once and search them many times
- we can change the LLM without repeating ingestion if the embedding model remains the same
- we can rebuild HNSW without parsing the documents again
- we can evaluate retrieval separately from the quality of the generated answer
- SQL filters keep business and security rules close to the data

## What to measure before production

One good demo query is not proof of quality. We need a set of real questions and, for each question, an indication of which chunk or document contains the answer.

Then we measure:

- **recall@k** — whether a relevant chunk appears among the top K results
- **precision@k** — how many of the retrieved chunks are actually relevant
- **latency** — the time spent on the embedding call, SQL search, reranking, and generation
- **groundedness** — whether the answer is supported by the retrieved content
- **cost** — ingestion, queries, storage, and generation

If retrieval does not find the right chunk, a larger LLM will not magically solve the problem. That is when we examine extraction, chunking, metadata, the embedding model, the distance metric, HNSW parameters, and query formulation.

## Conclusion

pgvector makes sense because it brings vector search into a database that many teams already understand. The Docker image provides a fast, repeatable local setup. Cosine distance turns semantic similarity into a sorted SQL result. HNSW allows the same principle to remain fast over a larger number of chunks. Azure AI Foundry provides a managed embedding model, identity, quotas, and a place to operate model deployments.

Still, the most important part is not any individual technology. The value comes from a well-designed ingestion and retrieval pipeline:

- preserve the document's structure
- chunk by meaning, not only by character count
- use the same embedding space for documents and queries
- filter permissions before retrieval
- measure quality using real questions
- version the model and pipeline parameters

At that point, RAG stops being a magical AI trick. It becomes a regular, understandable data system: a document goes in, relevant context comes out, and the model receives enough verifiable facts to compose a useful answer.
