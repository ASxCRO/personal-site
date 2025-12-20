<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const status = ref<"idle" | "loading" | "success" | "error">("idle");

const subscribe = async () => {
	if (!email.value) return;

	status.value = "loading";

	// Simulate newsletter subscription
	// Replace with actual newsletter provider integration (Buttondown, Mailchimp, etc.)
	await new Promise((resolve) => setTimeout(resolve, 1000));

	status.value = "success";
	email.value = "";

	setTimeout(() => {
		status.value = "idle";
	}, 3000);
};
</script>

<template>
	<div
		class="bg-[color:var(--color-bg-variant)] rounded-2xl p-8 text-center max-w-xl mx-auto!"
	>
		<h3 class="text-[color:var(--color-primary)] text-xl mb-2">
			Subscribe to my Newsletter
		</h3>
		<p class="text-[color:var(--color-light)] text-sm mb-6">
			Get the latest articles on .NET, software architecture, and development
			best practices delivered to your inbox.
		</p>
		q

		<form
			@submit.prevent="subscribe"
			class="flex flex-col sm:flex-row gap-4"
		>
			<input
				v-model="email"
				type="email"
				placeholder="your@email.com"
				required
				class="flex-1 px-6 py-3 rounded-lg bg-transparent border-2 border-[color:var(--color-primary-variant)] text-[color:var(--color-light)] focus:border-[color:var(--color-primary)] outline-none transition-colors"
			/>
			<button
				type="submit"
				class="btn btn-primary"
				:disabled="status === 'loading'"
			>
				<span v-if="status === 'idle'">Subscribe</span>
				<span v-else-if="status === 'loading'">Subscribing...</span>
				<span v-else-if="status === 'success'">Subscribed!</span>
				<span v-else>Try Again</span>
			</button>
		</form>

		<p
			v-if="status === 'success'"
			class="text-[color:var(--color-primary)] mt-4 text-sm"
		>
			Thanks for subscribing! Check your inbox for confirmation.
		</p>
	</div>
</template>
