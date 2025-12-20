---
title: "Mastering Pinia: Modern State Management in Vue 3"
date: 2025-12-17
description: "Deep dive into Pinia, the official state management solution for Vue 3. Learn store patterns, composition API integration, plugins, and advanced techniques for scalable applications."
tags: ["Vue.js", "Pinia", "State Management", "TypeScript"]
author: "Antonio Supan"
---

# Mastering Pinia: Modern State Management in Vue 3

Pinia has become the official state management solution for Vue 3, replacing Vuex. It offers a simpler API, full TypeScript support, and seamless integration with the Composition API. This guide covers everything you need to build scalable state management.

## Why Pinia Over Vuex?

Pinia provides significant improvements:
- No mutations - actions handle both sync and async operations
- Full TypeScript inference without extra typing
- No nested modules - flat store structure
- Devtools support with time-travel debugging
- Extremely lightweight (~1kb)

## Setting Up Pinia

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

## Defining Stores

### Option Stores (Vuex-like syntax)

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    lastUpdated: null as Date | null
  }),

  getters: {
    doubleCount: (state) => state.count * 2,

    // Getter with arguments
    multiplyBy: (state) => {
      return (multiplier: number) => state.count * multiplier
    }
  },

  actions: {
    increment() {
      this.count++
      this.lastUpdated = new Date()
    },

    async fetchAndSet(id: number) {
      const response = await api.getCount(id)
      this.count = response.data.count
    }
  }
})
```

### Setup Stores (Composition API syntax)

This is the recommended approach for complex stores:

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.login({ email, password })
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    await authApi.logout()
    user.value = null
    localStorage.removeItem('token')
  }

  async function fetchUser() {
    if (!localStorage.getItem('token')) return

    isLoading.value = true
    try {
      const response = await authApi.me()
      user.value = response.data
    } catch {
      localStorage.removeItem('token')
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    fullName,
    // Actions
    login,
    logout,
    fetchUser
  }
})
```

## Using Stores in Components

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// Destructure reactive state with storeToRefs
const { user, isLoading, isAuthenticated } = storeToRefs(userStore)

// Actions can be destructured directly
const { login, logout } = userStore

async function handleLogin() {
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch {
    // Error is already in store
  }
}
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isAuthenticated">
    Welcome, {{ user?.firstName }}!
    <button @click="logout">Logout</button>
  </div>
  <LoginForm v-else @submit="handleLogin" />
</template>
```

## Store Composition

Stores can use other stores:

```typescript
// stores/cart.ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useProductStore } from './product'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const productStore = useProductStore()

  const items = ref<CartItem[]>([])

  const total = computed(() => {
    return items.value.reduce((sum, item) => {
      const product = productStore.getById(item.productId)
      return sum + (product?.price ?? 0) * item.quantity
    }, 0)
  })

  const totalWithDiscount = computed(() => {
    const discount = userStore.user?.isPremium ? 0.1 : 0
    return total.value * (1 - discount)
  })

  async function checkout() {
    if (!userStore.isAuthenticated) {
      throw new Error('Must be logged in to checkout')
    }

    const order = await orderApi.create({
      userId: userStore.user!.id,
      items: items.value,
      total: totalWithDiscount.value
    })

    items.value = []
    return order
  }

  return { items, total, totalWithDiscount, checkout }
})
```

## Plugins

Extend Pinia functionality with plugins:

### Persistence Plugin

```typescript
// plugins/persistence.ts
import type { PiniaPluginContext } from 'pinia'

export function persistencePlugin({ store }: PiniaPluginContext) {
  // Load persisted state
  const persisted = localStorage.getItem(`pinia-${store.$id}`)
  if (persisted) {
    store.$patch(JSON.parse(persisted))
  }

  // Subscribe to changes
  store.$subscribe((mutation, state) => {
    localStorage.setItem(`pinia-${store.$id}`, JSON.stringify(state))
  })
}

// main.ts
const pinia = createPinia()
pinia.use(persistencePlugin)
```

### Selective Persistence

```typescript
// plugins/selectivePersistence.ts
interface PersistOptions {
  paths?: string[]
  storage?: Storage
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: PersistOptions | boolean
  }
}

export function selectivePersistencePlugin(context: PiniaPluginContext) {
  const { store, options } = context

  if (!options.persist) return

  const config: PersistOptions =
    typeof options.persist === 'boolean'
      ? {}
      : options.persist

  const storage = config.storage ?? localStorage
  const key = `pinia-${store.$id}`

  // Restore
  const saved = storage.getItem(key)
  if (saved) {
    const data = JSON.parse(saved)
    store.$patch(data)
  }

  // Persist on change
  store.$subscribe((_, state) => {
    const toSave = config.paths
      ? pick(state, config.paths)
      : state

    storage.setItem(key, JSON.stringify(toSave))
  })
}

// Usage in store
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'dark',
    language: 'en',
    notifications: true
  }),
  persist: {
    paths: ['theme', 'language'] // Only persist these
  }
})
```

### Logger Plugin

```typescript
// plugins/logger.ts
export function loggerPlugin({ store }: PiniaPluginContext) {
  store.$onAction(({ name, args, after, onError }) => {
    const startTime = Date.now()

    console.log(`[${store.$id}] Action "${name}" started`, args)

    after((result) => {
      console.log(
        `[${store.$id}] Action "${name}" finished in ${Date.now() - startTime}ms`,
        result
      )
    })

    onError((error) => {
      console.error(`[${store.$id}] Action "${name}" failed`, error)
    })
  })
}
```

## Testing Stores

```typescript
// stores/__tests__/user.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn()
  }
}))

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should login successfully', async () => {
    const mockUser = { id: 1, firstName: 'John', lastName: 'Doe' }
    authApi.login.mockResolvedValue({
      data: { user: mockUser, token: 'abc123' }
    })

    const store = useUserStore()

    await store.login('john@example.com', 'password')

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(localStorage.getItem('token')).toBe('abc123')
  })

  it('should handle login error', async () => {
    authApi.login.mockRejectedValue(new Error('Invalid credentials'))

    const store = useUserStore()

    await expect(
      store.login('john@example.com', 'wrong')
    ).rejects.toThrow()

    expect(store.error).toBe('Invalid credentials')
    expect(store.isAuthenticated).toBe(false)
  })
})
```

## Best Practices

1. **Use Setup Stores for complex logic** - Better TypeScript support and composable reuse
2. **Keep stores focused** - One domain per store
3. **Use storeToRefs for destructuring** - Maintains reactivity
4. **Compose stores** - Reuse logic between stores
5. **Test stores in isolation** - Mock API calls and dependencies
6. **Use plugins for cross-cutting concerns** - Persistence, logging, analytics

## Conclusion

Pinia provides a modern, type-safe approach to state management in Vue 3. Its simplicity doesn't sacrifice power - with plugins and store composition, you can build sophisticated state management for any application scale.

The key is starting simple and adding complexity only when needed. Most applications don't need complex state management patterns - Pinia's straightforward API handles the majority of use cases elegantly.
