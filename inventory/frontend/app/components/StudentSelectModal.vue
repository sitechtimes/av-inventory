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

      <div v-else>
        <label for="student-select" class="sr-only">Student</label>
        <select
          id="student-select"
          v-model="selectedOsis"
          class="select select-bordered w-full"
        >
          <option value="" disabled>Select a student</option>
          <option
            v-for="student in students"
            :key="student.osis"
            :value="student.osis"
          >
            {{ student.first_name }} {{ student.last_name }} ({{
              student.osis
            }})
          </option>
        </select>
      </div>

      <div class="mt-4">
        <p class="text-sm text-base-content/70 mb-2">
          Initial condition: {{ conditionLabel(initialCondition) }}
        </p>
        <label for="equipment-condition" class="label">
          <span class="label-text">Condition</span>
        </label>
        <select
          id="equipment-condition"
          v-model="selectedCondition"
          class="select select-bordered w-full"
        >
          <option value="">No condition</option>
          <option value="GOOD">Good</option>
          <option value="DAMAGED">Damaged</option>
          <option value="LOST">Lost</option>
        </select>
      </div>

      <div class="divider"></div>

      <button
        type="button"
        @click="assign"
        :disabled="!selectedStudent || checkoutLoading"
        class="w-full btn btn-primary"
      >
        <span v-if="!checkoutLoading">Assign to student</span>
        <span v-else class="loading loading-spinner loading-sm"></span>
      </button>

      <button
        type="button"
        @click="checkout"
        :disabled="checkoutLoading"
        class="w-full btn btn-success"
      >
        <span v-if="!checkoutLoading">Checkout</span>
        <span v-else class="loading loading-spinner loading-sm"></span>
      </button>

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
const equipmentStore = useEquipmentStore();

const props = defineProps<{
  students: Student[];
  loading: boolean;
  error: string | null;
  equipmentName: string;
  initialCondition: string;
}>();

const emit = defineEmits<{
  select: [student: Student];
  cancel: [];
  quickCheckoutSuccess: [];
}>();

const modalRef = ref<HTMLDialogElement>();
const checkoutLoading = ref(false);
const selectedOsis = ref("");
const selectedCondition = ref("");

const conditionLabel = (condition: string) => {
  if (!condition) {
    return "None";
  }

  return condition.charAt(0) + condition.slice(1).toLowerCase();
};

const selectedStudent = computed(() =>
  props.students.find((student) => student.osis === selectedOsis.value),
);

const assign = async () => {
  if (!props.equipmentName || !selectedStudent.value) {
    return;
  }

  checkoutLoading.value = true;

  try {
    await equipmentStore.submitEquipmentStatus(
      props.equipmentName,
      selectedStudent.value,
      selectedCondition.value,
    );
    emit("select", selectedStudent.value);
    emit("quickCheckoutSuccess");
    modalRef.value?.close();
  } catch (error) {
    console.error("Assignment error:", error);
  } finally {
    checkoutLoading.value = false;
  }
};

const checkout = async () => {
  if (!props.equipmentName) {
    return;
  }

  checkoutLoading.value = true;

  try {
    const result = await equipmentStore.checkout(
      props.equipmentName,
      selectedCondition.value,
    );
    if (result.success) {
      emit("quickCheckoutSuccess");
      modalRef.value?.close();
    }
  } catch (error) {
    console.error("Checkout error:", error);
  } finally {
    checkoutLoading.value = false;
  }
};

const cancel = () => {
  emit("cancel");
  modalRef.value?.close();
};

defineExpose({
  open: () => {
    selectedOsis.value = "";
    selectedCondition.value = props.initialCondition;
    modalRef.value?.showModal();
  },
  close: () => modalRef.value?.close(),
});
</script>
