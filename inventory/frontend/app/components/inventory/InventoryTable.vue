<template>
  <div class="panel-shell flex h-full min-h-0 flex-col overflow-hidden">
    <InventorySelectionBar
      :selected-count="selectedCount"
      :all-selected="allSelected"
      @clear="$emit('clearSelection')"
      @select-all="$emit('selectAll')"
      @edit="$emit('editSelection')"
      @move="$emit('moveSelection')"
      @export="$emit('exportSelection')"
      @label="$emit('labelSelection')"
      @delete="$emit('deleteSelection')"
    />

    <div class="min-h-0 flex-1 overflow-auto">
      <table class="table table-zebra table-pin-rows">
        <thead>
          <tr>
            <th class="w-12">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="allSelected"
                @change="toggleAll"
              />
            </th>
            <th>Item</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Barcode</th>
          </tr>
        </thead>
        <tbody>
          <InventoryRows
            :items="items"
            :is-selected="isSelected"
            @toggle-item="$emit('toggleItem', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  (e: "editSelection"): void;
  (e: "moveSelection"): void;
  (e: "exportSelection"): void;
  (e: "labelSelection"): void;
  (e: "deleteSelection"): void;
}>();

function toggleAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  if (checked) {
    emit("selectAll");
  } else {
    emit("clearSelection");
  }
}
</script>
