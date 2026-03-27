<template>
  <section
    v-if="selectedCount > 0"
    class="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 bg-base-100 px-4 py-2"
  >
    <div class="flex items-center gap-3">
      <span class="badge badge-neutral">
        {{ selectedCount }} item{{ selectedCount === 1 ? "" : "s" }} selected
      </span>
      <button
        v-if="allSelected"
        type="button"
        class="btn-app-ghost"
        @click="$emit('clear')"
      >
        Clear
      </button>
      <button
        v-else
        type="button"
        class="btn-app-ghost"
        @click="$emit('selectAll')"
      >
        Select all visible
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="btn-app-outline" @click="$emit('edit')">
        <Icon name="lucide:pencil" class="text-base" />
        Edit
      </button>
      <button type="button" class="btn-app-outline" @click="$emit('move')">
        <Icon name="lucide:move" class="text-base" />
        Move
      </button>
      <button type="button" class="btn-app-outline" @click="$emit('export')">
        <Icon name="lucide:download" class="text-base" />
        Export
      </button>
      <button type="button" class="btn-app-outline" @click="$emit('label')">
        <Icon name="lucide:tag" class="text-base" />
        Label
      </button>
      <button type="button" class="btn-app-danger" @click="$emit('delete')">
        <Icon name="lucide:trash-2" class="text-base" />
        Delete
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  selectedCount: number;
  allSelected: boolean;
}>();

defineEmits<{
  (e: "clear"): void;
  (e: "selectAll"): void;
  (e: "edit"): void;
  (e: "move"): void;
  (e: "export"): void;
  (e: "label"): void;
  (e: "delete"): void;
}>();
</script>
