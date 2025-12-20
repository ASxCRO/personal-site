<script setup lang="ts">
import { ref } from 'vue'

const form = ref<HTMLFormElement | null>(null)
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

const sendEmail = async (e: Event) => {
  e.preventDefault()
  if (!form.value) return

  status.value = 'sending'

  try {
    const emailjs = await import('@emailjs/browser')
    await emailjs.sendForm(
      'service_vr0ombd',
      'template_5vhutki',
      form.value,
      'kQOda6GvkcqF5gfll'
    )
    status.value = 'success'
    form.value.reset()
    setTimeout(() => { status.value = 'idle' }, 5000)
  } catch (error) {
    console.error('Email error:', error)
    status.value = 'error'
    setTimeout(() => { status.value = 'idle' }, 5000)
  }
}
</script>

<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <!-- Section header -->
      <div class="section-header">
        <span class="section-eyebrow">Get in Touch</span>
        <h2 class="section-title">Let's <span class="text-gradient">Connect</span></h2>
        <p class="section-description">
          Have a project in mind or want to discuss opportunities? I'd love to hear from you.
        </p>
      </div>

      <div class="contact-grid">
        <!-- Contact options -->
        <div class="contact-options">
          <article class="contact-card">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h4>Email</h4>
            <p>antonio.supan@icloud.com</p>
            <a href="mailto:antonio.supan@icloud.com" class="card-link">
              Send an email
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </article>

          <article class="contact-card">
            <div class="card-icon whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
            </div>
            <h4>WhatsApp</h4>
            <p>+385 99 411 4013</p>
            <a href="https://wa.me/385994114013" target="_blank" rel="noreferrer" class="card-link">
              Send a message
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </article>

          <article class="contact-card">
            <div class="card-icon linkedin">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <h4>LinkedIn</h4>
            <p>antonio-supan</p>
            <a href="https://linkedin.com/in/antonio-supan" target="_blank" rel="noreferrer" class="card-link">
              Connect with me
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </article>
        </div>

        <!-- Contact form -->
        <div class="contact-form-wrapper">
          <form ref="form" @submit="sendEmail" class="contact-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your project..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary submit-btn" :disabled="status === 'sending'">
              <span v-if="status === 'idle'">Send Message</span>
              <span v-else-if="status === 'sending'" class="sending">
                <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"/>
                </svg>
                Sending...
              </span>
              <span v-else-if="status === 'success'" class="success">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Message Sent!
              </span>
              <span v-else class="error">Try Again</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  padding: 8rem 0;
  position: relative;
}

.section-description {
  max-width: 500px;
  margin: 1rem auto 0;
  text-align: center;
  font-size: 1.1rem;
  color: var(--color-text-secondary);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  margin-top: 4rem;
}

/* Contact cards */
.contact-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-card {
  padding: 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.contact-card:hover {
  border-color: var(--color-accent-dim);
  transform: translateY(-4px);
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-dim);
  color: var(--color-accent);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.card-icon.whatsapp {
  background: rgba(37, 211, 102, 0.15);
  color: #25D366;
}

.card-icon.linkedin {
  background: rgba(0, 119, 181, 0.15);
  color: #0077B5;
}

.contact-card h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.contact-card p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-accent);
  text-decoration: none;
  transition: all 0.2s ease;
}

.card-link:hover {
  gap: 0.75rem;
}

/* Form */
.contact-form-wrapper {
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  padding: 2.5rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.form-group input,
.form-group textarea {
  padding: 1rem 1.25rem;
  background: var(--color-bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-dim);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--color-text-muted);
}

.submit-btn {
  width: 100%;
  padding: 1.25rem;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sending, .success, .error {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .contact-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

@media screen and (max-width: 768px) {
  .contact-options {
    grid-template-columns: 1fr;
  }

  .contact-form-wrapper {
    padding: 1.5rem;
  }
}

@media screen and (max-width: 600px) {
  .contact-section {
    padding: 5rem 0;
  }
}
</style>
