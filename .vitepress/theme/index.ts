import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './style.css'

// Import components for global registration
import BlogList from './components/BlogList.vue'
import Newsletter from './components/Newsletter.vue'
import BlogPost from './components/BlogPost.vue'

export default {
  Layout,
  enhanceApp({ app }) {
    // Register global components for use in markdown files
    app.component('BlogList', BlogList)
    app.component('Newsletter', Newsletter)
    app.component('BlogPost', BlogPost)
  }
} satisfies Theme
