import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	title: "Antonio Supan",
	description: "Personal blog and portfolio - Fullstack Engineer",
	head: [
		["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
		[
			"link",
			{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
		],
		[
			"link",
			{
				href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
				rel: "stylesheet",
			},
		],
		["meta", { property: "og:type", content: "website" }],
		["meta", { property: "og:site_name", content: "Antonio Supan" }],
		["meta", { property: "og:image", content: "/assets/me.png" }],
		["meta", { name: "twitter:card", content: "summary_large_image" }],
		["meta", { name: "twitter:site", content: "@antoniosupan" }],
		["link", { rel: "icon", type: "image/png", href: "/assets/me.png" }],
	],
	cleanUrls: true,
	sitemap: {
		hostname: "https://antoniosupan.dev",
	},
	vite: {
		plugins: [tailwindcss()],
	},
	base: "/",
});
