---
title: "Vue Router 4: Advanced Patterns and Navigation Guards"
date: 2025-12-16
description: "Master Vue Router 4 with advanced routing patterns, navigation guards, lazy loading, route meta fields, and dynamic routing for complex Vue 3 applications."
tags: ["Vue.js", "Vue Router", "SPA", "TypeScript"]
author: "Antonio Supan"
---

# Vue Router 4: Advanced Patterns and Navigation Guards

Vue Router 4 is built for Vue 3 and the Composition API. Beyond basic routing, it offers powerful features for building complex, secure, and performant single-page applications. This guide covers advanced patterns you'll need in production.

## Setup and Configuration

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
```

## Navigation Guards

### Global Guards

```typescript
// router/guards.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router) {
  // Before each navigation
  router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()

    // Initialize auth state on first load
    if (!authStore.initialized) {
      await authStore.initialize()
    }

    // Check authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }

    // Redirect authenticated users away from auth pages
    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }

    // Check roles
    if (to.meta.roles) {
      const requiredRoles = to.meta.roles as string[]
      const hasRole = requiredRoles.some(role =>
        authStore.user?.roles.includes(role)
      )

      if (!hasRole) {
        return { name: 'forbidden' }
      }
    }
  })

  // After each navigation
  router.afterEach((to, from) => {
    // Update document title
    document.title = to.meta.title
      ? `${to.meta.title} | MyApp`
      : 'MyApp'

    // Analytics tracking
    analytics.pageView(to.fullPath)
  })

  // Handle navigation errors
  router.onError((error, to, from) => {
    console.error('Navigation error:', error)

    if (error.message.includes('Failed to fetch')) {
      // Chunk loading failed - reload the page
      window.location.href = to.fullPath
    }
  })
}
```

### Route-Level Guards

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    beforeEnter: (to, from) => {
      const authStore = useAuthStore()
      if (!authStore.user?.isAdmin) {
        return { name: 'forbidden' }
      }
    },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/Users.vue'),
        beforeEnter: async (to) => {
          // Pre-fetch data before entering
          const userStore = useUserStore()
          await userStore.fetchUsers()
        }
      }
    ]
  }
]
```

### Component Guards with Composition API

```vue
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

const hasUnsavedChanges = ref(false)

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      'You have unsaved changes. Are you sure you want to leave?'
    )
    if (!answer) return false
  }
})

onBeforeRouteUpdate(async (to, from) => {
  // Same component, different params
  if (to.params.id !== from.params.id) {
    await fetchData(to.params.id as string)
  }
})
</script>
```

## Dynamic Route Matching

### Nested Dynamic Routes

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/projects/:projectId',
    component: () => import('@/layouts/ProjectLayout.vue'),
    children: [
      {
        path: '',
        name: 'project-overview',
        component: () => import('@/views/project/Overview.vue')
      },
      {
        path: 'tasks/:taskId',
        name: 'project-task',
        component: () => import('@/views/project/Task.vue'),
        props: true // Pass route params as props
      },
      {
        path: 'settings',
        name: 'project-settings',
        component: () => import('@/views/project/Settings.vue'),
        meta: { requiresOwner: true }
      }
    ]
  }
]
```

### Route Props

```typescript
const routes: RouteRecordRaw[] = [
  // Boolean mode - pass all params as props
  {
    path: '/user/:id',
    component: User,
    props: true
  },
  // Object mode - static props
  {
    path: '/about',
    component: About,
    props: { showNewsletter: true }
  },
  // Function mode - transform params
  {
    path: '/search',
    component: SearchResults,
    props: (route) => ({
      query: route.query.q,
      page: parseInt(route.query.page as string) || 1,
      filters: route.query.filters?.split(',') || []
    })
  }
]
```

## Lazy Loading and Code Splitting

### Route-Level Splitting

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  // Named chunks for better debugging
  {
    path: '/reports',
    component: () => import(
      /* webpackChunkName: "reports" */
      '@/views/Reports.vue'
    )
  }
]
```

### Component Grouping

```typescript
// Group related routes into same chunk
const AdminDashboard = () => import(
  /* webpackChunkName: "admin" */ '@/views/admin/Dashboard.vue'
)
const AdminUsers = () => import(
  /* webpackChunkName: "admin" */ '@/views/admin/Users.vue'
)
const AdminSettings = () => import(
  /* webpackChunkName: "admin" */ '@/views/admin/Settings.vue'
)

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    children: [
      { path: '', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'settings', component: AdminSettings }
    ]
  }
]
```

### Prefetching Routes

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  // Prefetch likely next routes
  router.getRoutes()
    .filter(route => route.meta.prefetch)
    .forEach(route => {
      if (typeof route.components?.default === 'function') {
        (route.components.default as () => Promise<any>)()
      }
    })
})
</script>
```

## Route Meta Fields

### Type-Safe Meta Fields

```typescript
// router/types.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
    breadcrumb?: string | ((route: RouteLocationNormalized) => string)
    layout?: 'default' | 'admin' | 'auth'
    transition?: string
  }
}

// Usage
const routes: RouteRecordRaw[] = [
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetail.vue'),
    meta: {
      title: 'Product Details',
      breadcrumb: (route) => `Product ${route.params.id}`,
      layout: 'default'
    }
  }
]
```

### Dynamic Breadcrumbs

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const crumbs: { name: string; path: string }[] = []

  route.matched.forEach((record) => {
    if (record.meta.breadcrumb) {
      const name = typeof record.meta.breadcrumb === 'function'
        ? record.meta.breadcrumb(route)
        : record.meta.breadcrumb

      crumbs.push({
        name,
        path: router.resolve(record).path
      })
    }
  })

  return crumbs
})
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="breadcrumbs">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <router-link
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
        >
          {{ crumb.name }}
        </router-link>
        <span v-else>{{ crumb.name }}</span>
      </li>
    </ol>
  </nav>
</template>
```

## Programmatic Navigation

### Navigation with Composition API

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Navigate to route
async function goToProduct(id: string) {
  await router.push({
    name: 'product-detail',
    params: { id }
  })
}

// Replace current history entry
function updateFilters(filters: Record<string, string>) {
  router.replace({
    query: { ...route.query, ...filters }
  })
}

// Navigate back
function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'home' })
  }
}

// Navigate with state
function goToCheckout(cartData: CartData) {
  router.push({
    name: 'checkout',
    state: { cart: cartData } // Access via history.state
  })
}
</script>
```

## Dynamic Route Registration

```typescript
// Dynamically add routes based on user permissions
export function setupDynamicRoutes(router: Router, permissions: string[]) {
  if (permissions.includes('admin')) {
    router.addRoute({
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/Admin.vue'),
      children: [
        // Admin-only routes
      ]
    })
  }

  if (permissions.includes('reports')) {
    router.addRoute('dashboard', {
      path: 'reports',
      name: 'reports',
      component: () => import('@/views/Reports.vue')
    })
  }
}

// Remove routes on logout
export function cleanupRoutes(router: Router) {
  const dynamicRoutes = ['admin', 'reports']
  dynamicRoutes.forEach(name => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}
```

## Error Handling

```typescript
const routes: RouteRecordRaw[] = [
  // Catch-all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue')
  }
]

// Error page routing
router.onError((error) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    // Handle chunk loading failures
    router.push({ name: 'error', query: { type: 'chunk-error' } })
  }
})
```

## Best Practices

1. **Use named routes** - More maintainable than hardcoded paths
2. **Lazy load routes** - Improve initial load performance
3. **Type your meta fields** - Catch errors at compile time
4. **Centralize guards** - Keep authentication logic in one place
5. **Handle errors gracefully** - Provide fallbacks for failed navigations
6. **Use route props** - Decouple components from router

## Conclusion

Vue Router 4 provides everything needed for complex routing scenarios. The Composition API integration makes it easier than ever to work with routes in components, while navigation guards give you fine-grained control over the navigation lifecycle.

Master these patterns, and you'll be able to build secure, performant, and maintainable Vue applications with sophisticated routing requirements.
