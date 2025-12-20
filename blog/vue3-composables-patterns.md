---
title: "Vue 3 Composables: Reusable Logic Patterns"
date: 2025-12-15
description: "Learn how to build powerful, reusable composables in Vue 3. Explore patterns for async operations, state sharing, third-party integrations, and testing strategies."
tags: ["Vue.js", "Composition API", "Composables", "TypeScript"]
author: "Antonio Supan"
---

# Vue 3 Composables: Reusable Logic Patterns

Composables are the heart of Vue 3's Composition API. They allow you to extract and reuse stateful logic across components without the complexity of mixins or renderless components. This guide covers patterns for building production-ready composables.

## What Makes a Good Composable?

A well-designed composable:
- Encapsulates a single concern
- Returns reactive state and methods
- Handles cleanup automatically
- Is fully typed with TypeScript
- Is testable in isolation

## Basic Patterns

### Simple State Composable

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const doubleCount = computed(() => count.value * 2)
  const isPositive = computed(() => count.value > 0)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  return {
    count,
    doubleCount,
    isPositive,
    increment,
    decrement,
    reset
  }
}
```

### Toggle Composable

```typescript
// composables/useToggle.ts
import { ref } from 'vue'

export function useToggle(initialValue = false) {
  const value = ref(initialValue)

  function toggle() {
    value.value = !value.value
  }

  function setTrue() {
    value.value = true
  }

  function setFalse() {
    value.value = false
  }

  return {
    value,
    toggle,
    setTrue,
    setFalse
  }
}

// Usage
const { value: isOpen, toggle: toggleModal } = useToggle()
```

## Async Data Composables

### useFetch

```typescript
// composables/useFetch.ts
import { ref, shallowRef, watchEffect, toValue } from 'vue'
import type { Ref, MaybeRefOrGetter } from 'vue'

interface UseFetchOptions<T> {
  immediate?: boolean
  initialData?: T
  onError?: (error: Error) => void
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  execute: () => Promise<void>
}

export function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { immediate = true, initialData = null, onError } = options

  const data = shallowRef<T | null>(initialData)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

  async function execute() {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(toValue(url))

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      data.value = await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      onError?.(error.value)
    } finally {
      isLoading.value = false
    }
  }

  if (immediate) {
    watchEffect(() => {
      execute()
    })
  }

  return {
    data,
    error,
    isLoading,
    execute
  }
}

// Usage
const { data: users, isLoading, error } = useFetch<User[]>('/api/users')

// With reactive URL
const userId = ref(1)
const { data: user } = useFetch(() => `/api/users/${userId.value}`)
```

### useAsyncState

```typescript
// composables/useAsyncState.ts
import { ref, shallowRef } from 'vue'

interface UseAsyncStateOptions<T> {
  immediate?: boolean
  resetOnExecute?: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
}

export function useAsyncState<T, P extends unknown[] = []>(
  fn: (...args: P) => Promise<T>,
  initialState: T,
  options: UseAsyncStateOptions<T> = {}
) {
  const {
    immediate = false,
    resetOnExecute = false,
    onError,
    onSuccess
  } = options

  const state = shallowRef<T>(initialState)
  const isLoading = ref(false)
  const isReady = ref(false)
  const error = ref<Error | null>(null)

  async function execute(...args: P) {
    if (resetOnExecute) {
      state.value = initialState
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await fn(...args)
      state.value = result
      isReady.value = true
      onSuccess?.(result)
      return result
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      onError?.(error.value)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  if (immediate) {
    execute(...([] as unknown as P))
  }

  return {
    state,
    isLoading,
    isReady,
    error,
    execute
  }
}

// Usage
const { state: users, isLoading, execute: fetchUsers } = useAsyncState(
  async () => {
    const response = await api.getUsers()
    return response.data
  },
  [],
  { immediate: true }
)

// With parameters
const { state: user, execute: fetchUser } = useAsyncState(
  async (id: string) => {
    const response = await api.getUser(id)
    return response.data
  },
  null
)
await fetchUser('123')
```

## Event and Lifecycle Composables

### useEventListener

```typescript
// composables/useEventListener.ts
import { onMounted, onUnmounted, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

type Target = Window | Document | HTMLElement | null

export function useEventListener<K extends keyof WindowEventMap>(
  target: MaybeRefOrGetter<Target>,
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
) {
  onMounted(() => {
    const el = toValue(target)
    el?.addEventListener(event, handler as EventListener, options)
  })

  onUnmounted(() => {
    const el = toValue(target)
    el?.removeEventListener(event, handler as EventListener, options)
  })
}

// Usage
useEventListener(window, 'resize', () => {
  console.log('Window resized')
})

useEventListener(
  () => document.querySelector('.modal'),
  'click',
  (e) => console.log('Modal clicked')
)
```

### useIntersectionObserver

```typescript
// composables/useIntersectionObserver.ts
import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

export function useIntersectionObserver(
  target: Ref<Element | null>,
  callback: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { once = false, ...observerOptions } = options

  const isSupported = 'IntersectionObserver' in window
  const isIntersecting = ref(false)

  let observer: IntersectionObserver | null = null

  function cleanup() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  if (isSupported) {
    watch(
      target,
      (el) => {
        cleanup()

        if (!el) return

        observer = new IntersectionObserver(([entry]) => {
          isIntersecting.value = entry.isIntersecting
          callback(entry.isIntersecting, entry)

          if (once && entry.isIntersecting) {
            cleanup()
          }
        }, observerOptions)

        observer.observe(el)
      },
      { immediate: true }
    )
  }

  onUnmounted(cleanup)

  return { isIntersecting, isSupported }
}

// Usage - Lazy loading
const imageRef = ref<HTMLImageElement | null>(null)
const { isIntersecting } = useIntersectionObserver(
  imageRef,
  (visible) => {
    if (visible) {
      loadImage()
    }
  },
  { once: true, rootMargin: '100px' }
)
```

## State Sharing Patterns

### Shared State Composable

```typescript
// composables/useSharedState.ts
import { ref, readonly } from 'vue'

// Module-level state (shared across all instances)
const notifications = ref<Notification[]>([])
let idCounter = 0

export function useNotifications() {
  function add(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = ++idCounter
    notifications.value.push({ id, message, type })

    // Auto-remove after 5 seconds
    setTimeout(() => {
      remove(id)
    }, 5000)

    return id
  }

  function remove(id: number) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clear() {
    notifications.value = []
  }

  return {
    notifications: readonly(notifications),
    add,
    remove,
    clear
  }
}
```

### Provide/Inject Pattern

```typescript
// composables/useTheme.ts
import { ref, provide, inject, readonly } from 'vue'
import type { InjectionKey, Ref } from 'vue'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContext {
  theme: Readonly<Ref<Theme>>
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')

export function provideTheme(initialTheme: Theme = 'system') {
  const theme = ref<Theme>(initialTheme)

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function applyTheme(t: Theme) {
    const resolved = t === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : t

    document.documentElement.setAttribute('data-theme', resolved)
  }

  // Initialize
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved) {
    theme.value = saved
  }
  applyTheme(theme.value)

  const context: ThemeContext = {
    theme: readonly(theme),
    setTheme,
    toggleTheme
  }

  provide(ThemeKey, context)

  return context
}

export function useTheme() {
  const context = inject(ThemeKey)

  if (!context) {
    throw new Error('useTheme must be used within a component that calls provideTheme')
  }

  return context
}
```

## Form Composables

### useForm

```typescript
// composables/useForm.ts
import { reactive, ref, computed } from 'vue'

type ValidationRule<T> = (value: T) => string | true
type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
) {
  const values = reactive({ ...initialValues }) as T
  const errors = reactive<Record<keyof T, string>>({} as any)
  const touched = reactive<Record<keyof T, boolean>>({} as any)
  const isSubmitting = ref(false)

  const isValid = computed(() => {
    return Object.keys(validationRules).every(key => !errors[key as keyof T])
  })

  const isDirty = computed(() => {
    return Object.keys(initialValues).some(
      key => values[key as keyof T] !== initialValues[key as keyof T]
    )
  })

  function validate(field?: keyof T): boolean {
    const fieldsToValidate = field ? [field] : Object.keys(validationRules)

    let valid = true

    for (const key of fieldsToValidate) {
      const rules = validationRules[key as keyof T] || []
      const value = values[key as keyof T]

      errors[key as keyof T] = ''

      for (const rule of rules) {
        const result = rule(value)
        if (result !== true) {
          errors[key as keyof T] = result
          valid = false
          break
        }
      }
    }

    return valid
  }

  function handleBlur(field: keyof T) {
    touched[field] = true
    validate(field)
  }

  function reset() {
    Object.assign(values, initialValues)
    Object.keys(errors).forEach(key => {
      errors[key as keyof T] = ''
    })
    Object.keys(touched).forEach(key => {
      touched[key as keyof T] = false
    })
  }

  async function handleSubmit(onSubmit: (values: T) => Promise<void>) {
    // Touch all fields
    Object.keys(values).forEach(key => {
      touched[key as keyof T] = true
    })

    if (!validate()) return

    isSubmitting.value = true
    try {
      await onSubmit(values)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    validate,
    handleBlur,
    reset,
    handleSubmit
  }
}

// Usage
const { values, errors, handleSubmit, handleBlur } = useForm(
  { email: '', password: '' },
  {
    email: [
      (v) => !!v || 'Email is required',
      (v) => /.+@.+\..+/.test(v) || 'Invalid email format'
    ],
    password: [
      (v) => !!v || 'Password is required',
      (v) => v.length >= 8 || 'Password must be at least 8 characters'
    ]
  }
)
```

## Testing Composables

```typescript
// composables/__tests__/useCounter.spec.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('should increment', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })

  it('should compute double count', () => {
    const { count, doubleCount, increment } = useCounter(5)
    expect(doubleCount.value).toBe(10)
    increment()
    expect(doubleCount.value).toBe(12)
  })

  it('should reset to initial value', () => {
    const { count, increment, reset } = useCounter(5)
    increment()
    increment()
    expect(count.value).toBe(7)
    reset()
    expect(count.value).toBe(5)
  })
})
```

## Best Practices

1. **Prefix with `use`** - Convention that identifies composables
2. **Return refs, not raw values** - Maintain reactivity
3. **Clean up side effects** - Use `onUnmounted` for listeners/observers
4. **Make options objects** - Easier to extend and document
5. **Type everything** - Full TypeScript support
6. **Keep them focused** - One concern per composable
7. **Document with JSDoc** - Help IDE autocompletion

## Conclusion

Composables are Vue 3's answer to logic reuse. They're simpler than mixins, more powerful than utility functions, and fully integrated with Vue's reactivity system. Master these patterns, and you'll write cleaner, more maintainable Vue applications.

Start extracting repeated logic into composables, and you'll quickly see how they transform your codebase into something more organized and testable.
