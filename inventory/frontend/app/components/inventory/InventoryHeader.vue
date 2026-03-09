<template>
  <header
    class="flex items-center justify-between px-6 h-[52px] bg-white border-b border-[#e8e8ee] flex-shrink-0"
  >
    <h1 class="text-sm font-semibold text-[#1a1a2e]">AV Inventory</h1>
    <div class="flex items-center gap-2">
      <button
        class="w-8 h-8 border border-[#e0e0e8] bg-white rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Icon name="more" size="16px" />
      </button>
      <button
        class="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold tracking-wide rounded-md transition-colors"
        @click="$emit('add')"
      >
        <Icon name="plus" size="13px" />
        ADD NEW
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  (e: "add"): void;
}>();
</script>
