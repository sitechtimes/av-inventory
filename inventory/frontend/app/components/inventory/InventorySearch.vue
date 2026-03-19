<template>
  <section
    class="flex flex-col gap-3 border-b border-base-300 px-4 py-3 md:px-6"
  >
    <div class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
      <label class="field-input flex items-center gap-2">
        <Icon name="lucide:search" class="text-base-content/60" />
        <input
          :value="modelValue"
          type="text"
          class="w-full bg-transparent outline-none"
          placeholder="Search by item, student, barcode"
          @input="
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value,
            )
          "
        />
      </label>

      <select
        :value="category"
        class="filter-select"
        @change="
          $emit('update:category', ($event.target as HTMLSelectElement).value)
        "
      >
        <option value="all">All categories</option>
        <option v-for="value in categories" :key="value" :value="value">
          {{ value }}
        </option>
      </select>

      <select
        :value="status"
        class="filter-select"
        @change="
          $emit('update:status', ($event.target as HTMLSelectElement).value)
        "
      >
        <option value="all">All statuses</option>
        <option v-for="value in statuses" :key="value" :value="value">
          {{ value }}
        </option>
      </select>

      <button type="button" class="btn-app-outline" @click="$emit('clear')">
        Clear Filters
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="btn-app-ghost"
        @click="$emit('toggleSort', 'name')"
      >
        Name
        <Icon :name="sortIcon('name')" class="text-sm" />
      </button>
      <button
        type="button"
        class="btn-app-ghost"
        @click="$emit('toggleSort', 'studentName')"
      >
        Student
        <Icon :name="sortIcon('studentName')" class="text-sm" />
      </button>
      <button
        type="button"
        class="btn-app-ghost"
        @click="$emit('toggleSort', 'barcode')"
      >
        Barcode
        <Icon :name="sortIcon('barcode')" class="text-sm" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  category: string;
  status: string;
  categories: string[];
  statuses: string[];
  sortKey: "name" | "studentName" | "barcode";
  sortDirection: "asc" | "desc";
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:category", value: string): void;
  (e: "update:status", value: string): void;
  (e: "toggleSort", key: "name" | "studentName" | "barcode"): void;
  (e: "clear"): void;
}>();

function sortIcon(key: "name" | "studentName" | "barcode") {
  if (props.sortKey !== key) {
    return "lucide:chevrons-up-down";
  }

  return props.sortDirection === "asc"
    ? "lucide:arrow-up"
    : "lucide:arrow-down";
}
</script>
