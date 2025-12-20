---
title: Blog - Antonio Supan
description: Articles about .NET, software architecture, microservices, and modern development practices.
layout: page
---

<section class="blog-page">
<div class="container">

<div class="blog-header">
<div class="header-content">
<span class="section-eyebrow">Articles & Insights</span>
<h1 class="page-title">Blog</h1>
<p class="page-description">
Deep dives into .NET, software architecture, cloud technologies, and modern development practices. Practical insights from real-world experience.
</p>
</div>
<div class="header-decoration">
<div class="deco-circle"></div>
<div class="deco-lines">
<span></span>
<span></span>
<span></span>
</div>
</div>
</div>

<BlogList />

<div class="newsletter-section">
<Newsletter />
</div>

</div>
</section>

<style>
.blog-page {
  padding: 8rem 0 6rem;
  min-height: 100vh;
}

.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 3rem;
  margin-bottom: 5rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-content {
  max-width: 600px;
}

.section-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.section-eyebrow::before {
  content: '';
  width: 2rem;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent));
}

.page-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.page-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 500px;
}

.header-decoration {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.deco-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-accent-dim);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

.deco-circle::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  transform: translateX(-50%);
}

.deco-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.deco-lines span {
  display: block;
  height: 2px;
  background: var(--color-accent);
  border-radius: 1px;
}

.deco-lines span:nth-child(1) { width: 40px; }
.deco-lines span:nth-child(2) { width: 28px; opacity: 0.6; }
.deco-lines span:nth-child(3) { width: 16px; opacity: 0.3; }

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.newsletter-section {
  margin-top: 6rem;
  padding-top: 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

@media screen and (max-width: 768px) {
  .blog-page {
    padding: 6rem 0 4rem;
  }

  .blog-header {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .header-content {
    max-width: 100%;
  }

  .section-eyebrow::before {
    display: none;
  }

  .page-description {
    max-width: 100%;
  }

  .header-decoration {
    margin: 0 auto;
    width: 80px;
    height: 80px;
  }

  .newsletter-section {
    margin-top: 4rem;
    padding-top: 3rem;
  }
}
</style>
