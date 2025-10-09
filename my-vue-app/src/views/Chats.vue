<script setup>
import { reactive, computed } from 'vue'

const state = reactive({
  currentTab: 'chats',
  chats: [
    {
      id: 1,
      name: 'Liam Carter',
      lastMessage: "I'm looking for a logo designer for my new startup.",
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDpHO0OQQxrD9-j22_4jad1JMGqJp5hwRvD8jL9-O-B5in1YrsR6xHl-VZiGRx4eJiVXkAh24kw1KBuA83SMccyhR3R9G4_orZ0KJSR202lhuw6zm43O9Eft-otpLwjdc0ZW6yA5EqNNe6x9WrJkSkLLxhY12zg6ikPDaf8qqQl3bq7a7zRNxgf3UnpCaWK6FGrYWtReKU7-mMS50JantlxyKp8-qbums7tJbzcCb0EqFpzHfi4F4Tvvynhm5osjfRgfkQrFOSoZexW',
    },
    {
      id: 2,
      name: 'Sophia Bennett',
      lastMessage: 'I need a website for my business.',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDi5w1QFRTlV4GeSElwpw_sTTxvFvn1fZ4A2wi1cInF-UdjOADeQFgsy5J_72efoFZs7idflZ4tZfKIYXZoEz3rpq5KSOI-fDEWCF6-qdGauA5g-l6ROvOn5XRI3SY6E4Wy0XqyQoI6D2TK2pIA8l6DDWnNxDQdkZpA6D3JxO6CxybGKgbqY4bhPO6W7lx0TSYWmfVjntxge3OQXX3YemunzQ5_uLKETWZfbbGqIDbJHGvbnqJMP7QV5m4UnCHGADxPlfexjCaFDuhq',
    },
    {
      id: 3,
      name: 'Ethan Harper',
      lastMessage: "I'm looking for a social media manager.",
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD0rGm1pGqKtR5Hky7TfL8iJQ9KOLS8abNV678_95QyTRsEN-nBIz2vwc4ebRkWFZMXwRUfmkRtUD8BhoGfbcxlnfEt84JFhEEVP5P6EUYgokQzBkMWk3C175Yf2GuwGLHZcQg8zTV0HgIR2cba0OLDcsmjL557aZSgHQTzl0Q_qTa9F1OCdmAhp981Mq-rJHj8LfjtiOFFhf30GV1P-1tVfPgObZmy9kkdRoXJneQCTexDpWMHnjJXpYCL_LrQUE_TsmuAWyPbDjTf',
    },
    {
      id: 4,
      name: 'Olivia Parker',
      lastMessage: 'I need a mobile app for my startup.',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDjC2PAAAIv0o054lb7vinX7E5xISRSowEtKDK0J8pQOCrejkVTJwF9JM7mK6zdG8_8S7cuoFO-p_TwhOzfsvhE4QKBByTX3_yPpO7mL1SwUWISgVhh4kci5d3yC_CjvPHmIBmRB8Koso0Cw23QaDfsdvQhvUICn2zKc6d5EaAdzofoOonPyBp3sYla1WCZV8nMgMgJ0id9oPLGrsocClPPY1aiHibpQggd1s0fbutT1YCflZa-9cqA02bnGmCrzcquy1DAU49oxbM0',
    },
    {
      id: 5,
      name: 'Noah Foster',
      lastMessage: "I'm looking for a content writer.",
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4XUaVdiqZX6z8DPKDBhpUGZBYNu0A08RuQmwc3Zjxno4Pa6FmH_cMa0Xx_ToXHwTq9pug7R7cVt0Sl2wWBAxMKEo9UhNIpry6PODHCoItyJTeJAlk8vUXDqNoppRxF0XDndt0SeGO4k35L9REtwGlSfJQPncBHoWfHfGACVKr_e305tQb3MRDRZvPM2L61qX2_nfUjPNSMcMvAbsgojYLaOylB51t2xWD1zpCEsBWfHPEe8Q-dsi39bedt-d449NcjVsUrttFnckF',
    },
    {
      id: 6,
      name: 'Ava Coleman',
      lastMessage: 'I need a graphic designer for my new project.',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Fvpi8F9f4cZ-Xs-3hdn6Z0Ef6SBJuvRUxWDG9-5L24u27l4n8UU57IhyLpkdTlbUiib79D_Lwb2aaUpxAujfqhNAQvr6hhUctudyeYFIBmqbD20sd-aTVFn6aoYrVmnLL9LBxUYSivRos6Qs0D7ZayqKJJbmnchmCGWE2F16sjeO_iTOn552Cm-SWSpEZKF6GSWJ75SvJNI7-2MrihNwHAv2JsnMUcNPHgcMfIUAan0tn49ktBKD-kkOkh9xaFH79BUIHlrO1Ct3',
    },
  ],
})

const chats = computed(() => state.chats)

function setTab(name) {
  state.currentTab = name
}

function tabClass(name) {
  return state.currentTab === name
    ? 'text-primary'
    : 'text-black/60 dark:text-white/60'
}

function bubbleClass(name) {
  return state.currentTab === name ? 'bg-primary/20' : ''
}
</script>
<template>
       <main class="flex-grow">
        <div class="flex flex-col">
          <article
            v-for="chat in chats"
            :key="chat.id"
            class="flex items-center gap-4 p-4 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition"
          >
            <div
              class="h-14 w-14 flex-shrink-0 rounded-full bg-cover bg-center"
              :style="{ backgroundImage: `url('${chat.avatar}')` }"
              :aria-label="`Avatar ${chat.name}`"
            ></div>

            <div class="flex-grow min-w-0">
              <p class="font-bold text-black dark:text-white truncate">{{ chat.name }}</p>
              <p class="text-sm text-black/60 dark:text-white/60 truncate">
                {{ chat.lastMessage }}
              </p>
            </div>
          </article>
        </div>
      </main>
</template>