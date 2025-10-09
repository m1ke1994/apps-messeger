<!-- src/App.vue -->
<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <div class="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 backdrop-blur-sm dark:bg-background-dark/80"
      >
        <h1 class="flex-1 text-center text-lg font-bold text-black dark:text-white">Chats</h1>

        <button
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
          aria-label="New chat"
        >
        </button>
      </header>

      <!-- Content -->
      <main class="flex-grow">
        <router-view></router-view>
      </main>

      <!-- Footer Nav -->
      <footer
        class="sticky bottom-0 bg-background-light/80 pb-3 pt-2 backdrop-blur-sm dark:bg-background-dark/80"
      >
        <nav class="flex justify-around">
          <button
            class="flex flex-col items-center gap-1"
            :class="tabClass('chats')"
            @click="setTab('chats')"
            aria-label="Chats"
          >
            <div
              class="flex h-8 w-16 items-center justify-center rounded-full"
              :class="bubbleClass('chats')"
            >
             
            </div>
            <p class="text-xs font-medium">Чаты</p>
          </button>

          <button
            class="flex flex-col items-center gap-1"
            :class="tabClass('tasks')"
            @click="setTab('tasks')"
            aria-label="Tasks"
          >
            <div class="flex h-8 items-center justify-center">
              
            </div>
            <p class="text-xs font-medium">Задания</p>
          </button>

          <button
            class="flex flex-col items-center gap-1"
            :class="tabClass('responses')"
            @click="setTab('responses')"
            aria-label="Responses"
          >
            <div class="flex h-8 items-center justify-center">
             
            </div>
            <p class="text-xs font-medium">Отклики</p>
          </button>

          <button
            class="flex flex-col items-center gap-1"
            :class="tabClass('create')"
            @click="setTab('create')"
            aria-label="Create"
          >
            <div class="flex h-8 items-center justify-center">
             
            </div>
            <p class="text-xs font-medium">Создать</p>
          </button>

          <button
            class="flex flex-col items-center gap-1"
            :class="tabClass('profile')"
            @click="setTab('profile')"
            aria-label="Profile"
          >
            <div class="flex h-8 items-center justify-center">
             
            </div>
            <p class="text-xs font-medium">Профиль</p>
          </button>
        </nav>
      </footer>
    </div>
  </div>
</template>

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

<style scoped>
/* Ничего кастомного: вся стилизация через Tailwind. */
</style>
