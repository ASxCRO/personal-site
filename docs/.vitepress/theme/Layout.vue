<script setup lang="ts">
import { useData } from 'vitepress'
import Nav from './components/Nav.vue'
import Footer from './components/Footer.vue'

const { frontmatter } = useData()
</script>

<template>
  <div class="layout">
    <Nav />
    <Content />
    <Footer />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}
</style>
