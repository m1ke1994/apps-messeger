<template>
  <section class="relative h-[100svh] w-full overflow-hidden bg-black text-white touch-none select-none">
    <!-- Фоновое удалённое видео/картинка: заполняет весь экран -->
    <video
      v-if="remoteVideoIsMedia"
      class="absolute inset-0 h-full w-full object-cover"
      :src="remoteVideo"
      autoplay
      playsinline
      muted
      loop
    />
    <img
      v-else
      class="absolute inset-0 h-full w-full object-cover"
      :src="remoteVideo"
      :alt="`${contactName} remote video`"
    />

    <!-- Лёгкие оверлеи для контраста -->
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

    <!-- Хедер -->
    <header class="relative z-10 flex items-start justify-between px-5 pt-6">
      <div>
        <p class="text-[10px] uppercase tracking-wide text-white/70">{{ status }}</p>
        <h1 class="text-2xl font-semibold leading-tight">{{ contactName }}</h1>
        <p class="text-sm text-white/80">{{ subtitle }}</p>
      </div>
      <span class="rounded-full bg-black/40 px-2.5 py-1 text-xs">{{ elapsed }}</span>
    </header>

    <!-- PIP-превью локальной камеры (справа-снизу) -->
    <div class="absolute bottom-20 right-4 z-10 h-28 w-20 overflow-hidden rounded-xl border-4 border-white/20 shadow-lg">
      <template v-if="cameraOff">
        <div class="grid h-full w-full place-items-center bg-black/70 text-[10px] font-semibold uppercase tracking-wide text-white/70">
          You
        </div>
      </template>
      <template v-else>
        <video
          v-if="localPreviewIsMedia"
          class="h-full w-full object-cover"
          :src="localPreview"
          autoplay
          playsinline
          muted
          loop
        />
        <img
          v-else
          class="h-full w-full object-cover"
          :src="localPreview"
          alt="local preview"
        />
      </template>
    </div>

    <!-- Панель управления: фиксирована снизу, без создания скролла -->
    <footer
      class="fixed inset-x-0 bottom-0 z-10 flex items-center justify-center gap-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-4"
    >
      <!-- Микрофон -->
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur transition hover:bg-black/55"
        :aria-pressed="muted"
        @click="toggleMute"
      >
        <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path v-if="muted" d="M9 9l6 6M15 9l-6 6" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 4a3 3 0 013 3v5a3 3 0 11-6 0V7a3 3 0 013-3z" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M5 11v1a7 7 0 0014 0v-1M12 18v3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Камера вкл/выкл -->
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur transition hover:bg-black/55"
        :aria-pressed="cameraOff"
        @click="toggleCamera"
      >
        <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path v-if="cameraOff" d="M4 5l16 16M15 10l4-3v10l-3-2.25" stroke-linecap="round" stroke-linejoin="round" />
          <path v-else d="M3 7a2 2 0 012-2h7a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zm11 3l5-3v10l-5-3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Смена камеры -->
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur transition hover:bg-black/55"
        @click="swapCamera"
      >
        <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path d="M4 7h3l2-2h6l2 2h3v10h-3l-2 2h-6l-2-2H4z" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9 10l6 4M15 10l-6 4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Завершить -->
      <button
        type="button"
        class="flex h-16 w-16 -rotate-12 items-center justify-center rounded-full bg-[#ff3b30] text-white shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
        @click="hangup"
      >
        <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
          <path d="M4 15c0-2.5 4-4.5 8-4.5S20 12.5 20 15m-5-3h2.5a1.5 1.5 0 011.5 1.5V16" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9 12h6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  contactName: { type: String, default: 'Alex Smith' },
  status: { type: String, default: 'WhatsApp video' },
  subtitle: { type: String, default: 'Live video' },
  elapsed: { type: String, default: '03:12' },
  remoteVideo: { type: String, default: '' },   // может быть URL видео или изображения
  localPreview: { type: String, default: '' },  // то же самое
  muted: { type: Boolean, default: false },
  cameraOff: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'toggle-mute'): void
  (e: 'toggle-camera'): void
  (e: 'swap-camera'): void
  (e: 'hangup'): void
}>()

const isMedia = (url: string) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url)

const remoteVideoIsMedia = computed(() => isMedia(props.remoteVideo))
const localPreviewIsMedia = computed(() => isMedia(props.localPreview))

const toggleMute = () => emit('toggle-mute')
const toggleCamera = () => emit('toggle-camera')
const swapCamera = () => emit('swap-camera')
const hangup = () => emit('hangup')
</script>
