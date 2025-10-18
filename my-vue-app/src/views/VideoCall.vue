<template>
  <div class="flex min-h-screen flex-col bg-black text-white">
    <main class="flex-1">
      <VideoPhone
        class="h-full w-full"
        :contact-name="peerName"
        :subtitle="callSubtitle"
        :muted="muted"
        :camera-off="cameraOff"
        :remote-video="peerVideo"
        :local-preview="localPreview"
        :elapsed="elapsed"
        @toggle-mute="toggleMute"
        @toggle-camera="toggleCamera"
        @swap-camera="swapCamera"
        @hangup="endCall"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VideoPhone from '@/components/VideoPhone.vue'
import { peersMap } from '@/data/peers'

const route = useRoute()
const router = useRouter()

const muted = ref(false)
const cameraOff = ref(false)
const elapsed = ref('03:12')

const peerId = computed(() => {
  const raw = route.params.id
  const parsed =
    typeof raw === 'string'
      ? parseInt(raw, 10)
      : Array.isArray(raw)
        ? parseInt(raw[0], 10)
        : NaN
  return Number.isFinite(parsed) ? parsed : null
})

const peer = computed(() => (peerId.value != null ? peersMap[peerId.value] : null))

watch(
  peer,
  (next) => {
    if (!next) {
      router.replace({ name: 'chats' })
    }
  },
  { immediate: true }
)

const peerName = computed(() => peer.value?.name ?? 'Contact')
const peerVideo = computed(() => peer.value?.avatar ?? 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80')
const localPreview = computed(() => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80')
const callSubtitle = computed(() => (cameraOff.value ? 'Camera is off' : 'Live video'))

const toggleMute = () => {
  muted.value = !muted.value
}

const toggleCamera = () => {
  cameraOff.value = !cameraOff.value
}

const swapCamera = () => {
  cameraOff.value = false
}

const endCall = () => {
  if (window.history.length > 1) {
    router.back()
  } else if (peerId.value != null) {
    router.replace({ name: 'chat-detail', params: { id: peerId.value } })
  } else {
    router.replace({ name: 'chats' })
  }
}
</script>
