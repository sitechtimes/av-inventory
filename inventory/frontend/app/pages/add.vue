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

      <form
        v-if="showCreateForm"
        class="mt-6 space-y-4 text-left"
        @submit.prevent="createScannedEquipment(true)"
      >
        <h3 class="text-lg font-semibold">Equipment not found</h3>
        <label class="form-control w-full">
          <span class="label-text mb-2">Barcode</span>
          <input
            :value="scannedEquipment"
            type="text"
            class="input input-bordered w-full"
            maxlength="15"
            readonly
          />
          <span class="label-text-alt mt-1">Barcode cannot be changed</span>
        </label>
        <label class="form-control w-full">
          <span class="label-text mb-2">Equipment name</span>
          <input
            v-model="equipmentName"
            type="text"
            class="input input-bordered w-full"
            maxlength="100"
            required
          />
        </label>
        <label class="form-control w-full">
          <span class="label-text mb-2">Category</span>
          <select
            v-model="selectedCategory"
            class="select select-bordered w-full"
            required
          >
            <option value="" disabled>Select a category</option>
            <option
              v-for="category in categoryOptions"
              :key="category.value"
              :value="category.value"
            >
              {{ category.label }}
            </option>
            <option value="__new_category__">Create a new category</option>
          </select>
        </label>
        <label v-if="creatingCategory" class="form-control w-full">
          <span class="label-text mb-2">New category name</span>
          <input
            v-model="newCategoryName"
            type="text"
            class="input input-bordered w-full"
            maxlength="50"
            required
          />
        </label>
        <label class="form-control w-full">
          <span class="label-text mb-2">Initial condition</span>
          <select
            v-model="newEquipmentCondition"
            class="select select-bordered w-full"
          >
            <option value="">No condition</option>
            <option value="GOOD">Good</option>
            <option value="DAMAGED">Damaged</option>
            <option value="LOST">Lost</option>
          </select>
        </label>
        <div class="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            class="btn btn-outline flex-1"
            :disabled="
              creatingEquipment || !equipmentName.trim() || !categoryValue
            "
            @click="createScannedEquipment(false)"
          >
            <span v-if="!creatingEquipment">Create equipment</span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
          <button
            type="submit"
            class="btn btn-primary flex-1"
            :disabled="
              creatingEquipment || !equipmentName.trim() || !categoryValue
            "
          >
            <span v-if="!creatingEquipment">
              Create equipment and assign to student
            </span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
        </div>
      </form>
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
