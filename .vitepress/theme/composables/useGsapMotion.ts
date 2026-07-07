import { onMounted, onUnmounted, type Ref } from "vue";

export function useGsapMotion(root: Ref<HTMLElement | null>) {
	let cleanup: (() => void) | undefined;

	onMounted(async () => {
		if (!root.value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			root.value?.classList.add("motion-ready");
			return;
		}

		const { gsap } = await import("gsap");
		const { ScrollTrigger } = await import("gsap/ScrollTrigger");
		gsap.registerPlugin(ScrollTrigger);

		const context = gsap.context(() => {
			gsap.set("[data-reveal]", { autoAlpha: 0, y: 42 });
			gsap.to("[data-reveal]", {
				autoAlpha: 1,
				y: 0,
				duration: 0.9,
				ease: "power3.out",
				stagger: 0.08,
				scrollTrigger: {
					trigger: root.value,
					start: "top 70%",
				},
			});

			gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section) => {
				gsap.fromTo(
					section.querySelectorAll("[data-section-reveal]"),
					{ autoAlpha: 0, y: 54 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.8,
						ease: "power3.out",
						stagger: 0.08,
						scrollTrigger: {
							trigger: section,
							start: "top 68%",
						},
					},
				);
			});

			gsap.to("[data-parallax-profile]", {
				yPercent: -8,
				ease: "none",
				scrollTrigger: {
					trigger: "[data-hero]",
					start: "top top",
					end: "bottom top",
					scrub: true,
				},
			});

			gsap.to("[data-timeline-progress]", {
				scaleY: 1,
				transformOrigin: "top",
				ease: "none",
				scrollTrigger: {
					trigger: "[data-experience]",
					start: "top center",
					end: "bottom center",
					scrub: true,
				},
			});

			ScrollTrigger.matchMedia({
				"(min-width: 980px)": () => {
					ScrollTrigger.create({
						trigger: "[data-hero]",
						start: "top top",
						end: "+=42%",
						pin: "[data-hero-panel]",
						pinSpacing: false,
					});
				},
			});
		}, root.value);

		root.value.classList.add("motion-ready");
		ScrollTrigger.refresh();

		cleanup = () => {
			context.revert();
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});

	onUnmounted(() => {
		cleanup?.();
	});
}
