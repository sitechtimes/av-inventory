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
            {{ student.firstName }} {{ student.lastName }}
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
            >{{ selectedStudent?.firstName }}
            {{ selectedStudent?.lastName }}</span
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
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Check In</span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
          <button
            type="button"
            @click="submitEquipmentStatus(false)"
            class="w-full btn btn-warning"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Check Out</span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
        </div>

        <div class="modal-action">
          <button
            type="button"
            @click="cancelStatusSelection"
            class="btn"
            :disabled="isLoading"
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
const router = useRouter();

// State
const scannedEquipment = ref("");
const selectedStudent = ref<any>(null);
const error = ref("");
const successMessage = ref("");
const isLoading = ref(false);

// Modal references
const studentModalRef = ref<HTMLDialogElement>();
const statusModalRef = ref<HTMLDialogElement>();

// Input reference
const inputRef = ref<HTMLInputElement>();

/**
 * Handle keyboard events - prevent all except paste
 */
const handleKeydown = (e: KeyboardEvent) => {
  // Allow paste shortcuts
  if ((e.ctrlKey || e.metaKey) && e.key === "v") {
    return;
  }
  // Prevent all other input
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

  // Fetch students if not already fetched
  if (studentStore.students.length === 0) {
    fetchStudents();
  }

  // Open student selection modal
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
const selectStudent = (student: any) => {
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
  selectedStudent.value = null;
  studentModalRef.value?.close();
  inputRef.value?.focus();
};

/**
 * Cancel status selection and go back
 */
const cancelStatusSelection = () => {
  selectedStudent.value = null;
  statusModalRef.value?.close();
  inputRef.value?.focus();
};

/**
 * Submit equipment status change to backend
 */
const submitEquipmentStatus = async (checkIn: boolean) => {
  // Validation
  if (!scannedEquipment.value || !selectedStudent.value) {
    error.value = "Missing equipment or student information.";
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      equipment_name: scannedEquipment.value,
      student_osis: selectedStudent.value.osis,
      status: checkIn ? "in" : "out",
    };

    const result = await tryRequestEndpoint(
      "equipment/equipment/",
      "POST",
      payload,
    );

    if (!("error" in result) && result.data) {
      // Success
      successMessage.value = `Equipment ${checkIn ? "checked in" : "checked out"} successfully!`;
      statusModalRef.value?.close();

      // Reset form
      setTimeout(() => {
        scannedEquipment.value = "";
        selectedStudent.value = null;
        clearSuccessMessage();
        inputRef.value?.focus();
      }, 2000);
    } else {
      throw new Error("Failed to update equipment status");
    }
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "An error occurred. Please try again.";
    console.error("Error submitting equipment status:", e);
  } finally {
    isLoading.value = false;
  }
};

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
