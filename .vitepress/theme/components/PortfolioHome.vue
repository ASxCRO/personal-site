<script setup lang="ts">
import { ref } from "vue";
import Contact from "./Contact.vue";
import Testimonials from "./Testimonials.vue";
import { useGsapMotion } from "../composables/useGsapMotion";

const root = ref<HTMLElement | null>(null);
useGsapMotion(root);

const metrics = [
	{ value: "7", label: "years delivering enterprise software" },
	{ value: "AI", label: "automation, agents and Azure AI Foundry" },
	{ value: ".NET", label: "APIs, integrations and production systems" },
];

const focusAreas = [
	"Azure AI solution design",
	"LLM API integrations",
	"Agent-based workflows",
	"CRM/ERP process automation",
	"OCR and screening agents",
	"Reliable .NET APIs",
];

const jobs = [
	{
		period: "Oct 2025 - Present",
		company: "COMBIS d.o.o.",
		title: "Software Engineer / AI & Automation Developer",
		body: "Lead delivery across projects for Osijek Kindergartens, CARNET, Croatian Customs Administration, Croatian Telecom, Altpro, APIS IT / APIS Centre, Zagreb City Housing, Coca-Cola HBC and Atlantic Group.",
		tags: [
			".NET APIs",
			"Azure DevOps",
			"AI automation",
			"Integrations",
			"Production support",
		],
		current: true,
	},
	{
		period: "Jun 2024 - Sep 2025",
		company: "Axians Hrvatska d.o.o.",
		title: "Senior Software Engineer",
		body: "Owned full-stack .NET services, Azure provisioning, infrastructure automation, CI/CD and production troubleshooting on the Ministry visa-system project.",
		tags: ["Azure", "CI/CD", "Logstash/Kibana", "Outbox", "Idempotency"],
	},
	{
		period: "May 2023 - May 2024",
		company: "Eviden d.o.o. / Atos ecosystem",
		title: "Software Engineer",
		body: "Delivered C#/SQL components, documentation and operational handover for the eHZZO national healthcare platform, approx. EUR 17M.",
		tags: ["C#", "SQL", "Healthcare", "Documentation"],
	},
	{
		period: "Oct 2021 - Apr 2023",
		company: "Financial Agency - FINA",
		title: "Developer / IT Specialist",
		body: "Delivered SQL/backend features, integrations and reporting flows for InfoBiz and eFondovi, reducing manual handling and improving data reliability.",
		tags: [".NET", "T-SQL", "Reporting", "Integrations"],
	},
	{
		period: "Nov 2019 - Oct 2021",
		company: "Financial Agency - FINA",
		title: "Student Software Engineer",
		body: "Supported full-stack development and maintenance of enterprise apps, building foundations in .NET, T-SQL, integrations and structured delivery.",
		tags: [".NET", "T-SQL", "Enterprise apps"],
	},
];

const technicalAreas = [
	{
		title: "Backend / full-stack",
		text: "C#, .NET, APIs, TypeScript, Vue/React and production workflows.",
	},
	{
		title: "Infrastructure",
		text: "Azure, Azure DevOps, CI/CD, Docker, IIS and provisioning.",
	},
	{
		title: "Data and observability",
		text: "MSSQL, T-SQL, Logstash, Kibana and troubleshooting.",
	},
	{
		title: "Reliability",
		text: "Outbox processing, idempotency, production support and cost-aware automation.",
	},
];

const highlights = [
	"Lead/client delivery across Osijek Kindergartens, CARNET, Croatian Customs Administration, Croatian Telecom, Altpro, APIS IT / APIS Centre, Zagreb City Housing, Coca-Cola HBC and Atlantic Group.",
	"Large public systems: Ministry visa system and the eHZZO national healthcare platform, approx. EUR 17M.",
	"Impact: faster request handling, CRM/ERP automation, OCR/screening agents and reusable CI/CD/process patterns that reduce manual work.",
];
</script>

<template>
	<main
		ref="root"
		class="portfolio-home"
	>
		<section
			class="hero-shell"
			data-hero
		>
			<div
				class="hero-panel container"
				data-hero-panel
			>
				<div class="hero-copy">
					<p
						class="kicker"
						data-reveal
					>
						Azure AI Solution Engineer / Software Developer
					</p>
					<h1 data-reveal>Antonio Supan</h1>
					<p
						class="hero-lede"
						data-reveal
					>
						Software engineer with 7 years of experience delivering enterprise,
						public-sector and financial systems across full-stack .NET, SQL,
						APIs and Azure, with a practical focus on AI automation and reliable
						production workflows.
					</p>
					<div
						class="hero-actions"
						data-reveal
					>
						<a
							href="#contact"
							class="btn btn-primary"
							>Start a conversation</a
						>
						<a
							href="/assets/cv.pdf"
							target="_blank"
							rel="noopener noreferrer"
							class="btn"
							>Download CV</a
						>
					</div>
				</div>

				<div
					class="hero-visual"
					data-reveal
				>
					<div
						class="cv-mark"
						aria-hidden="true"
					>
						AS
					</div>
					<div
						class="profile-frame"
						data-parallax-profile
					>
						<img
							src="/assets/profile.jpg"
							alt="Antonio Supan"
						/>
					</div>
					<div class="status-card">
						<span>Current role</span>
						<strong>COMBIS - AI & Automation Developer</strong>
					</div>
				</div>
			</div>
		</section>

		<section
			id="about"
			class="positioning-section"
			data-section
		>
			<div class="container">
				<div class="section-heading">
					<p
						class="section-kicker"
						data-section-reveal
					>
						Positioning
					</p>
					<h2 data-section-reveal>
						Azure, AI and software delivery that survives production.
					</h2>
				</div>
				<div class="metrics-grid">
					<article
						v-for="metric in metrics"
						:key="metric.label"
						class="metric-card"
						data-section-reveal
					>
						<strong>{{ metric.value }}</strong>
						<span>{{ metric.label }}</span>
					</article>
				</div>
				<div
					class="focus-strip"
					data-section-reveal
				>
					<span
						v-for="area in focusAreas"
						:key="area"
						>{{ area }}</span
					>
				</div>
			</div>
		</section>

		<section
			id="experience"
			class="experience-section"
			data-section
			data-experience
		>
			<div class="container experience-layout">
				<div class="section-heading sticky-heading">
					<p
						class="section-kicker"
						data-section-reveal
					>
						Experience
					</p>
					<h2 data-section-reveal>
						Enterprise delivery, integrations and automation leadership.
					</h2>
				</div>
				<div class="timeline">
					<div
						class="timeline-track"
						aria-hidden="true"
					>
						<div
							class="timeline-progress"
							data-timeline-progress
						></div>
					</div>
					<article
						v-for="job in jobs"
						:key="job.company + job.period"
						class="job-card"
						:class="{ current: job.current }"
						data-section-reveal
					>
						<div class="job-period">{{ job.period }}</div>
						<div>
							<h3>{{ job.company }}</h3>
							<p class="job-title">{{ job.title }}</p>
							<p>{{ job.body }}</p>
							<div class="tag-list">
								<span
									v-for="tag in job.tags"
									:key="tag"
									>{{ tag }}</span
								>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section
			id="technical"
			class="technical-section"
			data-section
		>
			<div class="container">
				<div class="section-heading">
					<p
						class="section-kicker"
						data-section-reveal
					>
						Technical areas
					</p>
					<h2 data-section-reveal>
						Full-stack engineering with an automation spine.
					</h2>
				</div>
				<div class="technical-grid">
					<article
						v-for="area in technicalAreas"
						:key="area.title"
						data-section-reveal
					>
						<h3>{{ area.title }}</h3>
						<p>{{ area.text }}</p>
					</article>
				</div>
			</div>
		</section>

		<section
			id="impact"
			class="impact-section"
			data-section
		>
			<div class="container impact-layout">
				<div class="section-heading">
					<p
						class="section-kicker"
						data-section-reveal
					>
						Project highlights
					</p>
					<h2 data-section-reveal>
						Work across public systems, enterprise clients and AI automation.
					</h2>
				</div>
				<div class="highlight-list">
					<article
						v-for="(highlight, index) in highlights"
						:key="highlight"
						data-section-reveal
					>
						<span>{{ String(index + 1).padStart(2, "0") }}</span>
						<p>{{ highlight }}</p>
					</article>
				</div>
			</div>
		</section>

		<Testimonials />
		<Contact />
	</main>
</template>

<style scoped>
.portfolio-home {
	background: var(--color-bg);
	color: var(--color-text);
	overflow: hidden;
}

.hero-shell {
	min-height: 118vh;
	padding: 3rem 0 12rem;
	margin: 0;
	background:
		linear-gradient(90deg, rgba(48, 80, 100, 0.94) 0 11vw, transparent 11vw),
		linear-gradient(
			132deg,
			transparent 0 55%,
			rgba(0, 173, 213, 0.18) 55% 66%,
			transparent 66%
		),
		var(--color-paper);
}

.hero-panel {
	min-height: 92vh;
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(320px, 0.86fr);
	align-items: center;
	gap: clamp(2rem, 6vw, 6rem);
	position: relative;
}

.hero-copy {
	max-width: 760px;
	padding-top: 6rem;
}

.kicker,
.section-kicker {
	font-family: var(--font-mono);
	text-transform: uppercase;
	letter-spacing: 0.16em;
	font-size: 0.78rem;
	color: var(--color-accent);
	font-weight: 700;
}

.hero-copy h1 {
	margin: 1rem 0;
	font-size: clamp(4rem, 11vw, 9rem);
	letter-spacing: 0;
	line-height: 0.9;
	color: var(--color-text);
}

.hero-lede {
	max-width: 650px;
	font-size: clamp(1.08rem, 2vw, 1.35rem);
	line-height: 1.65;
	color: var(--color-text-secondary);
}

.hero-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin-top: 2.25rem;
}

.hero-visual {
	position: relative;
	min-height: 600px;
	display: grid;
	place-items: center;
}

.cv-mark {
	position: absolute;
	left: 0;
	top: 8%;
	font-size: clamp(5rem, 11vw, 9rem);
	font-weight: 800;
	color: rgba(48, 80, 100, 0.08);
	letter-spacing: 0.02em;
}

.profile-frame {
	width: min(430px, 82vw);
	aspect-ratio: 0.78;
	border-radius: 34px;
	overflow: hidden;
	border: 1px solid rgba(48, 80, 100, 0.15);
	box-shadow: 0 42px 90px rgba(36, 55, 68, 0.18);
	background: white;
}

.profile-frame img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.status-card {
	position: absolute;
	right: 0;
	bottom: 12%;
	width: min(270px, 76vw);
	padding: 1rem 1.1rem;
	background: rgba(255, 255, 255, 0.74);
	backdrop-filter: blur(22px);
	border: 1px solid rgba(255, 255, 255, 0.8);
	box-shadow: 0 20px 60px rgba(48, 80, 100, 0.16);
}

.status-card span {
	display: block;
	font-family: var(--font-mono);
	font-size: 0.7rem;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	color: var(--color-text-muted);
	margin-bottom: 0.35rem;
}

.status-card strong {
	font-size: 0.96rem;
	color: var(--color-text);
}

.positioning-section,
.experience-section,
.technical-section,
.impact-section {
	padding: clamp(5rem, 10vw, 9rem) 0;
	margin: 0;
	border-top: 1px solid var(--color-line);
}

.section-heading {
	max-width: 820px;
	margin-bottom: 3rem;
}

.section-heading h2 {
	margin-top: 0.75rem;
	font-size: clamp(2.25rem, 5vw, 5rem);
	line-height: 0.98;
	letter-spacing: 0;
}

.metrics-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	border-top: 1px solid var(--color-line);
	border-bottom: 1px solid var(--color-line);
}

.metric-card {
	padding: clamp(1.5rem, 4vw, 3rem);
	border-right: 1px solid var(--color-line);
}

.metric-card:last-child {
	border-right: 0;
}

.metric-card strong {
	display: block;
	font-size: clamp(2.5rem, 6vw, 5rem);
	line-height: 1;
	color: var(--color-slate);
}

.metric-card span {
	display: block;
	margin-top: 1rem;
	max-width: 250px;
	color: var(--color-text-secondary);
}

.focus-strip,
.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.65rem;
}

.focus-strip {
	margin-top: 2rem;
}

.focus-strip span,
.tag-list span {
	padding: 0.55rem 0.8rem;
	border: 1px solid var(--color-line);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.58);
	font-family: var(--font-mono);
	font-size: 0.76rem;
	color: var(--color-slate);
}

.experience-section {
	background: #eef3f5;
}

.experience-layout {
	display: grid;
	grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.28fr);
	gap: clamp(2rem, 6vw, 6rem);
}

.sticky-heading {
	position: sticky;
	top: 7rem;
	align-self: start;
}

.timeline {
	position: relative;
	display: grid;
	gap: 1.25rem;
	padding-left: 2.5rem;
}

.timeline-track {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 2px;
	background: rgba(48, 80, 100, 0.14);
	overflow: hidden;
}

.timeline-progress {
	width: 100%;
	height: 100%;
	background: var(--color-accent);
	transform: scaleY(0);
}

.job-card {
	display: grid;
	grid-template-columns: 150px minmax(0, 1fr);
	gap: 1.5rem;
	padding: clamp(1.25rem, 3vw, 2rem);
	background: rgba(255, 255, 255, 0.9);
	border: 1px solid rgba(48, 80, 100, 0.18);
	box-shadow: 0 24px 70px rgba(48, 80, 100, 0.07);
}

.job-card.current {
	border-color: rgba(0, 173, 213, 0.45);
}

.job-period {
	font-family: var(--font-mono);
	font-size: 0.78rem;
	color: rgba(31, 43, 53, 0.58);
}

.job-card h3 {
	font-size: 1.15rem;
	margin-bottom: 0.25rem;
	color: var(--color-text);
}

.job-title {
	font-weight: 700;
	color: var(--color-slate);
	margin-bottom: 0.8rem;
}

.job-card p {
	font-size: 0.98rem;
	color: rgba(31, 43, 53, 0.72);
}

.tag-list {
	margin-top: 1rem;
}

.technical-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	border: 1px solid var(--color-line);
}

.technical-grid article {
	padding: clamp(1.35rem, 3vw, 2rem);
	border-right: 1px solid var(--color-line);
	background: rgba(255, 255, 255, 0.44);
}

.technical-grid article:last-child {
	border-right: 0;
}

.technical-grid h3 {
	font-size: 1.05rem;
	margin-bottom: 1rem;
}

.technical-grid p {
	font-size: 0.96rem;
}

.impact-layout {
	display: grid;
	grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
	gap: clamp(2rem, 6vw, 6rem);
	align-items: start;
}

.highlight-list {
	display: grid;
	gap: 1px;
	background: var(--color-line);
	border: 1px solid var(--color-line);
}

.highlight-list article {
	display: grid;
	grid-template-columns: 70px minmax(0, 1fr);
	gap: 1rem;
	padding: 1.35rem;
	background: var(--color-paper);
}

.highlight-list span {
	font-family: var(--font-mono);
	color: var(--color-accent);
	font-weight: 800;
}

@media (max-width: 980px) {
	.hero-shell {
		min-height: auto;
		padding-bottom: 5rem;
		background:
			linear-gradient(
				180deg,
				rgba(48, 80, 100, 0.95) 0 8.5rem,
				transparent 8.5rem
			),
			var(--color-paper);
	}

	.hero-panel,
	.experience-layout,
	.impact-layout {
		grid-template-columns: 1fr;
	}

	.hero-copy {
		padding-top: 4rem;
	}

	.hero-visual {
		min-height: 420px;
	}

	.sticky-heading {
		position: static;
	}

	.metrics-grid,
	.technical-grid {
		grid-template-columns: 1fr;
	}

	.metric-card,
	.technical-grid article {
		border-right: 0;
		border-bottom: 1px solid var(--color-line);
	}

	.metric-card:last-child,
	.technical-grid article:last-child {
		border-bottom: 0;
	}
}

@media (max-width: 640px) {
	.hero-copy h1 {
		font-size: clamp(3.2rem, 18vw, 5rem);
	}

	.hero-actions {
		flex-direction: column;
	}

	.job-card {
		grid-template-columns: 1fr;
	}

	.highlight-list article {
		grid-template-columns: 1fr;
	}
}
</style>
