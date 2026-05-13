<template>
  <div class="flex h-full items-center justify-center p-4 md:p-6">
    <!-- Barcode input (hidden) -->
    <BarcodeInput
      v-model="scannedEquipment"
      ref="barcodeInputRef"
      @paste="handleEquipmentScanned"
    />

    <!-- Main scanning interface -->
    <div class="panel-shell w-full max-w-xl p-6 text-center">
      <h2 class="text-2xl font-bold mb-4">Equipment Check-in/out</h2>
      <p class="text-base-content/70 mb-6">Scan equipment barcode to begin</p>

      <!-- Display component for alerts and equipment info -->
      <EquipmentDisplay
        :error="error"
        :success-message="successMessage"
        :scanned-equipment="scannedEquipment"
        @clear-error="clearError"
      />
    </div>

    <!-- Student selection modal -->
    <StudentSelectModal
      ref="studentModalRef"
      :students="studentStore.students"
      :loading="studentStore.loading"
      :error="studentStore.error"
      @select="selectStudent"
      @cancel="cancelStudentSelection"
    />

    <!-- Status selection modal -->
    <StatusSelectModal
      ref="statusModalRef"
      :selected-student="selectedStudent"
      :equipment-name="scannedEquipment"
      :loading="equipmentStore.statusLoading"
      @submit="submitEquipmentStatus"
      @cancel="cancelStatusSelection"
    />
  </div>
</template>

<script setup lang="ts">
const studentStore = useStudentStore();
const equipmentStore = useEquipmentStore();
const router = useRouter();

// State
const scannedEquipment = ref("");
const selectedStudent = ref<Student>();
const error = ref("");
const successMessage = ref("");

// Component refs
const barcodeInputRef = ref();
const studentModalRef = ref();
const statusModalRef = ref();

/**
 * Handle equipment scanned event
 */
const handleEquipmentScanned = async (equipmentName: string) => {
  if (!equipmentName) {
    error.value = "No text pasted. Please try again.";
    return;
  }

  scannedEquipment.value = equipmentName;
  clearError();
  clearSuccessMessage();

  // Fetch students if needed
  if (studentStore.students.length === 0) {
    await fetchStudents();
  }

  // Open student selection modal
  setTimeout(() => {
    studentModalRef.value?.open();
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

  // Open status selection modal
  setTimeout(() => {
    statusModalRef.value?.open();
  }, 100);
};

/**
 * Cancel student selection and reset
 */
const cancelStudentSelection = () => {
  scannedEquipment.value = "";
  selectedStudent.value = undefined;
  barcodeInputRef.value?.focus();
};

/**
 * Cancel status selection
 */
const cancelStatusSelection = () => {
  selectedStudent.value = undefined;
  barcodeInputRef.value?.focus();
};

/**
 * Submit equipment status change
 */
const submitEquipmentStatus = async (checkIn: boolean) => {
  // Validation
  if (!scannedEquipment.value || !selectedStudent.value) {
    error.value = "Missing equipment or student information.";
    return;
  }

  try {
    const result = await equipmentStore.submitEquipmentStatus(
      scannedEquipment.value,
      selectedStudent.value,
      checkIn,
    );

    if (result.success) {
      successMessage.value = result.message;
      statusModalRef.value?.close();

      // Reset form after showing success
      setTimeout(() => {
        scannedEquipment.value = "";
        selectedStudent.value = undefined;
        clearSuccessMessage();
        barcodeInputRef.value?.focus();
      }, 2000);
    }
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "An error occurred. Please try again.";
    console.error("Error submitting equipment status:", e);
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
  barcodeInputRef.value?.focus();
  fetchStudents();
});
</script>
