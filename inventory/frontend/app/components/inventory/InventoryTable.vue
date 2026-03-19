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
          <tr
            v-for="item in items"
            :key="item.id"
            :class="isSelected(item.id) ? 'active' : ''"
          >
            <td>
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="isSelected(item.id)"
                @change="$emit('toggleItem', item.id)"
              />
            </td>
            <td>
              <div class="flex items-center gap-2">
                <Icon name="lucide:package" class="text-base-content/60" />
                <span class="font-medium">{{ item.name }}</span>
              </div>
            </td>
            <td class="font-mono text-xs">{{ item.studentId }}</td>
            <td>{{ item.studentName }}</td>
            <td>
              <span class="badge badge-outline">{{ item.category }}</span>
            </td>
            <td>
              <span class="badge" :class="statusClass(item.status)">
                {{ item.status }}
              </span>
            </td>
            <td class="font-mono text-xs">{{ item.barcode }}</td>
          </tr>
          <tr v-if="items.length === 0">
            <td
              colspan="7"
              class="py-10 text-center text-sm text-base-content/60"
            >
              No items match the current filters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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

function statusClass(status: string) {
  return status === "Available"
    ? "badge-success badge-outline"
    : "badge-warning badge-outline";
}
</script>
