<template>
  <section
    class="relative flex h-full min-h-[480px] w-full flex-col overflow-hidden rounded-3xl bg-[#0a1418] text-white shadow-2xl"
  >
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f3c2b_0%,_#051310_45%,_#020607_100%)] opacity-90" />

    <header class="relative z-10 flex items-center justify-between px-6 pt-6">
      <div>
        <p class="text-xs uppercase tracking-wide text-white/60">{{ status }}</p>
        <h1 class="text-3xl font-semibold tracking-tight">{{ contactName }}</h1>
      </div>
      <span class="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">{{ elapsed }}</span>
    </header>

    <div class="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <div
        class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#1dd777]/40 bg-[#083122]"
      >
        <img
          v-if="avatar"
          :src="avatar"
          :alt="`${contactName} avatar`"
          class="h-full w-full object-cover"
        />
        <span v-else class="text-4xl font-semibold text-white/90">{{ initials }}</span>
      </div>
      <p class="text-base text-white/70">
        {{ displaySubtitle }}
      </p>
    </div>

    <footer class="relative z-10 flex items-center justify-center gap-6 px-6 pb-10">
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        :aria-pressed="speakerOn"
        @click="toggleSpeaker"
      >
       <svg
  class="h-6 w-6"
  fill="none"
  stroke="currentColor"
  stroke-width="1.6"
  viewBox="0 0 24 24"
>
  <path
    d="M4 9v6h3l5 4V5L7 9H4z"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    v-if="speakerOn"
    d="M16 8a5 5 0 010 8m2-10a8 8 0 010 12"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    v-else
    d="M16 9l3 3m0 0l-3 3m3-3h-3"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>

      </button>

      <button
        type="button"
        class="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        :aria-pressed="muted"
        @click="toggleMute"
      >
        <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
          <path
            d="M9 9l6 6M15 9l-6 6"
            stroke-linecap="round"
            stroke-linejoin="round"
            v-if="muted"
          />
          <path
            d="M12 3a3 3 0 013 3v5a3 3 0 11-6 0V6a3 3 0 013-3z"
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 11v1a7 7 0 0014 0v-1M12 18v3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        class="flex h-16 w-16 -rotate-12 items-center justify-center rounded-full bg-[#ff3b30] text-white shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 rotate-[136deg]"
        @click="hangup"
      >
        <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-[22px] w-[22px]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59c.62.3 1.36.19 1.85-.3l1.2-1.2a1 1 0 011.05-.24l2.72.91a1 1 0 01.67.95v2.13a2 2 0 01-2.18 2A18 18 0 013 6.48 2 2 0 015 4.3h2.13a1 1 0 01.95.67l.91 2.72a1 1 0 01-.24 1.05l-1.2 1.2c-.49.49-.61 1.23-.3 1.85z" />
            </svg>
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  contactName: { type: String, default: 'Maria Petrova' },
  status: { type: String, default: 'WhatsApp audio' },
  subtitle: { type: String, default: 'Calling...' },
  avatar: { type: String, default: '' },
  muted: { type: Boolean, default: false },
  speakerOn: { type: Boolean, default: true },
  elapsed: { type: String, default: '00:24' },
})

const emit = defineEmits<{
  (e: 'toggle-mute'): void
  (e: 'toggle-speaker'): void
  (e: 'hangup'): void
}>()

const initials = computed(() => {
  const parts = props.contactName.trim().split(/\s+/)
  return parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('') || '?'
})

const displaySubtitle = computed(() => (props.muted ? 'You muted your mic' : props.subtitle))

const toggleMute = () => emit('toggle-mute')
const toggleSpeaker = () => emit('toggle-speaker')
const hangup = () => emit('hangup')
</script>
