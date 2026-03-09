<template>
  <div
    class="flex items-center justify-between px-6 py-2.5 bg-white border-b border-[#e8e8ee] flex-shrink-0"
  >
    <div
      class="flex items-center gap-0 bg-[#f5f5fa] border border-[#e0e0e8] rounded-lg px-2.5 w-64"
    >
      <span class="text-gray-400"><Icon name="search" size="15px" /></span>
      <input
        :value="modelValue"
        class="flex-1 bg-transparent border-none outline-none px-2 py-1.5 text-[13.5px] text-gray-700 placeholder-gray-400"
        placeholder="Search..."
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
      <button class="text-gray-400 hover:text-gray-600 p-1 transition-colors">
        <Icon name="barcode" size="17px" />
      </button>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-1 px-3 py-1.5 border border-[#e0e0e8] bg-white rounded-md text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Name
        <Icon name="sort-down" size="13px" />
      </button>
      <button
        class="w-8 h-8 border border-[#e0e0e8] bg-white rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Icon name="grid" size="15px" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
