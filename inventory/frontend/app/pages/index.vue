<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden">
    <InventorySearch
      v-model="searchQuery"
      :category="categoryFilter"
      :status="statusFilter"
      :categories="availableCategories"
      :statuses="availableStatuses"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      @update:category="inventoryStore.categoryFilter = $event"
      @update:status="inventoryStore.statusFilter = $event"
      @toggle-sort="inventoryStore.toggleSort"
      @clear="inventoryStore.clearFilters"
    />
    <InventoryStats
      :total="filteredItems.length"
      :available="availableCount"
      :checked-out="checkedOutCount"
    />

    <div class="min-h-0 flex-1 px-4 pb-4 md:px-6 md:pb-6">
      <InventoryTable
        :items="filteredItems"
        :selected-count="selectedCount"
        :all-selected="allSelected"
        :is-selected="isSelected"
        @toggle-item="inventoryStore.toggleItem"
        @select-all="inventoryStore.selectAll"
        @clear-selection="inventoryStore.clearSelection"
        @edit-selection="inventoryStore.editSelection"
        @move-selection="inventoryStore.moveSelection"
        @export-selection="inventoryStore.exportSelection"
        @label-selection="inventoryStore.labelSelection"
        @delete-selection="inventoryStore.deleteSelection"
      />
    </div>

    <div v-if="notice" class="toast toast-end z-50">
      <div class="alert" :class="noticeClass">
        <span>{{ notice }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useInventoryStore } from "~/stores/inventory";

const inventoryStore = useInventoryStore();

const {
  searchQuery,
  categoryFilter,
  statusFilter,
  sortKey,
  sortDirection,
  filteredItems,
  availableCategories,
  availableStatuses,
  availableCount,
  checkedOutCount,
  selectedCount,
  allSelected,
  notice,
  noticeClass,
} = storeToRefs(inventoryStore);

function isSelected(id: number) {
  return inventoryStore.isSelected(id);
}

onBeforeUnmount(() => {
  inventoryStore.clearNoticeTimer();
});
</script>
