<template>
  <div class="flex flex-wrap items-center gap-2 px-4 py-3 md:px-6">
    <span class="badge badge-neutral badge-outline">Items: {{ total }}</span>
    <span class="badge badge-success badge-outline"
      >Available: {{ available }}</span
    >
    <span class="badge badge-warning badge-outline"
      >Checked out: {{ checkedOut }}</span
    >
  </div>
</template>

<script setup lang="ts">
defineProps<{
  total: number;
  available: number;
  checkedOut: number;
}>();
</script>
