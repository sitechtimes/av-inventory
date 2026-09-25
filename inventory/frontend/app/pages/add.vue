<template>
  <div class="flex h-full items-center justify-center p-4 md:p-6">
    <BarcodeInput
      v-model="scannedEquipment"
      ref="barcodeInputRef"
      @paste="handleEquipmentScanned"
    />

    <div class="panel-shell w-full max-w-xl p-6 text-center">
      <h2 class="text-2xl font-bold mb-4">Equipment Check-in/out</h2>
      <p class="text-base-content/70 mb-6">Scan equipment barcode to begin</p>

      <EquipmentDisplay :scanned-equipment="scannedEquipment" />
    </div>

    <StudentSelectModal
      ref="studentModalRef"
      :students="studentStore.students"
      :loading="studentStore.loading"
      :error="studentStore.error"
      :scanned-equipment="scannedEquipment"
      @select="selectStudent"
      @cancel="cancelStudentSelection"
      @quick-checkout-success="handleCheckout"
    />
  </div>
</template>

<script setup lang="ts">
const studentStore = useStudentStore();

const scannedEquipment = ref("");
const selectedStudent = ref<Student>();

const barcodeInputRef = ref();
const studentModalRef = ref();

const handleEquipmentScanned = async (equipmentName: string) => {
  scannedEquipment.value = equipmentName;

  if (studentStore.students.length === 0) {
    await fetchStudents();
  }

  setTimeout(() => {
    studentModalRef.value?.open();
  }, 100);
};

const fetchStudents = async () => {
  try {
    console.log("Fetching students...");
    await studentStore.fetchStudents();
    console.log("Students fetched:", studentStore.students);
  } catch (e) {
    console.error("Error fetching students:", e);
  }
};

const selectStudent = (student: Student) => {
  if (!student || !student.osis) {
    return;
  }

  selectedStudent.value = student;
};

const cancelStudentSelection = () => {
  scannedEquipment.value = "";
  selectedStudent.value = undefined;
  barcodeInputRef.value?.focus();
};

const handleCheckout = () => {
  setTimeout(() => {
    scannedEquipment.value = "";
    selectedStudent.value = undefined;
    barcodeInputRef.value?.focus();
  }, 1500);
};

onMounted(() => {
  barcodeInputRef.value?.focus();
  fetchStudents();
});
</script>
