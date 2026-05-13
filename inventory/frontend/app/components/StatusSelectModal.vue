<template>
  <dialog ref="modalRef" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg mb-4">Select Status</h3>

      <!-- Student info -->
      <div v-if="selectedStudent" class="space-y-2 mb-6">
        <p class="text-sm text-base-content/70">
          Student:
          <span class="font-semibold"
            >{{ selectedStudent.first_name }} {{ selectedStudent.osis }}</span
          >
        </p>
        <p class="text-sm text-base-content/70">
          Equipment: <span class="font-semibold">{{ equipmentName }}</span>
        </p>
      </div>

      <div class="divider"></div>

      <!-- Action buttons -->
      <div class="space-y-2">
        <button
          type="button"
          @click="submitStatus(true)"
          class="w-full btn btn-success"
          :disabled="loading"
        >
          <span v-if="!loading">Check In</span>
          <span v-else class="loading loading-spinner loading-sm"></span>
        </button>
        <button
          type="button"
          @click="submitStatus(false)"
          class="w-full btn btn-warning"
          :disabled="loading"
        >
          <span v-if="!loading">Check Out</span>
          <span v-else class="loading loading-spinner loading-sm"></span>
        </button>
      </div>

      <!-- Cancel button -->
      <div class="modal-action">
        <button type="button" @click="cancel" class="btn" :disabled="loading">
          Cancel
        </button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button @click="cancel">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedStudent: Student | undefined;
  equipmentName: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  submit: [checkIn: boolean];
  cancel: [];
}>();

const modalRef = ref<HTMLDialogElement>();

/**
 * Submit status change
 */
const submitStatus = (checkIn: boolean) => {
  emit("submit", checkIn);
};

/**
 * Cancel modal
 */
const cancel = () => {
  emit("cancel");
  modalRef.value?.close();
};

// Expose methods for parent
defineExpose({
  open: () => modalRef.value?.showModal(),
  close: () => modalRef.value?.close(),
});
</script>
