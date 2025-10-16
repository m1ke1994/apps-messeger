<!-- src/views/ChatsDetail.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/* ================== Типы ================== */
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

/* ================== Роутинг ================== */
const route = useRoute()
const router = useRouter()
const meId = 999 // заглушка для "я"

/* ================== Параметры чата ================== */
const chatId = computed(() => {
  const raw = route.params.id
  const n = typeof raw === 'string' ? parseInt(raw, 10) : Array.isArray(raw) ? parseInt(raw[0], 10) : NaN
  return Number.isFinite(n) ? n : -1
})

// Если id некорректен — уходим назад
watch(chatId, (id) => {
  if (id < 0) router.replace({ name: 'chats' })
}, { immediate: true })

/* ================== Данные собеседника (fallback) ================== */
// Локальная мапа для демо; позже подменишь на стор (useChatsStore/byId)
const peersMap: Record<number, { name: string; avatar: string; status?: string }> = {
  1: { name: 'Liam Carter', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpHO0OQQxrD9-j22_4jad1JMGqJp5hwRvD8jL9-O-B5in1YrsR6xHl-VZiGRx4eJiVXkAh24kw1KBuA83SMccyhR3R9G4_orZ0KJSR202lhuw6zm43O9Eft-otpLwjdc0ZW6yA5EqNNe6x9WrJkSkLLxhY12zg6ikPDaf8qqQl3bq7a7zRNxgf3UnpCaWK6FGrYWtReKU7-mMS50JantlxyKp8-qbums7tJbzcCb0EqFpzHfi4F4Tvvynhm5osjfRgfkQrFOSoZexW', status: 'online' },
  2: { name: 'Sophia Bennett', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi5w1QFRTlV4GeSElwpw_sTTxvFvn1fZ4A2wi1cInF-UdjOADeQFgsy5J_72efoFZs7idflZ4tZfKIYXZoEz3rpq5KSOI-fDEWCF6-qdGauA5g-l6ROvOn5XRI3SY6E4Wy0XqyQoI6D2TK2pIA8l6DDWnNxDQdkZpA6D3JxO6CxybGKgbqY4bhPO6W7lx0TSYWmfVjntxge3OQXX3YemunzQ5_uLKETWZfbbGqIDbJHGvbnqJMP7QV5m4UnCHGADxPlfexjCaFDuhq', status: 'online' },
  3: { name: 'Ethan Harper',  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0rGm1pGqKtR5Hky7TfL8iJQ9KOLS8abNV678_95QyTRsEN-nBIz2vwc4ebRkWFZMXwRUfmkRtUD8BhoGfbcxlnfEt84JFhEEVP5P6EUYgokQzBkMWk3C175Yf2GuwGLHZcQg8zTV0HgIR2cba0OLDcsmjL557aZSgHQTzl0Q_qTa9F1OCdmAhp981Mq-rJHj8LfjtiOFFhf30GV1P-1tVfPgObZmy9kkdRoXJneQCTexDpWMHnjJXpYCL_LrQUE_TsmuAWyPbDjTf', status: 'online' },
  4: { name: 'Olivia Parker', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjC2PAAAIv0o054lb7vinX7E5xISRSowEtKDK0J8pQOCrejkVTJwF9JM7mK6zdG8_8S7cuoFO-p_TwhOzfsvhE4QKBByTX3_yPpO7mL1SwUWISgVhh4kci5d3yC_CjvPHmIBmRB8Koso0Cw23QaDfsdvQhvUICn2zKc6d5EaAdzofoOonPyBp3sYla1WCZV8nMgMgJ0id9oPLGrsocClPPY1aiHibpQggd1s0fbutT1YCflZa-9cqA02bnGmCrzcquy1DAU49oxbM0', status: 'online' },
  5: { name: 'Noah Foster',   avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4XUaVdiqZX6z8DPKDBhpUGZBYNu0A08RuQmwc3Zjxno4Pa6FmH_cMa0Xx_ToXHwTq9pug7R7cVt0Sl2wWBAxMKEo9UhNIpry6PODHCoItyJTeJAlk8vUXDqNoppRxF0XDndt0SeGO4k35L9REtwGlSfJQPncBHoWfHfGACVKr_e305tQb3MRDRZvPM2L61qX2_nfUjPNSMcMvAbsgojYLaOylB51t2xWD1zpCEsBWfHPEe8Q-dsi39bedt-d449NcjVsUrttFnckF', status: 'online' },
  6: { name: 'Ava Coleman',   avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Fvpi8F9f4cZ-Xs-3hdn6Z0Ef6SBJuvRUxWDG9-5L24u27l4n8UU57IhyLpkdTlbUiib79D_Lwb2aaUpxAujfqhNAQvr6hhUctudyeYFIBmqbD20sd-aTVFn6aoYrVmnLL9LBxUYSivRos6Qs0D7ZayqKJJbmnchmCGWE2F16sjeO_iTOn552Cm-SWSpEZKF6GSWJ75SvJNI7-2MrihNwHAv2JsnMUcNPHgcMfIUAan0tn49ktBKD-kkOkh9xaFH79BUIHlrO1Ct3', status: 'online' },
}

const peer = computed(() => {
  return peersMap[chatId.value] ?? { name: 'Диалог', avatar: '', status: '' }
})
const avatarStyle = computed(() =>
  peer.value.avatar ? { backgroundImage: `url('${peer.value.avatar}')` } : {}
)

/* ================== Сообщения (демо) ================== */
const messages = ref<Message[]>([
  { id: 'm1', chatId: 1, authorId: 1,   createdAt: '2025-10-15T10:00:00Z', type: 'text', text: 'Привет! Нужен логотип.' },
  { id: 'm2', chatId: 1, authorId: meId, createdAt: '2025-10-15T10:01:00Z', type: 'text', text: 'Привет! Расскажите детали.' },
])

// Фильтруем текущий тред
const thread = computed(() => messages.value.filter(m => m.chatId === chatId.value))

/* ================== Скролл вниз ================== */
const scroller = ref<HTMLElement | null>(null)
const scrollToBottom = async () => {
  await nextTick()
  const el = scroller.value
  if (el) el.scrollTo({ top: el.scrollHeight })
}
watch(thread, scrollToBottom)
onMounted(scrollToBottom)

// Подстраховка: реакция на изменение размеров (картинки/аудио)
let ro: ResizeObserver | null = null
onMounted(() => {
  if (scroller.value && 'ResizeObserver' in window) {
    ro = new ResizeObserver(scrollToBottom)
    ro.observe(scroller.value)
  }
})
onBeforeUnmount(() => { ro?.disconnect() })

/* ================== Ввод/эмодзи ================== */
const text = ref('')
const showEmoji = ref(false)
const emojis = ['😀','😁','😂','🤣','😊','😍','🤝','👍','🔥','💡','✅','❗','🎯','🚀','💼','🧩']

function addEmoji(e: string) {
  text.value += e
  showEmoji.value = false
}

function sendText() {
  const t = text.value.trim()
  if (!t) return
  messages.value.push({
    id: crypto.randomUUID(),
    chatId: chatId.value,
    authorId: meId,
    createdAt: new Date().toISOString(),
    type: 'text',
    text: t,
  })
  text.value = ''
}

/* ================== Файлы/картинки ================== */
const fileInput = ref<HTMLInputElement | null>(null)
function openFilePicker() { fileInput.value?.click() }

function onFilesPicked(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return

  for (const f of Array.from(files)) {
    const url = URL.createObjectURL(f)
    if (f.type.startsWith('image/')) {
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
        fileName: f.name,
        fileUrl: url,
      })
    }
  }
  ;(e.target as HTMLInputElement).value = '' // сброс инпута
}

/* ================== Голосовые ================== */
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
    } catch (err) {
      console.error('Microphone permission error:', err)
      recording.value = false
    }
  } else {
    mediaRecorder.value?.stop()
    mediaRecorder.value = null
    recording.value = false
  }
}

/* ================== Навигация ================== */
function goBack() { router.back() }
</script>

<template>
  <!-- Корень растянут на высоту экрана -->
  <div class="flex min-h-screen flex-col bg-background-light dark:bg-background-dark">
    <!-- Header -->
    <header class="sticky top-0 z-10 flex items-center gap-3 border-b border-black/10 bg-white/80 p-3 backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
      <button class="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10" @click="goBack" aria-label="Назад">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Аватар -->
      <div v-if="peer.avatar" class="h-10 w-10 rounded-full bg-cover bg-center" :style="avatarStyle" />
      <div v-else class="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold">
        {{ (peer.name?.[0] || '?').toUpperCase() }}
      </div>

      <div class="min-w-0">
        <p class="truncate font-semibold">{{ peer.name }}</p>
        <p class="text-xs text-emerald-600 dark:text-emerald-400">{{ peer.status }}</p>
      </div>
    </header>

    <!-- Messages -->
    <main ref="scroller" class="flex-1 overflow-y-auto p-3 flex flex-col justify-end">
      <div>
        <div v-for="m in thread" :key="m.id" class="mb-2 flex w-full">
          <div
            class="max-w-[75%] rounded-2xl px-3 py-2 shadow-sm"
            :class="m.authorId === meId
              ? 'ml-auto bg-primary text-white'
              : 'mr-auto bg-white dark:bg-white/10 dark:text-white border border-black/10 dark:border-white/10'"
          >
            <template v-if="m.type === 'text'">
              <p class="whitespace-pre-line">{{ m.text }}</p>
            </template>

            <template v-else-if="m.type === 'image'">
              <img :src="m.imageUrl" alt="image" class="rounded-xl max-h-64 w-auto object-contain" />
            </template>

            <template v-else-if="m.type === 'file'">
              <a :href="m.fileUrl" download class="underline break-all">{{ m.fileName || 'Файл' }}</a>
            </template>

            <template v-else-if="m.type === 'audio'">
              <audio :src="m.audioUrl" controls class="w-56" />
            </template>

            <div class="mt-1 text-[10px] opacity-70">
              {{ new Date(m.createdAt).toLocaleTimeString() }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Composer (footer) — всегда у низа -->
    <footer class="sticky bottom-0 border-t border-black/10 bg-white/80 p-3 backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
      <div class="flex items-end gap-2">
        <button class="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10" @click="openFilePicker" aria-label="Прикрепить">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 015 5L10 16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div class="relative flex-1">
          <textarea
            v-model="text"
            rows="1"
            placeholder="Сообщение"
            class="block w-full resize-none rounded-xl border border-black/10 bg-white/90 px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-white/10 dark:bg-white/10 dark:text-white"
            @keydown.enter.exact.prevent="sendText"
          />
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10"
            @click="showEmoji = !showEmoji"
            aria-label="Эмодзи"
          >
            <span>😊</span>
          </button>

          <div
            v-if="showEmoji"
            class="absolute bottom-full mb-2 max-w-[260px] rounded-xl border border-black/10 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-slate-900"
          >
            <div class="flex flex-wrap gap-1">
              <button v-for="e in emojis" :key="e" class="rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10" @click="addEmoji(e)">
                {{ e }}
              </button>
            </div>
          </div>
        </div>

        <button
          class="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10"
          :class="recording ? 'animate-pulse text-rose-600' : ''"
          @click="toggleRecord"
          aria-label="Голосовое"
        >
          <svg v-if="!recording" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1a3 3 0 00-3 3v6a3 3 0 006 0V4a3 3 0 00-3-3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 10a7 7 0 01-14 0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 17v6" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="6" />
          </svg>
        </button>

        <button class="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90 active:translate-y-px" @click="sendText">
          Отправить
        </button>

        <input ref="fileInput" type="file" class="hidden" multiple @change="onFilesPicked" />
      </div>
    </footer>
  </div>
</template>
