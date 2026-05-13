<template>
  <div class="space-y-4">
    <!-- Error alert -->
    <div v-if="error" class="alert alert-error">
      <span>{{ error }}</span>
      <button @click="$emit('clearError')" class="btn btn-sm btn-ghost">
        Dismiss
      </button>
    </div>

    <!-- Success alert -->
    <div v-if="successMessage" class="alert alert-success">
      <span>{{ successMessage }}</span>
    </div>

    <!-- Equipment display -->
    <div v-if="scannedEquipment" class="bg-base-300 p-4 rounded-lg">
      <p class="text-sm text-base-content/70">Scanned Equipment:</p>
      <p class="text-lg font-semibold">{{ scannedEquipment }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string;
  successMessage: string;
  scannedEquipment: string;
}>();

defineEmits<{
  clearError: [];
}>();
</script>
