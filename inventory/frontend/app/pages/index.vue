<script setup lang="ts">
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  barcode: string;
}

const items = ref<InventoryItem[]>([
  {
    id: 1,
    name: "Sony FX3 Cinema Camera",
    quantity: 3,
    category: "Camera",
    barcode: "012345678901",
  },
  {
    id: 2,
    name: "Canon EOS R5 Body",
    quantity: 2,
    category: "Camera",
    barcode: "012345678902",
  },
  {
    id: 3,
    name: "Shure SM7B Microphone",
    quantity: 6,
    category: "Audio",
    barcode: "012345678903",
  },
  {
    id: 4,
    name: "Rode NTG5 Shotgun Mic",
    quantity: 4,
    category: "Audio",
    barcode: "012345678904",
  },
  {
    id: 5,
    name: "Blackmagic ATEM Mini Pro",
    quantity: 2,
    category: "Switcher",
    barcode: "012345678905",
  },
  {
    id: 6,
    name: "Sony UWP-D21 Wireless Kit",
    quantity: 5,
    category: "Audio",
    barcode: "012345678906",
  },
  {
    id: 7,
    name: "Sennheiser EW 135P G4",
    quantity: 3,
    category: "Audio",
    barcode: "012345678907",
  },
  {
    id: 8,
    name: "Manfrotto 504X Tripod",
    quantity: 10,
    category: "Support",
    barcode: "012345678908",
  },
  {
    id: 9,
    name: "Aputure 300d Mark II Light",
    quantity: 4,
    category: "Lighting",
    barcode: "012345678909",
  },
]);

const selectedIds = ref<Set<number>>(new Set([3, 5]));
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

function toggleAll(e: Event) {
  (e.target as HTMLInputElement).checked ? selectAll() : clearSelection();
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

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Top bar -->
    <header
      class="flex items-center justify-between px-6 h-[52px] bg-white border-b border-[#e8e8ee] flex-shrink-0"
    >
      <h1 class="text-sm font-semibold text-[#1a1a2e]">AV Inventory</h1>
      <div class="flex items-center gap-2">
        <button
          class="w-8 h-8 border border-[#e0e0e8] bg-white rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Icon name="more" size="16px" />
        </button>
        <button
          class="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold tracking-wide rounded-md transition-colors"
        >
          <Icon name="plus" size="13px" />
          ADD NEW
        </button>
      </div>
    </header>

    <!-- Search + view controls -->
    <div
      class="flex items-center justify-between px-6 py-2.5 bg-white border-b border-[#e8e8ee] flex-shrink-0"
    >
      <div
        class="flex items-center gap-0 bg-[#f5f5fa] border border-[#e0e0e8] rounded-lg px-2.5 w-64"
      >
        <span class="text-gray-400"><Icon name="search" size="15px" /></span>
        <input
          v-model="searchQuery"
          class="flex-1 bg-transparent border-none outline-none px-2 py-1.5 text-[13.5px] text-gray-700 placeholder-gray-400"
          placeholder="Search..."
        />
        <button class="text-gray-400 hover:text-gray-600 p-1 transition-colors">
          <Icon name="barcode" size="17px" />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1 px-3 py-1.5 border border-[#e0e0e8] bg-white rounded-md text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Name
          <Icon name="sort-down" size="13px" />
        </button>
        <button
          class="w-8 h-8 border border-[#e0e0e8] bg-white rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Icon name="grid" size="15px" />
        </button>
      </div>
    </div>

    <!-- Stats row -->
    <div
      class="flex items-center gap-2.5 px-6 py-2.5 text-[13.5px] text-gray-500 flex-shrink-0"
    >
      <span
        ><strong class="text-gray-800">Items:</strong> {{ stats.total }}</span
      >
      <span class="text-gray-300 text-base leading-none">·</span>
      <span
        ><strong class="text-gray-800">Total Quantity:</strong>
        {{ stats.totalQty }} units</span
      >
    </div>

    <!-- List -->
    <div
      class="flex-1 overflow-y-auto mx-6 mb-6 bg-white rounded-xl border border-[#e8e8ee] flex flex-col"
    >
      <!-- Selection bar -->
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
              @change="clearSelection"
            />
            <span class="text-sm font-medium text-white"
              >{{ selectedCount }} item{{
                selectedCount !== 1 ? "s" : ""
              }}
              selected</span
            >
            <button
              class="text-[#a0a0c0] text-[13px] hover:text-white underline underline-offset-2 transition-colors"
              @click="selectAll"
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

      <!-- Column header -->
      <div
        v-if="selectedCount === 0"
        class="grid grid-cols-[36px_44px_1fr_100px_130px_160px] px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-[#e8e8ee] flex-shrink-0"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            class="w-[15px] h-[15px] cursor-pointer accent-red-700"
            :checked="allSelected"
            @change="toggleAll"
          />
        </div>
        <div></div>
        <div class="flex items-center">Name</div>
        <div class="flex items-center">Quantity</div>
        <div class="flex items-center">Category</div>
        <div class="flex items-center">Barcode</div>
      </div>

      <!-- Item rows -->
      <ul class="flex-1 overflow-y-auto list-none">
        <li
          v-for="item in filteredItems"
          :key="item.id"
          class="grid grid-cols-[36px_44px_1fr_100px_130px_160px] items-center px-4 min-h-[52px] border-b border-[#f0f0f5] last:border-b-0 transition-colors cursor-default"
          :class="isSelected(item.id) ? 'bg-red-50' : 'hover:bg-[#fafafe]'"
        >
          <div class="flex items-center">
            <input
              type="checkbox"
              class="w-[15px] h-[15px] cursor-pointer accent-red-700"
              :checked="isSelected(item.id)"
              @change="toggleItem(item.id)"
            />
          </div>
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-md bg-[#f0f0f8] text-[#8888aa] flex items-center justify-center"
            >
              <Icon name="equipment" size="18px" />
            </div>
          </div>
          <div class="flex items-center overflow-hidden">
            <span class="text-[13.5px] text-gray-800 truncate">{{
              item.name
            }}</span>
          </div>
          <div class="text-[13.5px] text-gray-600">
            {{ item.quantity }} units
          </div>
          <div>
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#f0f0f8] rounded-full text-[12px] text-gray-600"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-[#aab0bf] flex-shrink-0"
              ></span>
              {{ item.category }}
            </span>
          </div>
          <div class="text-[12px] text-gray-400 font-mono">
            {{ item.barcode }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
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
