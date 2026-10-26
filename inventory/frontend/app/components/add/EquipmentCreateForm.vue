<template>
  <form
    class="mt-6 space-y-4 text-left"
    @submit.prevent="emit('create', true)"
  >
    <h3 class="text-lg font-semibold">Equipment not found</h3>
    <label class="form-control w-full">
      <span class="label-text mb-2">Barcode</span>
      <input
        :value="barcode"
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
        :disabled="!canCreate"
        @click="emit('create', false)"
      >
        <span v-if="!creatingEquipment">Create equipment</span>
        <span v-else class="loading loading-spinner loading-sm"></span>
      </button>
      <button
        type="submit"
        class="btn btn-primary flex-1"
        :disabled="!canCreate"
      >
        <span v-if="!creatingEquipment">
          Create equipment and assign to student
        </span>
        <span v-else class="loading loading-spinner loading-sm"></span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  barcode: string;
  equipmentName: string;
  selectedCategory: string;
  newCategoryName: string;
  newEquipmentCondition: string;
  categoryOptions: { value: string; label: string }[];
  creatingCategory: boolean;
  canCreate: boolean;
  creatingEquipment: boolean;
}>();

const emit = defineEmits<{
  "update:equipmentName": [value: string];
  "update:selectedCategory": [value: string];
  "update:newCategoryName": [value: string];
  "update:newEquipmentCondition": [value: string];
  create: [assignToStudent: boolean];
}>();

const equipmentName = computed({
  get: () => props.equipmentName,
  set: (value: string) => emit("update:equipmentName", value),
});
const selectedCategory = computed({
  get: () => props.selectedCategory,
  set: (value: string) => emit("update:selectedCategory", value),
});
const newCategoryName = computed({
  get: () => props.newCategoryName,
  set: (value: string) => emit("update:newCategoryName", value),
});
const newEquipmentCondition = computed({
  get: () => props.newEquipmentCondition,
  set: (value: string) => emit("update:newEquipmentCondition", value),
});
</script>
