<template>
  <section class="relative flex h-full w-full flex-col overflow-hidden bg-black text-white">
    <div
      class="absolute inset-0 bg-cover bg-center blur-sm"
      :style="remoteBackdropStyle"
      aria-hidden="true"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />

    <div class="relative z-10 flex h-full w-full flex-col">
      <header class="flex items-start justify-between px-6 pt-10 pb-6">
        <div>
          <p class="text-xs uppercase tracking-wide text-white/60">{{ status }}</p>
          <h1 class="text-2xl font-semibold">{{ contactName }}</h1>
          <p class="text-sm text-white/60">{{ subtitle }}</p>
        </div>
        <span class="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">{{ elapsed }}</span>
      </header>

      <div class="relative flex-1">
        <div
          class="absolute inset-0 bg-cover bg-center transition-all duration-300"
          :class="[{ 'opacity-60 grayscale': cameraOff }]"
          :style="remoteVideoStyle"
        />
        <div
          v-if="cameraOff"
          class="absolute inset-0 flex items-center justify-center bg-black/70 text-base font-medium text-white/80"
        >
          Camera off
        </div>

        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40"
          aria-hidden="true"
        />

        <div class="absolute bottom-6 right-6 h-28 w-20 overflow-hidden rounded-xl border-4 border-white/20 shadow-lg">
          <div
            v-if="cameraOff"
            class="flex h-full w-full items-center justify-center bg-black/70 text-xs font-semibold uppercase tracking-wide text-white/70"
          >
            You
          </div>
          <div
            v-else
            class="h-full w-full bg-cover bg-center"
            :style="localPreviewStyle"
          />
        </div>
      </div>

      <footer class="px-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] pt-6">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            class="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            :aria-pressed="muted"
            @click="toggleMute"
          >
            <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path
                v-if="muted"
                d="M9 9l6 6M15 9l-6 6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 4a3 3 0 013 3v5a3 3 0 11-6 0V7a3 3 0 013-3z"
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
            class="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            :aria-pressed="cameraOff"
            @click="toggleCamera"
          >
            <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path
                v-if="cameraOff"
                d="M4 5l16 16M15 10l4-3v10l-3-2.25"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                v-else
                d="M3 7a2 2 0 012-2h7a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zm11 3l5-3v10l-5-3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            class="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            @click="swapCamera"
          >
            <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path
                d="M4 7h3l2-2h6l2 2h3v10h-3l-2 2h-6l-2-2H4z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M9 10l6 4M15 10l-6 4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            class="flex h-16 w-16 -rotate-12 items-center justify-center rounded-full bg-[#ff3b30] text-white shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
            @click="hangup"
          >
            <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path
                d="M4 15c0-2.5 4-4.5 8-4.5S20 12.5 20 15m-5-3h2.5a1.5 1.5 0 011.5 1.5V16"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M9 12h6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  contactName: { type: String, default: 'Alex Smith' },
  status: { type: String, default: 'WhatsApp video' },
  subtitle: { type: String, default: 'Video call' },
  elapsed: { type: String, default: '03:12' },
  remoteVideo: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  localPreview: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  muted: { type: Boolean, default: false },
  cameraOff: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'toggle-mute'): void
  (e: 'toggle-camera'): void
  (e: 'swap-camera'): void
  (e: 'hangup'): void
}>()

const remoteBackdropStyle = computed(() => ({
  backgroundImage: `url('${props.remoteVideo}')`,
}))

const remoteVideoStyle = computed(() => ({
  backgroundImage: `url('${props.remoteVideo}')`,
}))

const localPreviewStyle = computed(() => ({
  backgroundImage: `url('${props.localPreview}')`,
}))

const toggleMute = () => emit('toggle-mute')
const toggleCamera = () => emit('toggle-camera')
const swapCamera = () => emit('swap-camera')
const hangup = () => emit('hangup')
</script>
