---
title: Blog - Antonio Supan
description: Articles about .NET, software architecture, microservices, and modern development practices.
layout: page
---

<script setup>
import BlogList from './.vitepress/theme/components/BlogList.vue'
import Newsletter from './.vitepress/theme/components/Newsletter.vue'
</script>

<section class="pt-32 pb-16">
  <div class="container">
    <h1 class="text-4xl font-medium text-center mb-4">Blog</h1>
    <p class="text-[color:var(--color-light)] text-center mb-12 max-w-2xl mx-auto">
      Thoughts and tutorials on .NET, software architecture, cloud technologies, and modern development practices.
    </p>

    <BlogList />

    <div class="mt-16">
      <Newsletter />
    </div>
  </div>
</section>
