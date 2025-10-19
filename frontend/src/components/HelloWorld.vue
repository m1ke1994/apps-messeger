<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <section class="flex flex-col gap-4 text-center md:text-left">
    <h1 class="text-3xl font-semibold text-emerald-600 sm:text-4xl">{{ msg }}</h1>
    <p class="text-base text-slate-600 sm:text-lg">
      Vue Router, Pinia, and Tailwind CSS are already wired in. Start building pages, stores, and
      components with TypeScript right away.
    </p>
    <div
      class="flex flex-wrap justify-center gap-3 text-sm font-semibold md:justify-start md:text-base"
    >
      <a
        class="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        href="https://vuejs.org/guide/introduction.html"
        target="_blank"
        rel="noopener"
      >
        Vue Docs
      </a>
      <a
        class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-emerald-600 shadow-sm ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        href="https://tailwindcss.com/docs/installation"
        target="_blank"
        rel="noopener"
      >
        Tailwind Docs
      </a>
    </div>
  </section>
</template>
