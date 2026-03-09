<template>
  <div
    class="flex-1 overflow-y-auto bg-white rounded-xl border border-[#e8e8ee] flex flex-col"
  >
    <!-- Selection bar -->
    <InventorySelectionBar
      :selected-count="selectedCount"
      @clear="$emit('clearSelection')"
      @select-all="$emit('selectAll')"
    />

    <!-- Column header -->
    <div
      v-if="selectedCount === 0"
      class="grid grid-cols-[36px_44px_1fr_100px_130px_160px] px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-[#e8e8ee] flex-shrink-0"
    >
      <div class="flex items-center">
        <input
          type="checkbox"
          class="w-[15px] h-[15px] cursor-pointer accent-red-700"
          :checked="allSelected"
          @change="toggleAll"
        />
      </div>
      <div></div>
      <div class="flex items-center">Name</div>
      <div class="flex items-center">Quantity</div>
      <div class="flex items-center">Category</div>
      <div class="flex items-center">Barcode</div>
    </div>

    <!-- Item rows -->
    <ul class="flex-1 overflow-y-auto list-none">
      <li
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[36px_44px_1fr_100px_130px_160px] items-center px-4 min-h-[52px] border-b border-[#f0f0f5] last:border-b-0 transition-colors cursor-default"
        :class="isSelected(item.id) ? 'bg-red-50' : 'hover:bg-[#fafafe]'"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            class="w-[15px] h-[15px] cursor-pointer accent-red-700"
            :checked="isSelected(item.id)"
            @change="$emit('toggleItem', item.id)"
          />
        </div>
        <div class="flex items-center">
          <div
            class="w-8 h-8 rounded-md bg-[#f0f0f8] text-[#8888aa] flex items-center justify-center"
          >
            <Icon name="equipment" size="18px" />
          </div>
        </div>
        <div class="flex items-center overflow-hidden">
          <span class="text-[13.5px] text-gray-800 truncate">{{
            item.name
          }}</span>
        </div>
        <div class="text-[13.5px] text-gray-600">{{ item.quantity }} units</div>
        <div>
          <span
            class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#f0f0f8] rounded-full text-[12px] text-gray-600"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-[#aab0bf] flex-shrink-0"
            ></span>
            {{ item.category }}
          </span>
        </div>
        <div class="text-[12px] text-gray-400 font-mono">
          {{ item.barcode }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { InventoryItem } from "~~/utils/types/inventory";

defineProps<{
  items: InventoryItem[];
  selectedCount: number;
  allSelected: boolean;
  isSelected: (id: number) => boolean;
}>();

const emit = defineEmits<{
  (e: "toggleItem", id: number): void;
  (e: "selectAll"): void;
  (e: "clearSelection"): void;
}>();

function toggleAll(e: Event) {
  (e.target as HTMLInputElement).checked
    ? emit("selectAll")
    : emit("clearSelection");
}
</script>
