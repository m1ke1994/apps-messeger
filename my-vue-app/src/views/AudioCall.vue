<template>
  <div class="h-[100svh] w-full overflow-hidden bg-[#0a1418] text-white">
    <AudioPhone
      class="h-[100svh] w-full"
      :contact-name="peerName"
      :subtitle="callSubtitle"
      :avatar="peerAvatar"
      :muted="muted"
      :speaker-on="speakerOn"
      :elapsed="elapsed"
      @toggle-mute="toggleMute"
      @toggle-speaker="toggleSpeaker"
      @hangup="endCall"
    />
  </div>
</template>



<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AudioPhone from '@/components/AudioPhone.vue'
import { peersMap } from '@/data/peers'

const route = useRoute()
const router = useRouter()

const muted = ref(false)
const speakerOn = ref(true)
const elapsed = ref('00:24')

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
const peerAvatar = computed(() => peer.value?.avatar ?? '')
const callSubtitle = computed(() => (muted.value ? 'You muted your mic' : 'Connecting…'))

const toggleMute = () => {
  muted.value = !muted.value
}

const toggleSpeaker = () => {
  speakerOn.value = !speakerOn.value
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

