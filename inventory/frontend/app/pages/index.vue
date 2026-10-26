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

    <div
      v-if="loading"
      class="flex min-h-0 flex-1 items-center justify-center text-sm text-base-content/70"
      role="status"
    >
      Loading inventory...
    </div>
    <div
      v-else-if="error"
      class="alert alert-error mx-4 mb-4 md:mx-6"
      role="alert"
    >
      <span>{{ error }}</span>
      <button class="btn btn-sm" type="button" @click="loadInventory">
        Retry
      </button>
    </div>
    <div v-else class="min-h-0 flex-1 px-4 pb-4 md:px-6 md:pb-6">
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
import type { InventoryId } from "~/types";
import { useInventoryStore } from "~/stores/inventory";
import { useEquipmentStore } from "../stores/equipment";
const equipmentStore = useEquipmentStore();

const inventoryStore = useInventoryStore();

const {
  searchQuery,
  categoryFilter,
  statusFilter,
  sortKey,
  sortDirection,
  loading,
  error,
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

function isSelected(id: InventoryId) {
  return inventoryStore.isSelected(id);
}

function loadInventory() {
  void inventoryStore.fetchInventory().catch((loadError) => {
    console.error("Page: Error loading inventory:", loadError);
  });
}

onMounted(loadInventory);

onBeforeUnmount(() => {
  inventoryStore.clearNoticeTimer();
});
</script>
