<template>
  <Transition name="slide-down">
    <div
      v-if="selectedCount > 0"
      class="flex items-center justify-between px-4 py-2.5 bg-[#2d2d42] rounded-t-xl flex-shrink-0"
    >
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          checked
          class="w-[15px] h-[15px] cursor-pointer accent-red-700"
          @change="$emit('clear')"
        />
        <span class="text-sm font-medium text-white"
          >{{ selectedCount }} item{{
            selectedCount !== 1 ? "s" : ""
          }}
          selected</span
        >
        <button
          v-if="allSelected"
          class="text-[#a0a0c0] text-[13px] hover:text-white underline underline-offset-2 transition-colors"
          @click="$emit('clear')"
        >
          Clear All
        </button>
        <button
          v-else
          class="text-[#a0a0c0] text-[13px] hover:text-white underline underline-offset-2 transition-colors"
          @click="$emit('selectAll')"
        >
          Select All
        </button>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/20 rounded-md text-[#ddd] text-[12.5px] hover:bg-white/10 hover:text-white transition-colors"
        >
          <Icon name="edit" size="13px" /> Edit
        </button>
        <button
          class="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/20 rounded-md text-[#ddd] text-[12.5px] hover:bg-white/10 hover:text-white transition-colors"
        >
          <Icon name="move" size="13px" /> Move
        </button>
        <button
          class="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/20 rounded-md text-[#ddd] text-[12.5px] hover:bg-white/10 hover:text-white transition-colors"
        >
          <Icon name="export" size="13px" /> Export
        </button>
        <button
          class="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/20 rounded-md text-[#ddd] text-[12.5px] hover:bg-white/10 hover:text-white transition-colors"
        >
          <Icon name="label" size="13px" /> Create Label
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center text-[#aaa] hover:text-white transition-colors"
        >
          <Icon name="more" size="15px" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  selectedCount: number;
  allSelected: boolean;
}>();

defineEmits<{
  (e: "clear"): void;
  (e: "selectAll"): void;
}>();
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
