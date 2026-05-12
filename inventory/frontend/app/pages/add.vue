<template>
  <div class="flex h-full items-center justify-center p-4 md:p-6">
    <!-- Hidden barcode input -->
    <input
      ref="inputRef"
      v-model="scannedEquipment"
      @keydown="handleKeydown"
      @paste="handlePaste"
      type="text"
      autofocus
      class="opacity-0 pointer-events-none"
    />

    <!-- Main scanning interface -->
    <div class="panel-shell w-full max-w-xl p-6 text-center">
      <h2 class="text-2xl font-bold mb-4">Equipment Check-in/out</h2>
      <p class="text-base-content/70 mb-6">Scan equipment barcode to begin</p>

      <!-- Error display -->
      <div v-if="error" class="alert alert-error mb-4">
        <span>{{ error }}</span>
        <button @click="clearError" class="btn btn-sm btn-ghost">
          Dismiss
        </button>
      </div>

      <!-- Success display -->
      <div v-if="successMessage" class="alert alert-success mb-4">
        <span>{{ successMessage }}</span>
      </div>

      <!-- Current status display -->
      <div v-if="scannedEquipment" class="bg-base-300 p-4 rounded-lg mb-6">
        <p class="text-sm text-base-content/70">Scanned Equipment:</p>
        <p class="text-lg font-semibold">{{ scannedEquipment }}</p>
      </div>
    </div>

    <!-- Student selection modal -->
    <dialog ref="studentModalRef" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg mb-4">Select Student</h3>
        <div class="divider"></div>

        <div v-if="studentStore.loading" class="text-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <p class="text-base-content/70 mt-4">Loading students...</p>
        </div>

        <div v-else-if="studentStore.error" class="alert alert-error mb-4">
          <span>{{ studentStore.error }}</span>
        </div>

        <div
          v-else-if="studentStore.students.length === 0"
          class="text-center py-8"
        >
          <p class="text-base-content/70">No students found</p>
        </div>

        <div v-else class="space-y-2 max-h-96 overflow-y-auto">
          <button
            v-for="student in studentStore.students"
            :key="student.osis"
            type="button"
            @click="selectStudent(student)"
            class="w-full btn btn-ghost justify-start text-left"
          >
            {{ student.first_name }} {{ student.osis }}
          </button>
        </div>

        <div class="modal-action">
          <button type="button" @click="cancelStudentSelection" class="btn">
            Cancel
          </button>
        </div>
      </form>
      <form method="dialog" class="modal-backdrop">
        <button @click="cancelStudentSelection">close</button>
      </form>
    </dialog>

    <!-- Status selection modal -->
    <dialog ref="statusModalRef" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg mb-4">Select Status</h3>
        <p class="text-sm text-base-content/70 mb-4">
          Student:
          <span class="font-semibold"
            >{{ selectedStudent?.first_name }} {{ selectedStudent?.osis }}</span
          >
        </p>
        <p class="text-sm text-base-content/70 mb-6">
          Equipment: <span class="font-semibold">{{ scannedEquipment }}</span>
        </p>
        <div class="divider"></div>

        <div class="space-y-2">
          <button
            type="button"
            @click="submitEquipmentStatus(true)"
            class="w-full btn btn-success"
            :disabled="equipmentStore.statusLoading"
          >
            <span v-if="!equipmentStore.statusLoading">Check In</span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
          <button
            type="button"
            @click="submitEquipmentStatus(false)"
            class="w-full btn btn-warning"
            :disabled="equipmentStore.statusLoading"
          >
            <span v-if="!equipmentStore.statusLoading">Check Out</span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
        </div>

        <div class="modal-action">
          <button
            type="button"
            @click="cancelStatusSelection"
            class="btn"
            :disabled="equipmentStore.statusLoading"
          >
            Cancel
          </button>
        </div>
      </form>
      <form method="dialog" class="modal-backdrop">
        <button @click="cancelStatusSelection">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
const studentStore = useStudentStore();
const equipmentStore = useEquipmentStore();
const router = useRouter();

const scannedEquipment = ref("");
const selectedStudent = ref<Student>();
const error = ref("");
const successMessage = ref("");

const studentModalRef = ref<HTMLDialogElement>();
const statusModalRef = ref<HTMLDialogElement>();

const inputRef = ref<HTMLInputElement>();

console.log(equipmentStore.equipment);

/**
 * Handle keyboard events - prevent all except paste
 */
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "v") {
    return;
  }
  e.preventDefault();
};

/**
 * Handle paste events - extract text and trigger equipment scan flow
 */
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedText = event.clipboardData?.getData("text/plain")?.trim();

  if (!pastedText) {
    error.value = "No text pasted. Please try again.";
    return;
  }

  scannedEquipment.value = pastedText;
  clearError();
  clearSuccessMessage();

  if (studentStore.students.length === 0) {
    fetchStudents();
  }

  setTimeout(() => {
    studentModalRef.value?.showModal();
  }, 100);
};

/**
 * Fetch students from store
 */
const fetchStudents = async () => {
  try {
    console.log("Fetching students...");
    await studentStore.fetchStudents();
    console.log("Students fetched:", studentStore.students);
  } catch (e) {
    error.value = "Failed to load students. Please try again.";
    console.error("Error fetching students:", e);
  }
};

/**
 * Handle student selection
 */
const selectStudent = (student: Student) => {
  if (!student || !student.osis) {
    error.value = "Invalid student selection.";
    return;
  }

  selectedStudent.value = student;
  studentModalRef.value?.close();

  // Open status selection modal
  setTimeout(() => {
    statusModalRef.value?.showModal();
  }, 100);
};

/**
 * Cancel student selection and reset
 */
const cancelStudentSelection = () => {
  scannedEquipment.value = "";
  selectedStudent.value = undefined;
  studentModalRef.value?.close();
  inputRef.value?.focus();
};

/**
 * Cancel status selection and go back
 */
const cancelStatusSelection = () => {
  selectedStudent.value = undefined;
  statusModalRef.value?.close();
  inputRef.value?.focus();
};

/**
 * Submit equipment status change to backend
 */
// const submitEquipmentStatus = async (checkIn: boolean) => {
//   // Validation
//   if (!scannedEquipment.value || !selectedStudent.value) {
//     error.value = "Missing equipment or student information.";
//     return;
//   }

//   try {
//     const result = await equipmentStore.submitEquipmentStatus(
//       scannedEquipment.value,
//       selectedStudent.value,
//       checkIn,
//     );

//     if (result.success) {
//       successMessage.value = result.message;
//       statusModalRef.value?.close();

//       // Reset form
//       setTimeout(() => {
//         scannedEquipment.value = "";
//         selectedStudent.value = undefined;
//         clearSuccessMessage();
//         inputRef.value?.focus();
//       }, 2000);
//     }
//   } catch (e) {
//     error.value =
//       e instanceof Error ? e.message : "An error occurred. Please try again.";
//     console.error("Error submitting equipment status:", e);
//   }
// };

// ...existing code...

/**
 * Clear error message
 */
const clearError = () => {
  error.value = "";
};

/**
 * Clear success message
 */
const clearSuccessMessage = () => {
  successMessage.value = "";
};

// Auto-focus input on mount
onMounted(() => {
  inputRef.value?.focus();
  fetchStudents();
});
</script>
