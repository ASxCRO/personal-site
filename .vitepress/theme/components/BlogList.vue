<script setup lang="ts">
import { data as posts } from '../posts.data'
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getReadingTime = (content: string) => {
  const wordsPerMinute = 200
  const words = content?.split(/\s+/).length || 0
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
</script>

<template>
  <div class="blog-list" :class="{ 'is-visible': isVisible }">
    <!-- Featured post (first one) -->
    <article
      v-if="posts.length > 0"
      class="featured-post"
    >
      <a :href="posts[0].url" class="featured-link">
        <div class="featured-content">
          <div class="featured-meta">
            <span class="post-number">01</span>
            <time class="post-date">{{ formatDate(posts[0].frontmatter.date) }}</time>
          </div>
          <h2 class="featured-title">{{ posts[0].frontmatter.title }}</h2>
          <p class="featured-description">{{ posts[0].frontmatter.description }}</p>
          <div class="featured-footer">
            <div class="post-tags">
              <span
                v-for="tag in posts[0].frontmatter.tags?.slice(0, 3)"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
            <span class="read-more">
              Read Article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
        <div class="featured-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-dot"></div>
        </div>
      </a>
    </article>

    <!-- Rest of the posts -->
    <div class="posts-grid">
      <article
        v-for="(post, index) in posts.slice(1)"
        :key="post.url"
        class="post-card"
        :style="{ '--delay': `${(index + 1) * 0.1}s` }"
      >
        <a :href="post.url" class="post-link">
          <div class="post-header">
            <span class="post-number">{{ String(index + 2).padStart(2, '0') }}</span>
            <time class="post-date">{{ formatDate(post.frontmatter.date) }}</time>
          </div>

          <h3 class="post-title">{{ post.frontmatter.title }}</h3>

          <p class="post-description">{{ post.frontmatter.description }}</p>

          <div class="post-footer">
            <div class="post-tags">
              <span
                v-for="tag in post.frontmatter.tags?.slice(0, 2)"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
            <span class="read-indicator">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </div>

          <!-- Hover effect overlay -->
          <div class="card-glow"></div>
        </a>
      </article>
    </div>

    <!-- Empty state -->
    <div v-if="posts.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z"/>
        </svg>
      </div>
      <p class="empty-text">No articles yet</p>
      <span class="empty-subtext">Check back soon for new content</span>
    </div>
  </div>
</template>

<style scoped>
.blog-list {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.blog-list.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Featured Post */
.featured-post {
  margin-bottom: 4rem;
  position: relative;
}

.featured-link {
  display: block;
  position: relative;
  padding: 3rem;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.featured-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-accent-dim) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.featured-link:hover {
  border-color: var(--color-accent);
  transform: translateY(-4px);
  box-shadow:
    0 20px 60px -20px rgba(0, 240, 255, 0.15),
    0 0 0 1px var(--color-accent-dim);
}

.featured-link:hover::before {
  opacity: 1;
}

.featured-content {
  position: relative;
  z-index: 1;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.post-number {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
  padding: 0.25rem 0.75rem;
  background: var(--color-accent-dim);
  border-radius: 4px;
}

.post-date {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.featured-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.featured-link:hover .featured-title {
  color: var(--color-accent);
}

.featured-description {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 700px;
  margin-bottom: 2rem;
}

.featured-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.featured-link:hover .tag {
  background: var(--color-accent-dim);
  border-color: var(--color-accent-dim);
  color: var(--color-accent);
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-accent);
  transition: all 0.3s ease;
}

.read-more svg {
  transition: transform 0.3s ease;
}

.featured-link:hover .read-more svg {
  transform: translateX(4px);
}

/* Decoration elements */
.featured-decoration {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.decoration-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
}

.decoration-dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.post-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--delay);
}

.post-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.post-link:hover {
  border-color: var(--color-accent-dim);
  transform: translateY(-6px);
  box-shadow:
    0 20px 40px -20px rgba(0, 0, 0, 0.4),
    0 0 0 1px var(--color-accent-dim);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(0, 240, 255, 0.06),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.post-link:hover .card-glow {
  opacity: 1;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.post-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.post-link:hover .post-title {
  color: var(--color-accent);
}

.post-description {
  flex: 1;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.read-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent-dim);
  color: var(--color-accent);
  transition: all 0.3s ease;
}

.post-link:hover .read-indicator {
  background: var(--color-accent);
  color: var(--color-bg);
  transform: translateX(4px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: var(--color-bg-card);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--color-accent-dim);
  border-radius: 50%;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
}

.empty-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-subtext {
  font-size: 0.95rem;
  color: var(--color-text-muted);
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

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 8px var(--color-accent-dim);
  }
  50% {
    box-shadow: 0 0 20px var(--color-accent-glow);
  }
}

/* Responsive */
@media screen and (max-width: 768px) {
  .featured-link {
    padding: 2rem;
  }

  .featured-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .featured-decoration {
    display: none;
  }
}

@media screen and (max-width: 480px) {
  .featured-link {
    padding: 1.5rem;
  }

  .post-link {
    padding: 1.5rem;
  }

  .post-tags {
    display: none;
  }
}
</style>
