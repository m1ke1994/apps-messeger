<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16">
    <div class="absolute inset-0 animate-dots opacity-60"></div>

    <div class="relative z-10 w-full max-w-md">
      <div class="flex flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-2xl backdrop-blur">
        <header class="flex flex-col items-center gap-4">
          <div class="relative flex h-24 w-24 items-center justify-center">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/30"></span>
            <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 text-5xl text-emerald-400">
              <span class="material-symbols-outlined">chat</span>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400/70">Вход</p>
            <h1 class="mt-2 text-3xl font-semibold text-white">Продолжить через Telegram</h1>
          </div>
        </header>

        <p class="text-base leading-relaxed text-slate-300">
          Мы перенаправим вас в Telegram для подтверждения личности. После одобрения запроса вы автоматически вернётесь обратно в приложение.
        </p>

        <button
          type="button"
          class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          @click="loginWithTelegram"
        >
          Продолжить через Telegram
        </button>

        <p class="text-xs text-slate-400">
          Продолжая, вы соглашаетесь поделиться своим публичным профилем Telegram с этим приложением.
          Ознакомьтесь с нашей политикой конфиденциальности для получения дополнительной информации.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loginWithTelegram = () => {
  // Здесь будет реальная логика авторизации через Telegram
  console.log('Переход к аутентификации через Telegram')
}
</script>

<style scoped>
.animate-dots {
  background-image: radial-gradient(circle, rgba(16, 34, 28, 0.9) 1px, transparent 1px);
  background-size: 2rem 2rem;
  animation: move-dots 16s linear infinite;
}

@keyframes move-dots {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 2rem 2rem;
  }
}

</style>
