<script setup lang="ts">
import { ref, onMounted } from 'vue'

const testimonials = [
  {
    name: 'Alemka Ugarkovic',
    avatar: '/assets/avatar1.jpg',
    review: 'Antonio is an exceptional developer with a strong work ethic and great problem-solving skills. His contributions to our projects have been invaluable.'
  },
  {
    name: 'Hrvoje Hodak',
    avatar: '/assets/avatar2.jpg',
    review: 'Working with Antonio has been a pleasure. His technical expertise and collaborative spirit make him a standout team member.'
  },
  {
    name: 'Marko Simunovic',
    avatar: '/assets/avatar3.jpg',
    review: "Antonio's dedication and innovative approach to development have significantly enhanced our project outcomes. Highly recommended!"
  },
  {
    name: 'Marka Tomljanovic',
    avatar: '/assets/avatar4.jpg',
    review: "Antonio's technical skills and leadership qualities have made a lasting impact on our team. He consistently delivers high-quality results."
  }
]

const currentSlide = ref(0)
const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % testimonials.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + testimonials.length) % testimonials.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}
</script>

<template>
  <section id="testimonials" class="mt-32">
    <h5 class="text-center text-[color:var(--color-light)]">Review from clients</h5>
    <h2 class="text-center text-[color:var(--color-primary)] mb-12 text-2xl">Testimonials</h2>

    <div class="container max-w-lg mx-auto">
      <!-- Carousel -->
      <div class="relative">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.name"
          :class="[
            'bg-[color:var(--color-bg-variant)] text-center p-8 rounded-3xl select-none transition-opacity duration-300',
            index === currentSlide ? 'block' : 'hidden'
          ]"
        >
          <div class="w-16 aspect-square overflow-hidden rounded-full mx-auto mb-4 border-4 border-[color:var(--color-primary-variant)]">
            <img
              :src="testimonial.avatar"
              :alt="testimonial.name"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h5 class="font-medium mb-2">{{ testimonial.name }}</h5>
          <small class="text-[color:var(--color-light)] font-light block w-4/5 mx-auto">
            {{ testimonial.review }}
          </small>
        </div>

        <!-- Navigation dots -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_, index) in testimonials"
            :key="index"
            :class="[
              'w-3 h-3 rounded-full transition-all duration-300',
              index === currentSlide ? 'bg-[color:var(--color-primary)]' : 'bg-[color:var(--color-primary-variant)]'
            ]"
            @click="goToSlide(index)"
            :aria-label="`Go to slide ${index + 1}`"
          />
        </div>

        <!-- Arrow buttons -->
        <button
          class="absolute top-1/2 -translate-y-1/2 -left-12 p-2 text-[color:var(--color-primary)] hover:text-white transition-colors hidden md:block"
          @click="prevSlide"
          aria-label="Previous testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          class="absolute top-1/2 -translate-y-1/2 -right-12 p-2 text-[color:var(--color-primary)] hover:text-white transition-colors hidden md:block"
          @click="nextSlide"
          aria-label="Next testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>
