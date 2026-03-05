<template>
  <aside
    class="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col"
  >
    <!-- Logo / Title -->
    <div class="text-2xl font-bold p-6 border-b border-gray-700">MySite</div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <NuxtLink
        to="/"
        class="block px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        Home
      </NuxtLink>

      <!-- <NuxtLink
        to="/about"
        class="block px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        About Us
      </NuxtLink> -->
    </nav>
  </aside>
</template>

<script setup lang="ts"></script>
