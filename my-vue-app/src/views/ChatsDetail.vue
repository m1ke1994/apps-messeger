<!-- src/views/ChatsDetail.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
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
const meId = 999

const chatId = computed(() => {
  const raw = route.params.id
  const parsed =
    typeof raw === 'string'
      ? parseInt(raw, 10)
      : Array.isArray(raw)
        ? parseInt(raw[0], 10)
        : NaN
  return Number.isFinite(parsed) ? parsed : -1
})

watch(chatId, (id) => {
  if (id < 0) router.replace({ name: 'chats' })
}, { immediate: true })

const messages = ref<Message[]>([
  { id: 'm1', chatId: 1, authorId: 1, createdAt: '2025-10-15T10:00:00Z', type: 'text', text: 'Привет! Нужен логотип.' },
  { id: 'm2', chatId: 1, authorId: meId, createdAt: '2025-10-15T10:01:00Z', type: 'text', text: 'Здравствуйте! Расскажите подробности.' },
])

const thread = computed(() => messages.value.filter(m => m.chatId === chatId.value))

const textareaEl = ref<HTMLTextAreaElement | null>(null)
const draft = ref('')
const hasDraft = computed(() => draft.value.trim().length > 0)

const showEmoji = ref(false)
const emojis = ['😀', '😁', '😂', '🤣', '😊', '😍', '🤝', '👍', '🔥', '💡', '✅', '❗', '🎯', '🚀', '💼', '🧩']

function autoGrow(event?: Event) {
  const el = event ? (event.target as HTMLTextAreaElement) : textareaEl.value
  if (!el) return
  el.style.height = 'auto'
  const maxHeight = 180
  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
}

function addEmoji(emoji: string) {
  draft.value += emoji
  showEmoji.value = false
  autoGrow()
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
  ;(document.activeElement as HTMLElement | null)?.blur?.()
  showEmoji.value = false
}

const fileInputAny = ref<HTMLInputElement | null>(null)
const fileInputImg = ref<HTMLInputElement | null>(null)

function openFilePickerAny() {
  fileInputAny.value?.click()
}
function openFilePickerImg() {
  fileInputImg.value?.click()
}

function onFilesPicked(e: Event, onlyImages = false) {
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
    } else if (!onlyImages) {
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

// небольшой автоскролл к последнему сообщению
const mainEl = ref<HTMLElement | null>(null)
watch(thread, () => {
  requestAnimationFrame(() => {
    mainEl.value?.scrollTo({ top: mainEl.value.scrollHeight, behavior: 'smooth' })
  })
})
onMounted(() => {
  requestAnimationFrame(() => {
    mainEl.value?.scrollTo({ top: mainEl.value.scrollHeight })
  })
})
</script>

<template>
  <div class="flex min-h-[100dvh] flex-col bg-background-light dark:bg-background-dark">
    <!-- Лента -->
    <main ref="mainEl" class="flex-1 overflow-y-auto overscroll-contain scroll-smooth px-3 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+6rem)]">
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
      </template>

      <div v-else class="flex h-full items-center justify-center px-6 text-center text-slate-500 dark:text-slate-400">
        <div class="max-w-sm">
          <p class="text-base font-medium">Здесь будет ваша история сообщений</p>
          <p class="mt-1 text-sm">Напишите первое сообщение ниже — оно откроет диалог.</p>
        </div>
      </div>
    </main>

    <!-- Футер с двумя состояниями -->
    <footer
      class="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-white/90 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur dark:border-white/10 dark:bg-slate-900/90"
    >
      <form class="flex items-end gap-2" @submit.prevent="handleSend">
        <!-- СКРЕПКА (всегда) -->
        <button
          type="button"
          class="rounded-xl p-2 text-[16px] hover:bg-black/5 dark:hover:bg-white/10"
          @click="openFilePickerAny"
          aria-label="Прикрепить файл"
        >
          <!-- paperclip -->
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 015 5L10 16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- ТЕКСТОВОЕ ПОЛЕ -->
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
          <!-- Emoji toggle -->
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[16px] hover:bg-black/5 dark:hover:bg-white/10"
            @click="showEmoji = !showEmoji"
            aria-label="Открыть эмодзи"
          >
            <span aria-hidden="true">😊</span>
          </button>

          <!-- Emoji picker -->
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

        <!-- ПРАВАЯ ЧАСТЬ -->
        <!-- Состояние 1: НЕТ текста -> показываем Фото + Голос -->
        <template v-if="!hasDraft">
          <!-- Фото -->
          <button
            type="button"
            class="rounded-xl p-2 text-[16px] hover:bg-black/5 dark:hover:bg-white/10"
            @click="openFilePickerImg"
            aria-label="Отправить фото"
          >
            <!-- camera -->
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h2l1.2-1.6A2 2 0 0 1 10.3 3h3.4a2 2 0 0 1 1.6.8L16.5 5H18A2.5 2.5 0 0 1 20.5 7.5V17A2 2 0 0 1 18.5 19h-13A2 2 0 0 1 3.5 17V7.5Z" stroke-width="2" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3.5" stroke-width="2"/>
            </svg>
          </button>

          <!-- Голос -->
          <button
            type="button"
            class="rounded-xl p-2 text-[16px] hover:bg-black/5 dark:hover:bg-white/10"
            :class="recording ? 'animate-pulse text-rose-600' : ''"
            @click="toggleRecord"
            aria-label="Голосовое сообщение"
          >
            <svg v-if="!recording" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M19 10a7 7 0 0 1-14 0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 17v5" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="6" />
            </svg>
          </button>
        </template>

        <!-- Состояние 2: ЕСТЬ текст -> показываем кнопку-отправку (самолёт) -->
        <template v-else>
          <button
            type="submit"
            class="h-10 shrink-0 rounded-xl bg-primary px-4 font-semibold text-white text-[16px] hover:opacity-90 active:translate-y-px disabled:opacity-50 flex items-center gap-2"
            :disabled="!hasDraft"
            aria-label="Отправить сообщение"
          >
            <!-- airplane -->
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M22 2L11 13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2l-7 20-4-9-9-4 20-7Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="sr-only">Отправить</span>
          </button>
        </template>

        <!-- Хиддены для выбора файлов -->
        <input ref="fileInputAny" type="file" class="hidden" multiple @change="(e) => onFilesPicked(e, false)" />
        <input ref="fileInputImg" type="file" class="hidden" accept="image/*" multiple @change="(e) => onFilesPicked(e, true)" />
      </form>
    </footer>
  </div>
</template>
