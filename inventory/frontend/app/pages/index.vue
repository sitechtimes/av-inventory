<template>
  <div class="flex flex-col h-full overflow-hidden">
    <InventoryHeader @add="onAdd" />
    <InventorySearch v-model="searchQuery" />
    <InventoryStats :total="items.length" :total-qty="totalQty" />

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
    studentId: "123456789",
    studentName: "Smith, J.",
    quantity: 3,
    category: "Camera",
    barcode: "012345678901",
  },
  {
    id: 2,
    name: "Canon EOS R5 Body",
    studentId: "234567890",
    studentName: "Doe, A.",
    quantity: 2,
    category: "Camera",
    barcode: "012345678902",
  },
  {
    id: 3,
    name: "Shure SM7B Microphone",
    studentId: "345678901",
    studentName: "Park, K.",
    quantity: 6,
    category: "Audio",
    barcode: "012345678903",
  },
  {
    id: 4,
    name: "Rode NTG5 Shotgun Mic",
    studentId: "456789012",
    studentName: "Chen, L.",
    quantity: 4,
    category: "Audio",
    barcode: "012345678904",
  },
  {
    id: 5,
    name: "Blackmagic ATEM Mini Pro",
    studentId: "567890123",
    studentName: "Garcia, M.",
    quantity: 2,
    category: "Switcher",
    barcode: "012345678905",
  },
  {
    id: 6,
    name: "Sony UWP-D21 Wireless Kit",
    studentId: "678901234",
    studentName: "Lee, S.",
    quantity: 5,
    category: "Audio",
    barcode: "012345678906",
  },
  {
    id: 7,
    name: "Sennheiser EW 135P G4",
    studentId: "789012345",
    studentName: "Wang, R.",
    quantity: 3,
    category: "Audio",
    barcode: "012345678907",
  },
  {
    id: 8,
    name: "Manfrotto 504X Tripod",
    studentId: "890123456",
    studentName: "Patel, D.",
    quantity: 10,
    category: "Support",
    barcode: "012345678908",
  },
  {
    id: 9,
    name: "Aputure 300d Mark II Light",
    studentId: "901234567",
    studentName: "fffffaowem, Timyy",
    quantity: 4,
    category: "Lighting",
    barcode: "012345678909",
  },
]);

const selectedIds = ref<Set<number>>(new Set());
const searchQuery = ref("");

function toggleItem(id: number) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
}

function isSelected(id: number) {
  return selectedIds.value.has(id);
}

function selectAll() {
  selectedIds.value = new Set(items.value.map((item) => item.id));
}

function clearSelection() {
  selectedIds.value = new Set();
}

function onAdd() {
  // not hooked up yet
}

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const search = searchQuery.value.toLowerCase();
  return items.value.filter((item) => item.name.toLowerCase().includes(search));
});

const totalQty = computed(() => {
  let total = 0;
  for (const item of items.value) total += item.quantity;
  return total;
});

const selectedCount = computed(() => selectedIds.value.size);

const allSelected = computed(() => {
  return items.value.length > 0 && selectedCount.value === items.value.length;
});
</script>
