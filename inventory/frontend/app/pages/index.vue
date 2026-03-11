<template>
  <div class="flex flex-col h-full overflow-hidden">
    <InventoryHeader @add="onAdd" />
    <InventorySearch v-model="searchQuery" />
    <InventoryStats :total="stats.total" :total-qty="stats.totalQty" />

    <div class="flex-1 overflow-y-auto mx-6 mb-6">
      <InventoryTable
        :items="filteredItems"
        :selected-count="selectedCount"
        :all-selected="allSelected"
        :is-selected="isSelected"
        @toggle-item="toggleItem"
        @select-all="selectAll"
        @clear-selection="clearSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const items = ref<InventoryItem[]>([
  {
    id: 1,
    name: "Sony FX3 Cinema Camera",
    student: "123456789 — Smith, J.",
    quantity: 3,
    category: "Camera",
    barcode: "012345678901",
  },
  {
    id: 2,
    name: "Canon EOS R5 Body",
    student: "234567890 — Doe, A.",
    quantity: 2,
    category: "Camera",
    barcode: "012345678902",
  },
  {
    id: 3,
    name: "Shure SM7B Microphone",
    student: "345678901 — Park, K.",
    quantity: 6,
    category: "Audio",
    barcode: "012345678903",
  },
  {
    id: 4,
    name: "Rode NTG5 Shotgun Mic",
    student: "456789012 — Chen, L.",
    quantity: 4,
    category: "Audio",
    barcode: "012345678904",
  },
  {
    id: 5,
    name: "Blackmagic ATEM Mini Pro",
    student: "567890123 — Garcia, M.",
    quantity: 2,
    category: "Switcher",
    barcode: "012345678905",
  },
  {
    id: 6,
    name: "Sony UWP-D21 Wireless Kit",
    student: "678901234 — Lee, S.",
    quantity: 5,
    category: "Audio",
    barcode: "012345678906",
  },
  {
    id: 7,
    name: "Sennheiser EW 135P G4",
    student: "789012345 — Wang, R.",
    quantity: 3,
    category: "Audio",
    barcode: "012345678907",
  },
  {
    id: 8,
    name: "Manfrotto 504X Tripod",
    student: "890123456 — Patel, D.",
    quantity: 10,
    category: "Support",
    barcode: "012345678908",
  },
  {
    id: 9,
    name: "Aputure 300d Mark II Light",
    student: "901234567 — Kim, T.",
    quantity: 4,
    category: "Lighting",
    barcode: "012345678909",
  },
]);

const selectedIds = ref<Set<number>>(new Set());
const searchQuery = ref("");

function toggleItem(id: number) {
  const s = new Set(selectedIds.value);
  s.has(id) ? s.delete(id) : s.add(id);
  selectedIds.value = s;
}

function isSelected(id: number) {
  return selectedIds.value.has(id);
}

function selectAll() {
  selectedIds.value = new Set(items.value.map((i) => i.id));
}

function clearSelection() {
  selectedIds.value = new Set();
}

function onAdd() {
  // TODO: handle adding a new item
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const q = searchQuery.value.toLowerCase();
  return items.value.filter((i) => i.name.toLowerCase().includes(q));
});

const stats = computed(() => ({
  total: items.value.length,
  totalQty: items.value.reduce((s, i) => s + i.quantity, 0),
}));

const selectedCount = computed(() => selectedIds.value.size);
const allSelected = computed(
  () => selectedCount.value === items.value.length && items.value.length > 0,
);
</script>
