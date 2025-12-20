<script setup lang="ts">
const links = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' }
]

const socials = [
  { href: 'https://github.com/asxcro', label: 'GitHub', icon: 'github' },
  { href: 'https://linkedin.com/in/antonio-supan', label: 'LinkedIn', icon: 'linkedin' }
]
</script>

<template>
  <footer class="footer">
    <div class="footer-glow"></div>

    <div class="container">
      <div class="footer-content">
        <!-- Brand -->
        <div class="footer-brand">
          <a href="/" class="logo">
            <span class="logo-text">SUPAN</span>
            <span class="logo-dot"></span>
          </a>
          <p class="tagline">Fullstack Engineer crafting digital experiences</p>
        </div>

        <!-- Navigation -->
        <nav class="footer-nav">
          <h4>Navigation</h4>
          <ul>
            <li v-for="link in links" :key="link.href">
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </nav>

        <!-- Connect -->
        <div class="footer-connect">
          <h4>Connect</h4>
          <div class="social-links">
            <a
              v-for="social in socials"
              :key="social.href"
              :href="social.href"
              target="_blank"
              rel="noreferrer"
              :aria-label="social.label"
              class="social-link"
            >
              <svg v-if="social.icon === 'github'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <svg v-else-if="social.icon === 'linkedin'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
          <a href="mailto:antonio.supan@icloud.com" class="email-link">
            antonio.supan@icloud.com
          </a>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} Antonio Supan. All rights reserved.
        </p>
        <p class="built-with">
          Built with
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="heart">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          using Vue & VitePress
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  padding: 5rem 0 2rem;
  margin-top: 5rem;
  background: var(--color-bg-elevated);
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent-dim), transparent);
}

.footer-glow {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, var(--color-accent-dim) 0%, transparent 70%);
  opacity: 0.3;
  pointer-events: none;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

/* Brand */
.footer-brand {
  max-width: 300px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  margin-bottom: 1rem;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.logo-dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
}

.tagline {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Navigation */
.footer-nav h4,
.footer-connect h4 {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: 1.25rem;
}

.footer-nav ul {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-nav a {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-nav a:hover {
  color: var(--color-text);
  padding-left: 0.5rem;
}

/* Connect */
.social-links {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: var(--color-text-muted);
  transition: all 0.3s ease;
}

.social-link:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: translateY(-2px);
}

.email-link {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.email-link:hover {
  color: var(--color-accent);
}

/* Bottom bar */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.copyright {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.built-with {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.heart {
  color: #ff6b6b;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  .footer-brand {
    grid-column: span 2;
    max-width: none;
    text-align: center;
    margin-bottom: 1rem;
  }
}

@media screen and (max-width: 600px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .footer-brand {
    grid-column: auto;
  }

  .footer-nav ul {
    align-items: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
