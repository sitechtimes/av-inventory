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
      <span class="badge" :class="statusClass(item.status)">
        {{ item.status }}
      </span>
    </td>
    <td class="font-mono text-xs">{{ item.barcode }}</td>
  </tr>
  <tr v-if="items.length === 0">
    <td colspan="7" class="py-10 text-center text-sm text-base-content/60">
      No items match the current filters.
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{
  items: InventoryItem[];
  isSelected: (id: number) => boolean;
}>();

defineEmits<{
  (e: "toggleItem", id: number): void;
}>();

function statusClass(status: string) {
  return status === "Available"
    ? "badge-success badge-outline"
    : "badge-warning badge-outline";
}
</script>
