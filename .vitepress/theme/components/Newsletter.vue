<script setup lang="ts">
import { ref } from "vue";

// Replace with your Buttondown username
const BUTTONDOWN_USERNAME = "supan";

const email = ref("");
const status = ref<"idle" | "loading" | "success" | "error">("idle");
const errorMessage = ref("");

const subscribe = async () => {
	if (!email.value || !email.value.includes("@")) {
		status.value = "error";
		errorMessage.value = "Please enter a valid email address";
		return;
	}

	status.value = "loading";
	errorMessage.value = "";

	try {
		// Buttondown API integration
		const response = await fetch(
			`https://api.buttondown.email/v1/subscribers`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email.value,
					tags: ["website"],
				}),
			}
		);

		if (response.ok || response.status === 201) {
			status.value = "success";
			email.value = "";
		} else {
			const data = await response.json();
			if (response.status === 409) {
				// Already subscribed
				status.value = "success";
				email.value = "";
			} else {
				throw new Error(data.detail || "Something went wrong");
			}
		}
	} catch (error) {
		// Fallback to form submission for CORS
		// Buttondown form endpoint doesn't require API key
		const formData = new FormData();
		formData.append("email", email.value);

		try {
			await fetch(
				`https://buttondown.email/api/emails/${BUTTONDOWN_USERNAME}`,
				{
					method: "POST",
					body: formData,
					mode: "no-cors", // Required for form submission
				}
			);

			// With no-cors, we can't read the response, but the request goes through
			status.value = "success";
			email.value = "";
		} catch (e) {
			status.value = "error";
			errorMessage.value = "Failed to subscribe. Please try again.";
		}
	}

	if (status.value === "success") {
		setTimeout(() => {
			status.value = "idle";
		}, 5000);
	}
};
</script>

<template>
	<div class="newsletter-wrapper">
		<div class="newsletter-card">
			<!-- Background decoration -->
			<div class="card-bg">
				<div class="bg-gradient"></div>
				<div class="bg-pattern"></div>
			</div>

			<!-- Content -->
			<div class="newsletter-content">
				<div class="newsletter-header">
					<div class="icon-wrapper">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
							/>
							<polyline points="22,6 12,13 2,6" />
						</svg>
					</div>
					<div class="header-text">
						<h3 class="newsletter-title">Stay in the Loop</h3>
						<p class="newsletter-subtitle">
							Get notified about new articles on .NET, cloud architecture, and
							software engineering best practices.
						</p>
					</div>
				</div>

				<!-- Form -->
				<form
					@submit.prevent="subscribe"
					class="newsletter-form"
					:class="{ 'is-success': status === 'success' }"
				>
					<div
						class="input-group"
						v-if="status !== 'success'"
					>
						<div class="input-wrapper">
							<input
								v-model="email"
								type="email"
								placeholder="your@email.com"
								required
								:disabled="status === 'loading'"
								class="email-input"
							/>
							<div class="input-focus-ring"></div>
						</div>
						<button
							type="submit"
							class="submit-btn"
							:disabled="status === 'loading'"
						>
							<span
								v-if="status === 'idle'"
								class="btn-text"
								>Subscribe</span
							>
							<span
								v-else-if="status === 'loading'"
								class="btn-loading"
							>
								<svg
									class="spinner"
									width="20"
									height="20"
									viewBox="0 0 24 24"
								>
									<circle
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="3"
										fill="none"
										stroke-dasharray="32"
										stroke-linecap="round"
									/>
								</svg>
							</span>
							<span
								v-else
								class="btn-text"
								>Try Again</span
							>
							<svg
								class="btn-arrow"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</button>
					</div>

					<!-- Success state -->
					<div
						v-if="status === 'success'"
						class="success-message"
					>
						<div class="success-icon">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</div>
						<div class="success-text">
							<strong>You're subscribed!</strong>
							<span>Check your inbox for a confirmation email.</span>
						</div>
					</div>

					<!-- Error state -->
					<p
						v-if="status === 'error' && errorMessage"
						class="error-message"
					>
						{{ errorMessage }}
					</p>
				</form>

				<!-- Trust indicators -->
				<div
					class="trust-indicators"
					v-if="status !== 'success'"
				>
					<span class="indicator">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						</svg>
						No spam, ever
					</span>
					<span class="indicator">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect
								x="3"
								y="11"
								width="18"
								height="11"
								rx="2"
								ry="2"
							/>
							<path d="M7 11V7a5 5 0 0110 0v4" />
						</svg>
						Unsubscribe anytime
					</span>
				</div>
			</div>

			<!-- Corner decoration -->
			<div class="corner-accent"></div>
		</div>
	</div>
</template>

<style scoped>
.newsletter-wrapper {
	width: 100%;
	max-width: 640px;
	margin: 0 auto;
}

.newsletter-card {
	position: relative;
	padding: 2.5rem;
	background: var(--color-bg-card);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 1.5rem;
	overflow: hidden;
}

/* Background decorations */
.card-bg {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.bg-gradient {
	position: absolute;
	top: -50%;
	right: -30%;
	width: 300px;
	height: 300px;
	background: radial-gradient(
		circle,
		var(--color-accent-dim) 0%,
		transparent 70%
	);
	opacity: 0.4;
}

.bg-pattern {
	position: absolute;
	inset: 0;
	background-image: linear-gradient(
			rgba(255, 255, 255, 0.015) 1px,
			transparent 1px
		),
		linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
	background-size: 30px 30px;
}

.corner-accent {
	position: absolute;
	top: 0;
	right: 0;
	width: 100px;
	height: 100px;
	background: linear-gradient(135deg, var(--color-accent-dim), transparent);
	opacity: 0.5;
}

/* Content */
.newsletter-content {
	position: relative;
	z-index: 1;
}

.newsletter-header {
	display: flex;
	gap: 1.25rem;
	margin-bottom: 2rem;
}

.icon-wrapper {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 52px;
	height: 52px;
	background: var(--color-accent-dim);
	border-radius: 14px;
	color: var(--color-accent);
}

.header-text {
	flex: 1;
}

.newsletter-title {
	font-family: var(--font-display);
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--color-text);
	margin-bottom: 0.375rem;
}

.newsletter-subtitle {
	font-size: 0.95rem;
	color: var(--color-text-muted);
	line-height: 1.5;
	margin: 0;
}

/* Form */
.newsletter-form {
	margin-bottom: 1.25rem;
}

.input-group {
	display: flex;
	gap: 0.75rem;
}

.input-wrapper {
	flex: 1;
	position: relative;
}

.email-input {
	width: 100%;
	padding: 1rem 1.25rem;
	font-family: var(--font-body);
	font-size: 1rem;
	color: var(--color-text);
	background: var(--color-bg-elevated);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	outline: none;
	transition: all 0.3s ease;
}

.email-input:focus {
	border-color: var(--color-accent);
	box-shadow: 0 0 0 3px var(--color-accent-dim);
}

.email-input::placeholder {
	color: var(--color-text-muted);
}

.email-input:disabled {
	opacity: 0.6;
}

.submit-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 1rem 1.75rem;
	font-family: var(--font-mono);
	font-size: 0.875rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--color-bg);
	background: var(--color-accent);
	border: none;
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	white-space: nowrap;
}

.submit-btn:hover:not(:disabled) {
	background: var(--color-text);
	transform: translateY(-2px);
	box-shadow: 0 10px 30px -10px rgba(0, 240, 255, 0.4);
}

.submit-btn:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.btn-arrow {
	transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) .btn-arrow {
	transform: translateX(3px);
}

.btn-loading .spinner {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* Success state */
.success-message {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.25rem;
	background: rgba(0, 240, 255, 0.1);
	border: 1px solid var(--color-accent-dim);
	border-radius: 12px;
	animation: fadeIn 0.4s ease;
}

.success-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	background: var(--color-accent);
	border-radius: 50%;
	color: var(--color-bg);
	flex-shrink: 0;
}

.success-text {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.success-text strong {
	color: var(--color-accent);
	font-weight: 600;
}

.success-text span {
	font-size: 0.875rem;
	color: var(--color-text-muted);
}

/* Error state */
.error-message {
	margin-top: 0.75rem;
	font-size: 0.875rem;
	color: #ff6b6b;
	padding-left: 0.25rem;
}

/* Trust indicators */
.trust-indicators {
	display: flex;
	flex-wrap: wrap;
	gap: 1.5rem;
}

.indicator {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	font-family: var(--font-mono);
	font-size: 0.75rem;
	color: var(--color-text-muted);
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.indicator svg {
	color: var(--color-accent);
}

/* Animations */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Responsive */
@media screen and (max-width: 600px) {
	.newsletter-card {
		padding: 2rem 1.5rem;
	}

	.newsletter-header {
		flex-direction: column;
		text-align: center;
	}

	.icon-wrapper {
		margin: 0 auto;
	}

	.input-group {
		flex-direction: column;
	}

	.submit-btn {
		width: 100%;
	}

	.trust-indicators {
		justify-content: center;
	}

	.success-message {
		flex-direction: column;
		text-align: center;
	}
}
</style>
