<script setup lang="ts">
const jobs = [
  {
    title: 'Developer',
    company: 'Axians Hrvatska',
    type: 'Full-time',
    period: 'Jun 2024 - Present',
    location: 'Zagreb, Croatia',
    skills: ['Azure DevOps', 'Microservices', 'ASP.NET', 'C#', 'Vue.js', 'Docker', 'RabbitMQ', 'Elasticsearch'],
    current: true
  },
  {
    title: 'Full Stack Engineer',
    company: 'Atos',
    type: 'Full-time',
    period: 'May 2023 - May 2024',
    location: 'Zagreb, Croatia',
    skills: ['ASP.NET', 'Azure', 'CI/CD', 'NHibernate', 'T-SQL', 'JavaScript']
  },
  {
    title: 'Software Engineer',
    company: 'FINA',
    type: 'Full-time',
    period: 'Oct 2021 - Apr 2023',
    location: 'Zagreb, Croatia',
    skills: ['.NET', 'TypeScript', 'Node.js', 'Docker', 'Cloud'],
    description: 'Led fintech project, coordinating team of 5 developers'
  },
  {
    title: 'Student Software Engineer',
    company: 'FINA',
    type: 'Part-time',
    period: 'Nov 2019 - Oct 2021',
    location: 'Croatia',
    skills: ['.NET', 'SQL', 'Fintech']
  },
  {
    title: 'Assistant Professor',
    company: 'Polytechnic of Pozega',
    type: 'Contract',
    period: 'Dec 2022 - Feb 2023',
    location: 'Pozega, Croatia',
    description: 'Teaching OOP to 18 students'
  }
]
</script>

<template>
  <section id="experience" class="experience-section">
    <div class="container">
      <!-- Section header -->
      <div class="section-header">
        <span class="section-eyebrow">Career</span>
        <h2 class="section-title">Work <span class="text-gradient">Experience</span></h2>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        <div class="timeline-line"></div>

        <article
          v-for="(job, index) in jobs"
          :key="job.title + job.company"
          class="timeline-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="timeline-dot" :class="{ current: job.current }">
            <span v-if="job.current" class="pulse"></span>
          </div>

          <div class="timeline-card">
            <div class="card-header">
              <div class="card-title">
                <h3>{{ job.title }}</h3>
                <span class="company">@ {{ job.company }}</span>
              </div>
              <div class="card-meta">
                <span class="period">{{ job.period }}</span>
                <span class="type">{{ job.type }}</span>
              </div>
            </div>

            <p class="location">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ job.location }}
            </p>

            <p v-if="job.description" class="description">
              {{ job.description }}
            </p>

            <div v-if="job.skills" class="skills">
              <span v-for="skill in job.skills" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience-section {
  padding: 8rem 0;
  position: relative;
  background: var(--color-bg-elevated);
}

.experience-section::before,
.experience-section::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent-dim), transparent);
}

.experience-section::before { top: 0; }
.experience-section::after { bottom: 0; }

/* Timeline */
.timeline {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
}

.timeline-line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--color-accent), var(--color-accent-dim), transparent);
}

.timeline-item {
  position: relative;
  padding-left: 3rem;
  padding-bottom: 3rem;
  opacity: 0;
  animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -6px;
  top: 0;
  width: 14px;
  height: 14px;
  background: var(--color-bg-elevated);
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  z-index: 1;
}

.timeline-dot.current {
  background: var(--color-accent);
}

.pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Card */
.timeline-card {
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-card:hover {
  border-color: var(--color-accent-dim);
  transform: translateX(8px);
  box-shadow: 0 10px 40px -15px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.card-title h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.company {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-accent);
}

.card-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.period {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.type {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-accent-dim);
  color: var(--color-accent);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.description {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Skills */
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  border-color: var(--color-accent-dim);
  color: var(--color-accent);
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media screen and (max-width: 768px) {
  .timeline-line {
    left: 6px;
  }

  .timeline-dot {
    left: 0;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-meta {
    align-items: flex-start;
    flex-direction: row;
    gap: 0.75rem;
  }
}

@media screen and (max-width: 600px) {
  .experience-section {
    padding: 5rem 0;
  }

  .timeline-card {
    padding: 1.25rem;
  }
}
</style>
