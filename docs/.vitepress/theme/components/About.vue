<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )

  const section = document.getElementById('about')
  if (section) observer.observe(section)
})

const education = [
  {
    title: 'Virovitica University of Applied Sciences',
    subtitle: "Bachelor's degree, Computer Software Engineering",
    date: '2018 - 2021'
  },
  {
    title: 'Gymnasium Pozega',
    subtitle: 'Highschool',
    date: '2014 - 2018'
  }
]

const certifications = [
  {
    title: 'Azure Fundamentals',
    issuer: 'Microsoft',
    date: 'Jun 2025',
    icon: '☁️'
  },
  {
    title: 'Agile Fundamentals',
    issuer: 'Pluralsight',
    date: 'Sep 2022',
    icon: '🔄'
  },
  {
    title: 'Microservices Architecture',
    issuer: 'Udemy',
    date: 'Nov 2021',
    icon: '🏗️'
  },
  {
    title: '.NET 5 Microservices',
    issuer: 'Udemy',
    date: 'Sep 2021',
    icon: '⚡'
  }
]
</script>

<template>
  <section id="about" class="about-section" :class="{ 'is-visible': isVisible }">
    <div class="container">
      <!-- Section header -->
      <div class="section-header">
        <span class="section-eyebrow">About Me</span>
        <h2 class="section-title">Background & <span class="text-gradient">Credentials</span></h2>
      </div>

      <div class="about-grid">
        <!-- Image column -->
        <div class="about-image-wrapper">
          <div class="image-decoration"></div>
          <div class="about-image">
            <img src="/assets/me-about-3.jpg" alt="Antonio Supan" loading="lazy" />
            <div class="image-overlay"></div>
          </div>
          <div class="image-stats">
            <div class="stat">
              <span class="stat-number">5+</span>
              <span class="stat-label">Years</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-number">10+</span>
              <span class="stat-label">Projects</span>
            </div>
          </div>
        </div>

        <!-- Content column -->
        <div class="about-content">
          <!-- Education -->
          <div class="content-block">
            <h3 class="block-title">
              <span class="block-icon">🎓</span>
              Education
            </h3>
            <div class="education-list">
              <article v-for="edu in education" :key="edu.title" class="education-item">
                <div class="item-header">
                  <h4>{{ edu.title }}</h4>
                  <span class="item-date">{{ edu.date }}</span>
                </div>
                <p class="item-subtitle">{{ edu.subtitle }}</p>
              </article>
            </div>
          </div>

          <!-- Certifications -->
          <div class="content-block">
            <h3 class="block-title">
              <span class="block-icon">🏆</span>
              Certifications
            </h3>
            <div class="cert-grid">
              <article v-for="cert in certifications" :key="cert.title" class="cert-card">
                <span class="cert-icon">{{ cert.icon }}</span>
                <div class="cert-info">
                  <h4>{{ cert.title }}</h4>
                  <p>{{ cert.issuer }} · {{ cert.date }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 8rem 0;
  position: relative;
}

.about-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent-dim), transparent);
}

.about-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 5rem;
  align-items: start;
}

/* Image styling */
.about-image-wrapper {
  position: sticky;
  top: 6rem;
}

.image-decoration {
  position: absolute;
  inset: -20px;
  background: linear-gradient(135deg, var(--color-accent-dim) 0%, transparent 50%);
  border-radius: 2rem;
  z-index: 0;
}

.about-image {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  aspect-ratio: 4/5;
  z-index: 1;
}

.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.about-image:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, var(--color-bg) 100%);
  pointer-events: none;
}

.image-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  margin-top: -3rem;
  position: relative;
  z-index: 2;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-accent);
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

/* Content styling */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.content-block {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.content-block:nth-child(1) { animation-delay: 0.1s; }
.content-block:nth-child(2) { animation-delay: 0.2s; }

.about-section.is-visible .content-block {
  opacity: 1;
  transform: translateY(0);
}

.block-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.block-icon {
  font-size: 1.5rem;
}

/* Education items */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.education-item {
  padding: 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.education-item:hover {
  border-color: var(--color-accent-dim);
  transform: translateX(8px);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.item-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.item-date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
  white-space: nowrap;
}

.item-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0;
}

/* Certification cards */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.cert-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cert-card:hover {
  border-color: var(--color-accent-dim);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.cert-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-dim);
  border-radius: 12px;
  flex-shrink: 0;
}

.cert-info h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.cert-info p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about-image-wrapper {
    max-width: 400px;
    margin: 0 auto;
    position: relative;
    top: 0;
  }

  .cert-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 600px) {
  .about-section {
    padding: 5rem 0;
  }

  .item-header {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
