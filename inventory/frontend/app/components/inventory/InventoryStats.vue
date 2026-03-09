<template>
  <div
    class="flex items-center gap-2.5 px-6 py-2.5 text-[13.5px] text-gray-500 flex-shrink-0"
  >
    <span><strong class="text-gray-800">Items:</strong> {{ total }}</span>
    <span class="text-gray-300 text-base leading-none">·</span>
    <span
      ><strong class="text-gray-800">Total Quantity:</strong>
      {{ totalQty }} units</span
    >
  </div>
</template>

<script setup lang="ts">
defineProps<{
  total: number;
  totalQty: number;
}>();
</script>
