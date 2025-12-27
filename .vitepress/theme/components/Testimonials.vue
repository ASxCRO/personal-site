<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Testimonial {
	name: string;
	role: string;
	company: string;
	quote: string;
	linkedin?: string;
}

const testimonials: Testimonial[] = [
	{
		name: "Aleksandar Novakovic",
		role: "Software Engineer",
		company: "Zaunergroup",
		quote:
			"Antonio is an exceptional .NET engineer and mentor. His ability to explain complex .NET concepts in a practical, hands-on way helped accelerate my growth and deepen my understanding of professional software development.",
		linkedin: "https://www.linkedin.com/in/aleksandar-novak",
	},
	{
		name: "Antonio Sertić",
		role: "Software Engineer",
		company: "FINA",
		quote:
			"Antonio's .NET skills are top-tier. What truly sets him apart is his ability to communicate technical concepts clearly across cross-functional teams, bridging the gap between engineering, product, and stakeholders.",
		linkedin: "https://www.linkedin.com/in/antoniosertic/",
	},
	{
		name: "Antonio Gotovac",
		role: "CEO",
		company: "Celegreety",
		quote:
			"Antonio is the most competent software architect I've worked with across all my roles and industries. He single-handedly designed our entire end-to-end marketplace.",
		linkedin: "https://www.linkedin.com/in/antoniogotovac/",
	},
	{
		name: "Ivo Jercic",
		role: "Software Engineer",
		company: "PseudoCode",
		quote:
			"Antonio is a reliable and skilled backend developer. He was always easy to work with, open to collaboration, and ready to help whenever needed. I would gladly work with him again.",
		linkedin: "https://www.linkedin.com/in/ijercic/",
	},
	{
		name: "Vedran Borozan",
		role: "Business Analyst",
		company: "AbySalto",
		quote:
			"Antonio didn't just write code — he elevated our technical discussions, offered thoughtful insights, and helped shape the architectural decisions that strengthened our product.",
		linkedin: "https://www.linkedin.com/in/vedran-borozan-2bb97b217/",
	},
	{
		name: "Valentin Tomasevic",
		role: "Founder & CEO",
		company: "Vantage Consulting",
		quote:
			"What truly sets Antonio apart is his combination of technical excellence and collaborative mindset. He works with clarity and precision, while still being adaptable and open to feedback.",
		linkedin: "https://www.linkedin.com/in/valentintomasevic/",
	},
];

const currentSlide = ref(0);
const isTransitioning = ref(false);
const isPaused = ref(false);
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

const nextSlide = () => {
	if (isTransitioning.value) return;
	isTransitioning.value = true;
	currentSlide.value = (currentSlide.value + 1) % testimonials.length;
	setTimeout(() => {
		isTransitioning.value = false;
	}, 500);
};

const prevSlide = () => {
	if (isTransitioning.value) return;
	isTransitioning.value = true;
	currentSlide.value =
		(currentSlide.value - 1 + testimonials.length) % testimonials.length;
	setTimeout(() => {
		isTransitioning.value = false;
	}, 500);
};

const goToSlide = (index: number) => {
	if (isTransitioning.value || index === currentSlide.value) return;
	isTransitioning.value = true;
	currentSlide.value = index;
	setTimeout(() => {
		isTransitioning.value = false;
	}, 500);
};

const startAutoplay = () => {
	if (autoplayInterval) return;
	autoplayInterval = setInterval(() => {
		if (!isPaused.value) {
			nextSlide();
		}
	}, 6000);
};

const pauseAutoplay = () => {
	isPaused.value = true;
};

const resumeAutoplay = () => {
	isPaused.value = false;
};

onMounted(() => {
	startAutoplay();
});

onUnmounted(() => {
	if (autoplayInterval) {
		clearInterval(autoplayInterval);
	}
});

const getInitials = (name: string) => {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
};
</script>

<template>
	<section
		id="testimonials"
		class="testimonials-section"
	>
		<div class="section-header">
			<span class="section-eyebrow">What colleagues say</span>
			<h2 class="section-title"><span class="text-gradient">Recommendations</span></h2>
		</div>

		<div
			class="carousel-container"
			@mouseenter="pauseAutoplay"
			@mouseleave="resumeAutoplay"
		>
			<!-- Quote decoration -->
			<div
				class="quote-decoration"
				aria-hidden="true"
			>
				<svg
					viewBox="0 0 100 100"
					fill="currentColor"
				>
					<path
						d="M30 10C13.4 10 0 23.4 0 40c0 16.6 13.4 30 30 30 0 11-9 20-20 20v10c22.1 0 40-17.9 40-40V40c0-16.6-13.4-30-30-30zm60 0c-16.6 0-30 13.4-30 30 0 16.6 13.4 30 30 30 0 11-9 20-20 20v10c22.1 0 40-17.9 40-40V40c0-16.6-13.4-30-30-30z"
					/>
				</svg>
			</div>

			<!-- Slides -->
			<div class="slides-wrapper">
				<div
					v-for="(testimonial, index) in testimonials"
					:key="testimonial.name"
					:class="['testimonial-card', { active: index === currentSlide }]"
				>
					<blockquote class="quote-text">
						{{ testimonial.quote }}
					</blockquote>

					<div class="author-info">
						<div class="author-avatar">
							<span class="initials">{{ getInitials(testimonial.name) }}</span>
						</div>

						<div class="author-details">
							<div class="author-name-row">
								<h4 class="author-name">{{ testimonial.name }}</h4>
								<a
									v-if="testimonial.linkedin"
									:href="testimonial.linkedin"
									target="_blank"
									rel="noopener noreferrer"
									class="linkedin-link"
									:aria-label="`${testimonial.name}'s LinkedIn profile`"
								>
									<svg
										viewBox="0 0 24 24"
										fill="currentColor"
										class="linkedin-icon"
									>
										<path
											d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
										/>
									</svg>
								</a>
							</div>
							<p class="author-role">
								<span class="role">{{ testimonial.role }}</span>
								<span class="separator">at</span>
								<span class="company">{{ testimonial.company }}</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<div class="carousel-nav">
				<button
					class="nav-arrow nav-prev"
					@click="prevSlide"
					aria-label="Previous testimonial"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
				</button>

				<div class="nav-dots">
					<button
						v-for="(_, index) in testimonials"
						:key="index"
						:class="['nav-dot', { active: index === currentSlide }]"
						@click="goToSlide(index)"
						:aria-label="`Go to testimonial ${index + 1}`"
					>
						<span class="dot-inner"></span>
						<svg
							class="dot-progress"
							viewBox="0 0 36 36"
						>
							<circle
								cx="18"
								cy="18"
								r="16"
							/>
						</svg>
					</button>
				</div>

				<button
					class="nav-arrow nav-next"
					@click="nextSlide"
					aria-label="Next testimonial"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</button>
			</div>

			<!-- Slide counter -->
			<div class="slide-counter">
				<span class="current">{{
					String(currentSlide + 1).padStart(2, "0")
				}}</span>
				<span class="divider">/</span>
				<span class="total">{{
					String(testimonials.length).padStart(2, "0")
				}}</span>
			</div>
		</div>
	</section>
</template>

<style scoped>
.testimonials-section {
	padding: 6rem 1.5rem;
	position: relative;
	overflow: hidden;
}

.testimonials-section::before {
	content: "";
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	max-width: 800px;
	height: 100%;
	background: radial-gradient(
		ellipse at center top,
		var(--color-accent-dim) 0%,
		transparent 70%
	);
	pointer-events: none;
}

.carousel-container {
	max-width: 800px;
	margin: 0 auto;
	position: relative;
	padding: 0 1rem;
}

.quote-decoration {
	position: absolute;
	top: -1rem;
	left: 50%;
	transform: translateX(-50%);
	width: 80px;
	height: 80px;
	color: var(--color-accent);
	opacity: 0.08;
	pointer-events: none;
	z-index: 0;
}

.slides-wrapper {
	position: relative;
	min-height: 320px;
}

.testimonial-card {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	background: var(--color-bg-card);
	backdrop-filter: blur(10px);
	border-radius: 24px;
	padding: 3rem 2.5rem 2.5rem;
	border: 1px solid rgba(255, 255, 255, 0.05);
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15),
		0 1px 2px rgba(255, 255, 255, 0.02) inset;
	opacity: 0;
	transform: translateY(20px) scale(0.98);
	transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	pointer-events: none;
}

.testimonial-card::before {
	content: "";
	position: absolute;
	inset: 0;
	background: linear-gradient(
		135deg,
		var(--color-accent-dim) 0%,
		transparent 50%
	);
	border-radius: 24px;
	opacity: 0;
	transition: opacity 0.4s ease;
}

.testimonial-card.active {
	opacity: 1;
	transform: translateY(0) scale(1);
	pointer-events: auto;
}

.testimonial-card.active::before {
	opacity: 0.5;
}

.quote-text {
	font-size: clamp(1rem, 2.5vw, 1.125rem);
	line-height: 1.8;
	color: var(--color-text-secondary);
	margin: 0 0 2rem;
	font-style: italic;
	text-align: center;
	position: relative;
}

.quote-text::before,
.quote-text::after {
	color: var(--color-accent);
	font-size: 1.5em;
	opacity: 0.5;
}

.quote-text::before {
	content: '"';
}

.quote-text::after {
	content: '"';
}

.author-info {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}

.author-avatar {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: linear-gradient(
		135deg,
		var(--color-accent) 0%,
		var(--color-warm) 100%
	);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	box-shadow: 0 4px 12px var(--color-accent-glow);
}

.initials {
	font-family: var(--font-mono);
	font-size: 1rem;
	font-weight: 600;
	color: var(--color-bg);
	letter-spacing: 0.05em;
}

.author-details {
	text-align: left;
}

.author-name-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.author-name {
	font-family: var(--font-display);
	font-size: 1.125rem;
	font-weight: 600;
	color: var(--color-text);
	margin: 0;
	letter-spacing: -0.01em;
}

.linkedin-link {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	color: var(--color-text-secondary);
	transition: all 0.2s ease;
	opacity: 0.7;
}

.linkedin-link:hover {
	color: #0a66c2;
	opacity: 1;
	transform: scale(1.1);
}

.linkedin-icon {
	width: 16px;
	height: 16px;
}

.author-role {
	font-size: 0.875rem;
	color: var(--color-text-secondary);
	margin: 0.25rem 0 0;
	display: flex;
	align-items: center;
	gap: 0.35rem;
	flex-wrap: wrap;
}

.role {
	color: var(--color-text-muted);
}

.separator {
	opacity: 0.5;
}

.company {
	color: var(--color-accent);
	font-weight: 500;
}

.carousel-nav {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1.5rem;
	margin-top: 2.5rem;
}

.nav-arrow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: var(--color-text-secondary);
	cursor: pointer;
	transition: all 0.3s var(--ease-out-expo);
}

.nav-arrow:hover {
	background: var(--color-accent);
	border-color: var(--color-accent);
	color: var(--color-bg);
	transform: scale(1.05);
	box-shadow: 0 0 20px var(--color-accent-glow);
}

.nav-arrow svg {
	width: 20px;
	height: 20px;
}

.nav-dots {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.nav-dot {
	position: relative;
	width: 36px;
	height: 36px;
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dot-inner {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--color-text-muted);
	opacity: 0.3;
	transition: all 0.3s ease;
}

.nav-dot.active .dot-inner {
	background: var(--color-accent);
	opacity: 1;
	transform: scale(1.2);
}

.nav-dot:hover .dot-inner {
	opacity: 0.6;
}

.dot-progress {
	position: absolute;
	top: 0;
	left: 0;
	width: 36px;
	height: 36px;
	transform: rotate(-90deg);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.nav-dot.active .dot-progress {
	opacity: 1;
}

.dot-progress circle {
	fill: none;
	stroke: var(--color-accent);
	stroke-width: 2;
	stroke-dasharray: 100;
	stroke-dashoffset: 100;
	stroke-linecap: round;
}

.nav-dot.active .dot-progress circle {
	animation: progress 6s linear forwards;
}

@keyframes progress {
	to {
		stroke-dashoffset: 0;
	}
}

.slide-counter {
	position: absolute;
	bottom: -3rem;
	right: 1rem;
	font-family: var(--font-mono);
	font-size: 0.75rem;
	font-weight: 500;
	letter-spacing: 0.1em;
	color: var(--color-text-muted);
	opacity: 0.5;
}

.slide-counter .current {
	color: var(--color-accent);
	font-weight: 600;
}

.slide-counter .divider {
	margin: 0 0.25rem;
	opacity: 0.5;
}

/* Mobile adjustments */
@media (max-width: 640px) {
	.testimonials-section {
		padding: 4rem 1rem;
	}

	.testimonial-card {
		padding: 2rem 1.5rem;
	}

	.slides-wrapper {
		min-height: 380px;
	}

	.author-info {
		flex-direction: column;
		text-align: center;
	}

	.author-details {
		text-align: center;
	}

	.author-name-row {
		justify-content: center;
	}

	.author-role {
		justify-content: center;
	}

	.nav-arrow {
		width: 40px;
		height: 40px;
	}

	.carousel-nav {
		gap: 1rem;
	}

	.slide-counter {
		position: static;
		text-align: center;
		margin-top: 2rem;
	}
}
</style>
