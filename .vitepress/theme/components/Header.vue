<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<template>
  <header class="header">
    <!-- Animated background -->
    <div class="header-bg">
      <div class="grid-pattern"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- Corner decorations -->
    <div class="corner top-left"></div>
    <div class="corner bottom-right"></div>

    <div class="header-content container">
      <!-- Left side - Text content -->
      <div class="header-text" :class="{ 'is-loaded': isLoaded }">
        <div class="eyebrow">
          <span class="status-dot"></span>
          <span>.NET Developer @ Combis</span>
        </div>

        <h1 class="name">
          <span class="name-line">Antonio</span>
          <span class="name-line accent">Supan</span>
        </h1>

        <div class="title-wrapper">
          <span class="title-prefix">&lt;</span>
          <span class="title">Fullstack Engineer</span>
          <span class="title-prefix">/&gt;</span>
        </div>

        <p class="description">
          Crafting robust, scalable applications with .NET, Vue.js, and cloud technologies.
          Passionate about clean architecture and developer experience.
        </p>

        <div class="cta-group">
          <a href="/assets/cv.pdf" target="_blank" rel="noopener noreferrer" download class="btn">
            <span>Download CV</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
          <a href="#contact" class="btn btn-primary">
            <span>Let's Talk</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        <!-- Social links -->
        <div class="socials">
          <a href="https://github.com/asxcro" target="_blank" rel="noreferrer" aria-label="GitHub" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/antonio-supan" target="_blank" rel="noreferrer" aria-label="LinkedIn" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Right side - Image -->
      <div class="header-visual" :class="{ 'is-loaded': isLoaded }">
        <div class="image-frame">
          <div class="image-glow"></div>
          <div class="image-container">
            <img src="/assets/me.png" alt="Antonio Supan" loading="eager" />
          </div>
          <div class="image-border"></div>
        </div>

        <!-- Floating badges -->
        <div class="floating-badge badge-1">
          <span class="badge-icon">5+</span>
          <span class="badge-text">Years Exp</span>
        </div>
        <div class="floating-badge badge-2">
          <span class="badge-icon">.NET</span>
          <span class="badge-text">Specialist</span>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <a href="#about" class="scroll-indicator">
      <span class="scroll-text">Scroll</span>
      <div class="scroll-line">
        <div class="scroll-dot"></div>
      </div>
    </a>
  </header>
</template>

<style scoped>
.header {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 6rem 0;
}

/* Background effects */
.header-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--color-accent);
  top: -200px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: var(--color-warm);
  bottom: -100px;
  left: -50px;
  animation: float 10s ease-in-out infinite reverse;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: var(--color-accent);
  top: 50%;
  left: 40%;
  opacity: 0.15;
  animation: float 12s ease-in-out infinite;
}

/* Corner decorations */
.corner {
  position: absolute;
  width: 120px;
  height: 120px;
  border: 1px solid rgba(0, 240, 255, 0.2);
  pointer-events: none;
  z-index: 1;
}

.corner.top-left {
  top: 2rem;
  left: 2rem;
  border-right: none;
  border-bottom: none;
}

.corner.bottom-right {
  bottom: 2rem;
  right: 2rem;
  border-left: none;
  border-top: none;
}

/* Content layout */
.header-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* Text content */
.header-text {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.header-text.is-loaded {
  opacity: 1;
  transform: translateY(0);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-accent-dim);
  border-radius: 2rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

.name {
  margin-bottom: 1rem;
}

.name-line {
  display: block;
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}

.name-line.accent {
  color: var(--color-accent);
  text-shadow: 0 0 60px var(--color-accent-glow);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.title-prefix {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  color: var(--color-text-muted);
}

.title {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin-bottom: 2.5rem;
}

.cta-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.socials {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.social-link:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px -10px var(--color-accent-dim);
}

/* Visual/Image side */
.header-visual {
  position: relative;
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.header-visual.is-loaded {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.image-frame {
  position: relative;
  width: 380px;
  height: 480px;
}

.image-glow {
  position: absolute;
  inset: -20px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-warm) 100%);
  border-radius: 200px 200px 40px 40px;
  opacity: 0.2;
  filter: blur(40px);
  animation: pulse-glow 4s ease-in-out infinite;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, var(--color-accent) 0%, var(--color-bg-card) 100%);
  border-radius: 200px 200px 40px 40px;
  padding-top: 40px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.image-border {
  position: absolute;
  inset: -2px;
  border: 2px solid transparent;
  border-radius: 200px 200px 40px 40px;
  background: linear-gradient(180deg, var(--color-accent), transparent 60%) border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  pointer-events: none;
}

/* Floating badges */
.floating-badge {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
}

.badge-1 {
  top: 60px;
  right: -30px;
  animation-delay: 0s;
}

.badge-2 {
  bottom: 100px;
  left: -40px;
  animation-delay: 1s;
}

.badge-icon {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
}

.badge-text {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.scroll-indicator:hover {
  color: var(--color-accent);
}

.scroll-text {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.scroll-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(180deg, var(--color-text-muted), transparent);
  position: relative;
  overflow: hidden;
}

.scroll-dot {
  width: 3px;
  height: 10px;
  background: var(--color-accent);
  border-radius: 2px;
  position: absolute;
  left: -1px;
  animation: scrollDown 2s ease-in-out infinite;
}

@keyframes scrollDown {
  0% {
    top: 0;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .header-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .header-text {
    order: 2;
  }

  .header-visual {
    order: 1;
  }

  .description {
    margin-left: auto;
    margin-right: auto;
  }

  .cta-group {
    justify-content: center;
  }

  .socials {
    justify-content: center;
  }

  .image-frame {
    width: 280px;
    height: 360px;
  }

  .floating-badge {
    display: none;
  }

  .corner {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  .header {
    padding: 4rem 0;
  }

  .name-line {
    font-size: 2.5rem;
  }

  .cta-group {
    flex-direction: column;
  }

  .scroll-indicator {
    display: none;
  }
}
</style>
