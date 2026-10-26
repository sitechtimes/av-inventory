<template>
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
      <span class="badge" :class="conditionClass(item.condition)">
        {{ conditionLabel(item.condition) }}
      </span>
    </td>
    <td>
      <span class="badge" :class="statusClass(item.status)">
        {{ item.status }}
      </span>
    </td>
    <td class="font-mono text-xs">{{ item.barcode }}</td>
  </tr>
  <tr v-if="items.length === 0">
    <td colspan="8" class="py-10 text-center text-sm text-base-content/60">
      No items match the current filters.
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { InventoryId, InventoryItem } from "~/types";

defineProps<{
  items: InventoryItem[];
  isSelected: (id: InventoryId) => boolean;
}>();

defineEmits<{
  (e: "toggleItem", id: InventoryId): void;
}>();

function statusClass(status: string) {
  return status === "Available"
    ? "badge-success badge-outline"
    : "badge-warning badge-outline";
}

function conditionClass(condition: string) {
  switch (condition) {
    case "GOOD":
      return "badge-success badge-outline";
    case "DAMAGED":
      return "badge-warning badge-outline";
    case "LOST":
      return "badge-error badge-outline";
    default:
      return "badge-outline";
  }
}

function conditionLabel(condition: string) {
  if (!condition) {
    return "None";
  }

  return condition.charAt(0) + condition.slice(1).toLowerCase();
}
</script>
