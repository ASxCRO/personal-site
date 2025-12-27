<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const activeNav = ref('/')
const isScrolled = ref(false)

const navItems = [
  { href: '/', icon: 'home', label: 'Home' },
  { href: '/#about', icon: 'user', label: 'About' },
  { href: '/#experience', icon: 'briefcase', label: 'Work' },
  { href: '/#testimonials', icon: 'quote', label: 'Reviews' },
  { href: '/blog', icon: 'book', label: 'Blog' },
  { href: '/#contact', icon: 'mail', label: 'Contact' }
]

const updateActiveFromRoute = () => {
  const path = route.path
  // Check if we're on the blog page or a blog post
  if (path === '/blog' || path === '/blog/' || path.startsWith('/blog/')) {
    activeNav.value = '/blog'
    return true
  }
  return false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100

  // Don't update active nav based on scroll if not on home page
  if (updateActiveFromRoute()) {
    return
  }

  const sections = ['about', 'experience', 'testimonials', 'contact']
  const scrollY = window.scrollY + 200

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const { offsetTop, offsetHeight } = element
      if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
        activeNav.value = `/#${section}`
        return
      }
    }
  }

  if (window.scrollY < 300) {
    activeNav.value = '/'
  }
}

onMounted(() => {
  updateActiveFromRoute()
  window.addEventListener('scroll', handleScroll)
})

watch(() => route.path, () => {
  updateActiveFromRoute()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="nav" :class="{ 'is-scrolled': isScrolled }">
    <div class="nav-container">
      <div class="nav-items">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          :class="['nav-item', { active: activeNav === item.href }]"
          :aria-label="item.label"
        >
          <span class="nav-icon">
            <!-- Home Icon -->
            <svg v-if="item.icon === 'home'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <!-- User Icon -->
            <svg v-else-if="item.icon === 'user'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <!-- Briefcase Icon -->
            <svg v-else-if="item.icon === 'briefcase'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <!-- Book Icon -->
            <svg v-else-if="item.icon === 'book'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <!-- Quote Icon -->
            <svg v-else-if="item.icon === 'quote'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"></path>
            </svg>
            <!-- Mail Icon -->
            <svg v-else-if="item.icon === 'mail'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </span>
          <span class="nav-label">{{ item.label }}</span>
          <span class="nav-indicator"></span>
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-container {
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 0.5rem;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.nav.is-scrolled .nav-container {
  background: rgba(10, 10, 15, 0.95);
  border-color: var(--color-accent-dim);
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.5),
    0 0 40px var(--color-accent-dim);
}

.nav-items {
  display: flex;
  gap: 0.25rem;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 100px;
}

.nav-item:hover {
  color: var(--color-text);
}

.nav-item:hover::before {
  opacity: 0.1;
}

.nav-item.active {
  color: var(--color-accent);
}

.nav-item.active::before {
  opacity: 0.15;
}

.nav-icon {
  position: relative;
  z-index: 1;
  display: flex;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: none;
}

.nav-indicator {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 1px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-item.active .nav-indicator {
  transform: translateX(-50%) scaleX(1);
}

/* Show labels on larger screens */
@media screen and (min-width: 768px) {
  .nav-label {
    display: block;
  }
}

@media screen and (max-width: 600px) {
  .nav {
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    transform: none;
  }

  .nav-container {
    width: 100%;
  }

  .nav-items {
    justify-content: center;
  }

  .nav-item {
    padding: 0.75rem 1rem;
  }
}
</style>
