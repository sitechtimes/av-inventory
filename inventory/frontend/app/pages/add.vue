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

      <button
        v-if="scannedEquipment"
        type="button"
        class="btn btn-outline btn-sm mt-4"
        @click="resetScan"
      >
        Scan again
      </button>

      <div v-if="lookupError" class="alert alert-error mt-4" role="alert">
        <span>{{ lookupError }}</span>
      </div>
      <div v-if="successMessage" class="alert alert-success mt-4" role="status">
        <span>{{ successMessage }}</span>
      </div>

      <AddEquipmentCreateForm
        v-if="showCreateForm"
        :barcode="scannedEquipment"
        v-model:equipment-name="equipmentName"
        v-model:selected-category="selectedCategory"
        v-model:new-category-name="newCategoryName"
        v-model:new-equipment-condition="newEquipmentCondition"
        :category-options="categoryOptions"
        :creating-category="creatingCategory"
        :can-create="canCreateEquipment"
        :creating-equipment="creatingEquipment"
        @create="createScannedEquipment"
      />
    </div>

    <StudentSelectModal
      ref="studentModalRef"
      :students="studentStore.students"
      :loading="studentStore.loading"
      :error="studentStore.error"
      :equipment-name="equipmentName"
      :initial-condition="equipmentCondition"
      @select="selectStudent"
      @cancel="cancelStudentSelection"
      @quick-checkout-success="handleCheckout"
    />
  </div>
</template>

<script setup lang="ts">
const studentStore = useStudentStore();
const equipmentStore = useEquipmentStore();

const scannedEquipment = ref("");
const equipmentName = ref("");
const equipmentCondition = ref("");
const selectedStudent = ref<Student>();
const showCreateForm = ref(false);
const selectedCategory = ref("");
const newCategoryName = ref("");
const newEquipmentCondition = ref("");
const creatingEquipment = ref(false);
const lookupError = ref("");
const successMessage = ref("");

const predefinedCategories = [
  { value: "BAG", label: "Camera Bag" },
  { value: "NXBAT", label: "Camera Battery" },
  { value: "BOOM", label: "Boom Pole" },
  { value: "PHBKT", label: "Phone Bracket" },
  { value: "TBBKT", label: "Tablet Bracket" },
  { value: "BCHG", label: "Camera Battery Charger" },
  { value: "NX100", label: "Camera" },
  { value: "HND", label: "Handheld Mic" },
  { value: "HDPH", label: "Headphones" },
  { value: "IPAD", label: "iPad" },
  { value: "LAPCHRG", label: "Laptop Charger" },
  { value: "LAV", label: "Lav Mic" },
  { value: "LED", label: "LED Light" },
  { value: "TSC-SD", label: "Tascam SD Card" },
  { value: "SD", label: "SD Card" },
  { value: "SHGN", label: "Shotgun Mic" },
  { value: "TSCM", label: "Tascam" },
  { value: "TPD", label: "Tripod Intro" },
  { value: "MANF", label: "Tripod Advanced" },
  { value: "MONPD", label: "Monopod" },
  { value: "XLR", label: "XLR Cable" },
];

const categoryOptions = computed(() => {
  const labels = new Map(
    predefinedCategories.map(({ value, label }) => [value, label]),
  );
  const values = new Set([
    ...predefinedCategories.map((category) => category.value),
    ...equipmentStore.equipment.map((item) => item.equipment_type),
  ]);

  return [...values]
    .map((value) => ({ value, label: labels.get(value) ?? value }))
    .sort((left, right) => left.label.localeCompare(right.label));
});

const creatingCategory = computed(
  () => selectedCategory.value === "__new_category__",
);
const categoryValue = computed(() =>
  creatingCategory.value
    ? newCategoryName.value.trim()
    : selectedCategory.value,
);
const canCreateEquipment = computed(
  () =>
    !creatingEquipment.value &&
    !!equipmentName.value.trim() &&
    !!categoryValue.value,
);

const barcodeInputRef = ref();
const studentModalRef = ref();

const handleEquipmentScanned = async (barcode: string) => {
  scannedEquipment.value = barcode;
  equipmentName.value = "";
  equipmentCondition.value = "";
  showCreateForm.value = false;
  selectedCategory.value = "";
  newCategoryName.value = "";
  newEquipmentCondition.value = "";
  lookupError.value = "";
  successMessage.value = "";

  try {
    const existingEquipment =
      await equipmentStore.findEquipmentByBarcode(barcode);
    if (!existingEquipment) {
      showCreateForm.value = true;
      return;
    }
    equipmentName.value = existingEquipment.name;
    equipmentCondition.value = existingEquipment.current_condition;
  } catch (error) {
    lookupError.value =
      error instanceof Error ? error.message : "Unable to look up equipment.";
    return;
  }

  if (studentStore.students.length === 0) {
    await fetchStudents();
  }

  setTimeout(() => {
    studentModalRef.value?.open();
  }, 100);
};

const createScannedEquipment = async (assignToStudent: boolean) => {
  const name = equipmentName.value.trim();
  const category = categoryValue.value;
  if (!scannedEquipment.value || !name || name.length > 100 || !category) {
    return;
  }

  creatingEquipment.value = true;
  lookupError.value = "";

  try {
    const createdEquipment = await equipmentStore.createEquipment(
      name,
      scannedEquipment.value,
      category,
      newEquipmentCondition.value,
    );
    equipmentName.value = createdEquipment.name;
    equipmentCondition.value = createdEquipment.current_condition;
    showCreateForm.value = false;
    successMessage.value = assignToStudent
      ? ""
      : "Equipment created successfully.";

    if (assignToStudent) {
      if (studentStore.students.length === 0) {
        await fetchStudents();
      }

      setTimeout(() => {
        studentModalRef.value?.open();
      }, 100);
    }
  } catch (error) {
    lookupError.value =
      error instanceof Error ? error.message : "Unable to create equipment.";
  } finally {
    creatingEquipment.value = false;
  }
};

const fetchStudents = async () => {
  try {
    await studentStore.fetchStudents();
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

const resetScan = () => {
  scannedEquipment.value = "";
  equipmentName.value = "";
  equipmentCondition.value = "";
  selectedStudent.value = undefined;
  showCreateForm.value = false;
  selectedCategory.value = "";
  newCategoryName.value = "";
  lookupError.value = "";
  successMessage.value = "";
  barcodeInputRef.value?.focus();
};

const cancelStudentSelection = resetScan;

const handleCheckout = () => {
  setTimeout(() => {
    scannedEquipment.value = "";
    equipmentName.value = "";
    equipmentCondition.value = "";
    selectedStudent.value = undefined;
    showCreateForm.value = false;
    selectedCategory.value = "";
    newCategoryName.value = "";
    lookupError.value = "";
    successMessage.value = "";
    barcodeInputRef.value?.focus();
  }, 1500);
};

onMounted(() => {
  barcodeInputRef.value?.focus();
  fetchStudents();
});
</script>
