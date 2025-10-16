<!-- src/views/ChatsDetail.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type MsgType = 'text' | 'image' | 'file' | 'audio'
type Message = {
  id: string
  chatId: number
  authorId: number
  createdAt: string
  type: MsgType
  text?: string
  fileName?: string
  fileUrl?: string
  imageUrl?: string
  audioUrl?: string
}

const route = useRoute()
const router = useRouter()
const meId = 999 // демо-идентификатор текущего пользователя

const chatId = computed(() => {
  const raw = route.params.id
  const n = typeof raw === 'string'
    ? parseInt(raw, 10)
    : Array.isArray(raw)
      ? parseInt(raw[0], 10)
      : NaN
  return Number.isFinite(n) ? n : -1
})

watch(chatId, (id) => {
  if (id < 0) router.replace({ name: 'chats' })
}, { immediate: true })

const peersMap: Record<number, { name: string; avatar: string; status?: string }> = {
  1: { name: 'Liam Carter', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpHO0OQQxrD9-j22_4jad1JMGqJp5hwRvD8jL9-O-B5in1YrsR6xHl-VZiGRx4eJiVXkAh24kw1KBuA83SMccyhR3R9G4_orZ0KJSR202lhuw6zm43O9Eft-otpLwjdc0ZW6yA5EqNNe6x9WrJkSkLLxhY12zg6ikPDaf8qqQl3bq7a7zRNxgf3UnpCaWK6FGrYWtReKU7-mMS50JantlxyKp8-qbums7tJbzcCb0EqFpzHfi4F4Tvvynhm5osjfRgfkQrFOSoZexW', status: 'online' },
  2: { name: 'Sophia Bennett', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi5w1QFRTlV4GeSElwpw_sTTxvFvn1fZ4A2wi1cInF-UdjOADeQFgsy5J_72efoFZs7idflZ4tZfKIYXZoEz3rpq5KSOI-fDEWCF6-qdGauA5g-l6ROvOn5XRI3SY6E4Wy0XqyQoI6D2TK2pIA8l6DDWnNxDQdkZpA6D3JxO6CxybGKgbqY4bhPO6W7lx0TSYWmfVjntxge3OQXX3YemunzQ5_uLKETWZfbbGqIDbJHGvbnqJMP7QV5m4UnCHGADxPlfexjCaFDuhq', status: 'online' },
  3: { name: 'Ethan Harper', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0rGm1pGqKtR5Hky7TfL8iJQ9KOLS8abNV678_95QyTRsEN-nBIz2vwc4ebRkWFZMXwRUfmkRtUD8BhoGfbcxlnfEt84JFhEEVP5P6EUYgokQzBkMWk3C175Yf2GuwGLHZcQg8zTV0HgIR2cba0OLDcsmjL557aZSgHQTzl0Q_qTa9F1OCdmAhp981Mq-rJHj8LfjtiOFFhf30GV1P-1tVfPgObZmy9kkdRoXJneQCTexDpWMHnjJXpYCL_LrQUE_TsmuAWyPbDjTf', status: 'online' },
  4: { name: 'Olivia Parker', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjC2PAAAIv0o054lb7vinX7E5xISRSowEtKDK0J8pQOCrejkVTJwF9JM7mK6zdG8_8S7cuoFO-p_TwhOzfsvhE4QKBByTX3_yPpO7mL1SwUWISgVhh4kci5d3yC_CjvPHmIBmRB8Koso0Cw23QaDfsdvQhvUICn2zKc6d5EaAdzofoOonPyBp3sYla1WCZV8nMgMgJ0id9oPLGrsocClPPY1aiHibpQggd1s0fbutT1YCflZa-9cqA02bnGmCrzcquy1DAU49oxbM0', status: 'online' },
  5: { name: 'Noah Foster', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4XUaVdiqZX6z8DPKDBhpUGZBYNu0A08RuQmwc3Zjxno4Pa6FmH_cMa0Xx_ToXHwTq9pug7R7cVt0Sl2wWBAxMKEo9UhNIpry6PODHCoItyJTeJAlk8vUXDqNoppRxF0XDndt0SeGO4k35L9REtwGlSfJQPncBHoWfHfGACVKr_e305tQb3MRDRZvPM2L61qX2_nfUjPNSMcMvAbsgojYLaOylB51t2xWD1zpCEsBWfHPEe8Q-dsi39bedt-d449NcjVsUrttFnckF', status: 'online' },
  6: { name: 'Ava Coleman', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Fvpi8F9f4cZ-Xs-3hdn6Z0Ef6SBJuvRUxWDG9-5L24u27l4n8UU57IhyLpkdTlbUiib79D_Lwb2aaUpxAujfqhNAQvr6hhUctudyeYFIBmqbD20sd-aTVFn6aoYrVmnLL9LBxUYSivRos6Qs0D7ZayqKJJbmnchmCGWE2F16sjeO_iTOn552Cm-SWSpEZKF6GSWJ75SvJNI7-2MrihNwHAv2JsnMUcNPHgcMfIUAan0tn49ktBKD-kkOkh9xaFH79BUIHlrO1Ct3', status: 'online' },
}

const peer = computed(() => peersMap[chatId.value] ?? { name: 'Диалог', avatar: '', status: '' })
const avatarStyle = computed(() => (peer.value.avatar ? { backgroundImage: `url('${peer.value.avatar}')` } : {}))

const messages = ref<Message[]>([
  { id: 'm1', chatId: 1, authorId: 1, createdAt: '2025-10-15T10:00:00Z', type: 'text', text: 'Привет! Нужен логотип.' },
  { id: 'm2', chatId: 1, authorId: meId, createdAt: '2025-10-15T10:01:00Z', type: 'text', text: 'Добрый день! Расскажите подробности.' },
])

const thread = computed(() => messages.value.filter(m => m.chatId === chatId.value))

const messagesWrap = ref<HTMLElement | null>(null)
const bottomAnchor = ref<HTMLElement | null>(null)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

async function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  await nextTick()
  bottomAnchor.value?.scrollIntoView({ block: 'end', behavior })
}

watch(thread, () => { scrollToBottom() })

let ro: ResizeObserver | null = null
onMounted(() => {
  scrollToBottom()
  if (messagesWrap.value && 'ResizeObserver' in window) {
    ro = new ResizeObserver(() => scrollToBottom())
    ro.observe(messagesWrap.value)
  }
})

onBeforeUnmount(() => { ro?.disconnect() })

function autoGrow(event?: Event) {
  const el = event ? (event.target as HTMLTextAreaElement) : textareaEl.value
  if (!el) return
  el.style.height = 'auto'
  const maxHeight = 180
  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  nextTick(() => scrollToBottom())
}

const draft = ref('')
const showEmoji = ref(false)
const emojis = ['😀', '😁', '😂', '🤣', '😊', '😍', '🤝', '👍', '🔥', '💡', '✅', '❗', '🎯', '🚀', '💼', '🧩']

function addEmoji(e: string) {
  draft.value += e
  showEmoji.value = false
  nextTick(() => autoGrow())
}

async function handleSend() {
  const text = draft.value.trim()
  if (!text) return

  messages.value.push({
    id: crypto.randomUUID(),
    chatId: chatId.value,
    authorId: meId,
    createdAt: new Date().toISOString(),
    type: 'text',
    text,
  })

  draft.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'
  await scrollToBottom('smooth')
  (document.activeElement as HTMLElement | null)?.blur?.()
  showEmoji.value = false
}

const fileInput = ref<HTMLInputElement | null>(null)
function openFilePicker() {
  fileInput.value?.click()
}

function onFilesPicked(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return

  for (const file of Array.from(files)) {
    const url = URL.createObjectURL(file)
    if (file.type.startsWith('image/')) {
      messages.value.push({
        id: crypto.randomUUID(),
        chatId: chatId.value,
        authorId: meId,
        createdAt: new Date().toISOString(),
        type: 'image',
        imageUrl: url,
      })
    } else {
      messages.value.push({
        id: crypto.randomUUID(),
        chatId: chatId.value,
        authorId: meId,
        createdAt: new Date().toISOString(),
        type: 'file',
        fileName: file.name,
        fileUrl: url,
      })
    }
  }

  ;(e.target as HTMLInputElement).value = ''
}

const recording = ref(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const chunks: BlobPart[] = []

async function toggleRecord() {
  if (!recording.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.value = new MediaRecorder(stream)
      chunks.length = 0
      mediaRecorder.value.ondataavailable = (ev) => chunks.push(ev.data)
      mediaRecorder.value.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        messages.value.push({
          id: crypto.randomUUID(),
          chatId: chatId.value,
          authorId: meId,
          createdAt: new Date().toISOString(),
          type: 'audio',
          audioUrl: url,
        })
      }
      mediaRecorder.value.start()
      recording.value = true
    } catch (error) {
      console.error('Microphone permission error:', error)
      recording.value = false
    }
  } else {
    mediaRecorder.value?.stop()
    mediaRecorder.value = null
    recording.value = false
  }
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col bg-background-light dark:bg-background-dark" style="min-height: 100dvh">
    <header class="sticky top-0 z-10 flex items-center gap-3 border-b border-black/10 bg-white/80 p-3 backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
      <button type="button" class="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10" @click="goBack" aria-label="Назад">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div v-if="peer.avatar" class="h-10 w-10 rounded-full bg-cover bg-center" :style="avatarStyle" />
      <div v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold dark:bg-slate-700">
        {{ (peer.name?.[0] || '?').toUpperCase() }}
      </div>

      <div class="min-w-0">
        <p class="truncate font-semibold">{{ peer.name }}</p>
        <p class="text-xs text-emerald-600 dark:text-emerald-400">{{ peer.status }}</p>
      </div>
    </header>

    <main ref="messagesWrap" class="flex-1 overflow-y-auto overscroll-contain scroll-smooth px-3 pt-3 pb-24">
      <template v-if="thread.length">
        <div v-for="message in thread" :key="message.id" class="mb-2 flex w-full">
          <div
            class="max-w-[75%] rounded-2xl px-3 py-2 shadow-sm"
            :class="message.authorId === meId
              ? 'ml-auto bg-primary text-white'
              : 'mr-auto border border-black/10 bg-white text-slate-900 dark:border-white/10 dark:bg-white/10 dark:text-white'"
          >
            <template v-if="message.type === 'text'">
              <p class="whitespace-pre-line">{{ message.text }}</p>
            </template>

            <template v-else-if="message.type === 'image'">
              <img :src="message.imageUrl" alt="Изображение" class="max-h-64 w-auto rounded-xl object-contain" />
            </template>

            <template v-else-if="message.type === 'file'">
              <a :href="message.fileUrl" download class="break-all underline">{{ message.fileName || 'Файл' }}</a>
            </template>

            <template v-else-if="message.type === 'audio'">
              <audio :src="message.audioUrl" controls class="w-56" />
            </template>

            <div class="mt-1 text-[10px] opacity-70">
              {{ new Date(message.createdAt).toLocaleTimeString() }}
            </div>
          </div>
        </div>

        <div ref="bottomAnchor" class="h-2"></div>
      </template>

      <div v-else class="flex h-full items-center justify-center px-6 text-center text-slate-500 dark:text-slate-400">
        <div class="max-w-sm">
          <p class="text-base font-medium">Здесь будет ваша история сообщений</p>
          <p class="mt-1 text-sm">Напишите первое сообщение ниже — оно откроет диалог.</p>
        </div>
      </div>
    </main>

    <footer class="sticky bottom-0 left-0 right-0 z-20 border-t border-black/10 bg-white/90 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
      <form class="flex items-end gap-2" @submit.prevent="handleSend">
        <button type="button" class="rounded-xl p-2 text-[16px] hover:bg-black/5 dark:hover:bg-white/10" @click="openFilePicker" aria-label="Прикрепить файл">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 015 5L10 16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div class="relative flex-1">
          <textarea
            ref="textareaEl"
            v-model="draft"
            rows="1"
            placeholder="Напишите сообщение…"
            class="block w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 pr-10 text-[16px] leading-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
            @input="autoGrow"
            @keydown.enter.exact.prevent="handleSend"
            inputmode="text"
            enterkeyhint="send"
          />

          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[16px] hover:bg-black/5 dark:hover:bg-white/10"
            @click="showEmoji = !showEmoji"
            aria-label="Открыть эмодзи"
          >
            <span aria-hidden="true">😊</span>
          </button>

          <div
            v-if="showEmoji"
            class="absolute bottom-full mb-2 max-w-[260px] rounded-xl border border-black/10 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-slate-900"
          >
            <div class="flex flex-wrap gap-1">
              <button
                v-for="emoji in emojis"
                :key="emoji"
                type="button"
                class="rounded-md px-2 py-1 text-[16px] hover:bg-black/5 dark:hover:bg-white/10"
                @click="addEmoji(emoji)"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="rounded-xl p-2 text-[16px] hover:bg-black/5 dark:hover:bg-white/10"
          :class="recording ? 'animate-pulse text-rose-600' : ''"
          @click="toggleRecord"
          aria-label="Голосовое сообщение"
        >
          <svg v-if="!recording" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1a3 3 0 00-3 3v6a3 3 0 006 0V4a3 3 0 00-3-3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M19 10a7 7 0 01-14 0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 17v6" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="6" />
          </svg>
        </button>

        <button
          type="submit"
          class="h-10 shrink-0 rounded-xl bg-primary px-4 font-semibold text-white text-[16px] hover:opacity-90 active:translate-y-px disabled:opacity-50"
          :disabled="!draft.trim()"
        >
          Отправить
        </button>

        <input ref="fileInput" type="file" class="hidden" multiple @change="onFilesPicked" />
      </form>
    </footer>
  </div>
</template>
