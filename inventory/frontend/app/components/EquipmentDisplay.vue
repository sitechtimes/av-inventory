<template>
  <div class="space-y-4">
    <!-- Equipment display -->
    <div v-if="scannedEquipment" class="bg-base-300 p-4 rounded-lg">
      <p class="text-sm text-base-content/70">Scanned Equipment:</p>
      <p class="text-lg font-semibold">{{ scannedEquipment }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  scannedEquipment: string;
}>();
</script>
