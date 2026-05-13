<template>
  <dialog ref="modalRef" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg mb-4">Select Student</h3>
      <div class="divider"></div>

      <div v-if="loading" class="text-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="text-base-content/70 mt-4">Loading students...</p>
      </div>

      <div v-else-if="error" class="alert alert-error mb-4">
        <span>{{ error }}</span>
      </div>

      <div v-else-if="students.length === 0" class="text-center py-8">
        <p class="text-base-content/70">No students found</p>
      </div>

      <div v-else class="space-y-2 max-h-96 overflow-y-auto">
        <button
          v-for="student in students"
          :key="student.osis"
          type="button"
          @click="selectStudent(student)"
          class="w-full btn btn-ghost justify-start text-left"
        >
          {{ student.first_name }} {{ student.osis }}
        </button>
      </div>

      <div class="modal-action">
        <button type="button" @click="cancel" class="btn">Cancel</button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button @click="cancel">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  students: Student[];
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  select: [student: Student];
  cancel: [];
}>();

const modalRef = ref<HTMLDialogElement>();

const selectStudent = (student: Student) => {
  if (!student || !student.osis) {
    return;
  }
  emit("select", student);
  modalRef.value?.close();
};

const cancel = () => {
  emit("cancel");
  modalRef.value?.close();
};

defineExpose({
  open: () => modalRef.value?.showModal(),
  close: () => modalRef.value?.close(),
});
</script>
