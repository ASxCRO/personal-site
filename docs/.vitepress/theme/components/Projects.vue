<script setup lang="ts">
const projects = [
  {
    title: 'Government Fintech Platform',
    description: 'Led development of a large-scale fintech platform for government services, coordinating a team of 5 developers.',
    image: '/assets/portfolio/portfolio1.jpg',
    tags: ['.NET', 'Azure', 'Microservices', 'Docker']
  },
  {
    title: 'Enterprise Document Management',
    description: 'Full-stack solution for enterprise document management with advanced search capabilities.',
    image: '/assets/portfolio/portfolio2.jpg',
    tags: ['ASP.NET', 'Elasticsearch', 'Vue.js', 'SQL Server']
  },
  {
    title: 'Real-time Analytics Dashboard',
    description: 'Built a real-time analytics dashboard with live data streaming and visualization.',
    image: '/assets/portfolio/portfolio3.jpg',
    tags: ['Vue.js', 'RabbitMQ', 'SignalR', 'Chart.js']
  },
  {
    title: 'Microservices Architecture',
    description: 'Designed and implemented microservices architecture for a legacy monolith migration.',
    image: '/assets/portfolio/portfolio4.jpg',
    tags: ['Docker', 'Kubernetes', 'Azure DevOps', 'API Gateway']
  },
  {
    title: 'CI/CD Pipeline Automation',
    description: 'Automated build and deployment pipelines for multiple projects using Azure DevOps.',
    image: '/assets/portfolio/portfolio5.png',
    tags: ['Azure DevOps', 'YAML', 'PowerShell', 'Terraform']
  },
  {
    title: 'Educational Platform',
    description: 'Developed an online learning platform for teaching programming fundamentals.',
    image: '/assets/portfolio/portfolio6.jpg',
    tags: ['ASP.NET MVC', 'JavaScript', 'SQL Server', 'Bootstrap']
  }
]
</script>

<template>
  <section class="pt-32 pb-16">
    <div class="container">
      <h1 class="text-4xl font-medium text-center mb-4">Projects</h1>
      <p class="text-[color:var(--color-light)] text-center mb-12 max-w-2xl mx-auto">
        A selection of projects I've worked on throughout my career in software development.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="project in projects"
          :key="project.title"
          class="bg-[color:var(--color-bg-variant)] rounded-2xl overflow-hidden border border-transparent hover:border-[color:var(--color-primary-variant)] transition-all duration-300"
        >
          <div class="aspect-video overflow-hidden">
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div class="p-6">
            <h3 class="text-lg font-medium mb-2">{{ project.title }}</h3>
            <p class="text-[color:var(--color-light)] text-sm mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-2 py-1 bg-[color:var(--color-primary-variant)] rounded text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
