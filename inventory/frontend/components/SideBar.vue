<template>
  <aside
    class="fixed top-0 left-0 h-screen w-44 bg-gray-900 text-white flex flex-col"
  >
    <div class="text-lg font-bold p-4 border-b border-gray-700">Inventory</div>

    <nav class="flex-1 p-3 space-y-1">
      <NuxtLink
        to="/"
        class="block px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition"
      >
        Home
      </NuxtLink>

      <NuxtLink
        to="/items"
        class="block px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition"
      >
        Items
      </NuxtLink>

      <NuxtLink
        to="/students"
        class="block px-3 py-1.5 text-sm rounded hover:bg-gray-700 transition"
      >
        Students
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts"></script>
