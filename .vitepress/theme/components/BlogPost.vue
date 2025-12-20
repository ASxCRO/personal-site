<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, onMounted, computed } from 'vue'
import Newsletter from './Newsletter.vue'

const { frontmatter, page } = useData()
const isVisible = ref(false)
const readingProgress = ref(0)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)

  // Reading progress indicator
  const updateProgress = () => {
    const article = document.querySelector('.blog-post-content')
    if (!article) return

    const articleTop = article.getBoundingClientRect().top + window.scrollY
    const articleHeight = article.clientHeight
    const windowHeight = window.innerHeight
    const scrollY = window.scrollY

    const start = articleTop - windowHeight
    const end = articleTop + articleHeight - windowHeight * 0.5

    if (scrollY <= start) {
      readingProgress.value = 0
    } else if (scrollY >= end) {
      readingProgress.value = 100
    } else {
      readingProgress.value = ((scrollY - start) / (end - start)) * 100
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const estimatedReadTime = computed(() => {
  // Rough estimate based on typical article length
  return '5 min read'
})
</script>

<template>
  <article class="blog-post" :class="{ 'is-visible': isVisible }">
    <!-- Progress bar -->
    <div class="reading-progress" :style="{ width: `${readingProgress}%` }"></div>

    <!-- Hero section -->
    <header class="post-hero">
      <div class="container">
        <a href="/blog" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Blog
        </a>

        <div class="hero-content">
          <div class="post-meta">
            <time class="meta-date">{{ formatDate(frontmatter.date) }}</time>
            <span class="meta-divider"></span>
            <span class="meta-read-time">{{ estimatedReadTime }}</span>
          </div>

          <h1 class="post-title">{{ frontmatter.title }}</h1>

          <p v-if="frontmatter.description" class="post-excerpt">
            {{ frontmatter.description }}
          </p>

          <div class="post-tags" v-if="frontmatter.tags?.length">
            <span v-for="tag in frontmatter.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>

          <div class="author-info" v-if="frontmatter.author">
            <div class="author-avatar">
              <img src="/assets/me.png" alt="Antonio Supan" />
            </div>
            <div class="author-details">
              <span class="author-name">{{ frontmatter.author }}</span>
              <span class="author-role">Fullstack Engineer</span>
            </div>
          </div>
        </div>

        <!-- Decorative elements -->
        <div class="hero-decoration">
          <div class="deco-line deco-line-1"></div>
          <div class="deco-line deco-line-2"></div>
          <div class="deco-dot"></div>
        </div>
      </div>
    </header>

    <!-- Article content -->
    <div class="post-body">
      <div class="container-narrow">
        <div class="blog-post-content">
          <slot />
        </div>

        <!-- Article footer -->
        <footer class="post-footer">
          <div class="share-section">
            <span class="share-label">Share this article</span>
            <div class="share-buttons">
              <a
                :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(frontmatter.title)}&url=${encodeURIComponent('https://antoniosupan.from.hr' + page.relativePath.replace('.md', ''))}`"
                target="_blank"
                rel="noopener noreferrer"
                class="share-btn"
                aria-label="Share on Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://antoniosupan.from.hr' + page.relativePath.replace('.md', ''))}&title=${encodeURIComponent(frontmatter.title)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="share-btn"
                aria-label="Share on LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-divider"></div>

          <a href="/blog" class="all-posts-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            View all articles
          </a>
        </footer>

        <!-- Newsletter CTA -->
        <div class="newsletter-cta">
          <Newsletter />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.blog-post {
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.blog-post.is-visible {
  opacity: 1;
}

/* Reading Progress */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-warm));
  z-index: 1000;
  transition: width 0.1s linear;
}

/* Hero Section */
.post-hero {
  padding: 8rem 0 5rem;
  position: relative;
  overflow: hidden;
}

.post-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, var(--color-accent-dim), transparent),
    radial-gradient(ellipse 60% 40% at 80% 60%, rgba(255, 157, 0, 0.05), transparent);
  pointer-events: none;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 3rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: var(--color-accent);
}

.back-link:hover svg {
  transform: translateX(-4px);
}

.back-link svg {
  transition: transform 0.3s ease;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-date {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-divider {
  width: 4px;
  height: 4px;
  background: var(--color-text-muted);
  border-radius: 50%;
}

.meta-read-time {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.post-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.post-excerpt {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 1rem;
  background: var(--color-accent-dim);
  border: 1px solid transparent;
  border-radius: 2rem;
  color: var(--color-accent);
  transition: all 0.3s ease;
}

.tag:hover {
  border-color: var(--color-accent);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.author-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-accent-dim);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--color-text);
}

.author-role {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Hero Decoration */
.hero-decoration {
  position: absolute;
  top: 6rem;
  right: 5%;
  pointer-events: none;
}

.deco-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), transparent);
}

.deco-line-1 {
  width: 120px;
  top: 0;
  right: 0;
}

.deco-line-2 {
  width: 80px;
  top: 20px;
  right: 40px;
  opacity: 0.5;
}

.deco-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-accent);
  border-radius: 50%;
  top: -4px;
  right: -5px;
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Post Body */
.post-body {
  padding: 4rem 0 6rem;
}

.container-narrow {
  width: min(90%, 760px);
  margin: 0 auto;
}

/* Post Footer */
.post-footer {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.share-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.share-label {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.share-buttons {
  display: flex;
  gap: 0.75rem;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  color: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.share-btn:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-bg);
  transform: translateY(-2px);
}

.footer-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 2rem 0;
}

.all-posts-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-accent);
  transition: all 0.3s ease;
}

.all-posts-link:hover {
  gap: 0.75rem;
}

.all-posts-link svg {
  transition: transform 0.3s ease;
}

.all-posts-link:hover svg {
  transform: translateX(-4px);
}

/* Newsletter CTA */
.newsletter-cta {
  margin-top: 5rem;
}

/* Animations */
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
  .post-hero {
    padding: 6rem 0 3rem;
  }

  .back-link {
    margin-bottom: 2rem;
  }

  .hero-decoration {
    display: none;
  }

  .author-info {
    padding-top: 1.5rem;
  }

  .post-body {
    padding: 3rem 0 4rem;
  }
}

@media screen and (max-width: 480px) {
  .post-hero {
    padding: 5rem 0 2rem;
  }

  .share-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
