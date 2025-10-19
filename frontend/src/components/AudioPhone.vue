<template>
  <section
    class="relative h-[100svh] w-full overflow-hidden bg-black text-white touch-none select-none"
  >
    <!-- Фон: видео или фото -->
    <video
      v-if="videoSrc"
      class="absolute inset-0 h-full w-full object-cover"
      :src="videoSrc"
      autoplay
      playsinline
      muted
      loop
    />
    <img
      v-else-if="avatar"
      class="absolute inset-0 h-full w-full object-cover"
      :src="avatar"
      :alt="`${contactName} background`"
    />
    <div
      v-else
      class="absolute inset-0 grid place-items-center bg-[#071611]"
    >
      <div
        class="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-400/40 bg-emerald-900/30"
      >
        <span class="text-5xl font-semibold">{{ initials }}</span>
      </div>
    </div>

    <!-- Затемнение -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/0 to-black/60"
    />

    <!-- Контент -->
    <header class="relative z-10 flex items-start justify-between px-5 pt-6">
      <div>
        <p class="text-[10px] uppercase tracking-wide text-white/70">{{ status }}</p>
        <h1 class="text-2xl font-semibold leading-tight">{{ contactName }}</h1>
        <p class="text-sm text-white/80">{{ displaySubtitle }}</p>
      </div>
      <span
        class="rounded-full bg-black/40 px-2.5 py-1 text-xs"
        >{{ elapsed }}</span
      >
    </header>

    <!-- Нижние кнопки -->
    <footer
      class="fixed inset-x-0 bottom-0 z-10 flex items-center justify-center gap-6 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-4"
    >
      <!-- Speaker -->
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur transition hover:bg-black/55"
        :aria-pressed="speakerOn"
        @click="toggleSpeaker"
      >
        <svg
          class="h-7 w-7"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
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

      <!-- Mic -->
      <button
        type="button"
        class="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur transition hover:bg-black/55"
        :aria-pressed="muted"
        @click="toggleMute"
      >
        <svg
          class="h-7 w-7"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          viewBox="0 0 24 24"
        >
          <path
            v-if="muted"
            d="M9 9l6 6M15 9l-6 6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            v-else
            d="M12 3a3 3 0 013 3v5a3 3 0 11-6 0V6a3 3 0 013-3z"
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

      <!-- End call -->
      <button
        type="button"
        class="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff3b30] text-white shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
        @click="hangup"
      >
        <svg
          class="h-7 w-7"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 15c0-2.5 4-4.5 8-4.5s8 2 8 4.5m-5-3h2.5A1.5 1.5 0 0119 13.5V16"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 12h6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  contactName: { type: String, default: 'Maria Petrova' },
  status: { type: String, default: 'WhatsApp video' },
  subtitle: { type: String, default: 'Connecting…' },
  avatar: { type: String, default: '' },
  videoSrc: { type: String, default: '' },
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
  return (
    parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || '?'
  )
})
const displaySubtitle = computed(() =>
  props.muted ? 'Микрофон выключен' : props.subtitle
)

const toggleMute = () => emit('toggle-mute')
const toggleSpeaker = () => emit('toggle-speaker')
const hangup = () => emit('hangup')
</script>
