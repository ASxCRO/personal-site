<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import Nav from './components/Nav.vue'
import Footer from './components/Footer.vue'
import BlogPost from './components/BlogPost.vue'

const { frontmatter } = useData()
const route = useRoute()

// Check if current page is a blog post (in /blog/ directory and not the index)
const isBlogPost = computed(() => {
  return route.path.startsWith('/blog/') && route.path !== '/blog/'
})
</script>

<template>
  <div class="layout">
    <Nav />

    <!-- Blog post layout -->
    <template v-if="isBlogPost">
      <BlogPost>
        <Content />
      </BlogPost>
    </template>

    <!-- Regular page layout -->
    <template v-else>
      <Content />
    </template>

    <Footer />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}
</style>
