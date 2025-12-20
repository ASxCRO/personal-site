<script setup lang="ts">
import { data as posts } from '../posts.data'

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="grid gap-8">
    <article
      v-for="post in posts"
      :key="post.url"
      class="bg-[color:var(--color-bg-variant)] rounded-2xl p-6 border border-transparent hover:border-[color:var(--color-primary-variant)] transition-all duration-300"
    >
      <a :href="post.url" class="block">
        <h3 class="text-xl font-medium mb-2 text-white hover:text-[color:var(--color-primary)] transition-colors">
          {{ post.frontmatter.title }}
        </h3>
        <p class="text-[color:var(--color-light)] text-sm mb-4">
          {{ post.frontmatter.description }}
        </p>
        <div class="flex flex-wrap items-center gap-4 text-sm">
          <time class="text-[color:var(--color-primary)]">
            {{ formatDate(post.frontmatter.date) }}
          </time>
          <div class="flex gap-2">
            <span
              v-for="tag in post.frontmatter.tags"
              :key="tag"
              class="px-2 py-1 bg-[color:var(--color-primary-variant)] rounded text-xs"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </a>
    </article>

    <div v-if="posts.length === 0" class="text-center py-12">
      <p class="text-[color:var(--color-light)]">No blog posts yet. Check back soon!</p>
    </div>
  </div>
</template>
