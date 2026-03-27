<template>
  <div class="h-full overflow-auto p-4 md:p-6">
    <div class="mb-4">
      <h1 class="text-lg font-semibold">Students</h1>
      <p class="text-sm text-base-content/70">
        Click a student to view items currently out and checkout history.
      </p>
    </div>

    <div class="panel-shell divide-y divide-base-300 overflow-hidden">
      <details
        v-for="student in studentsWithDetails"
        :key="student.osis"
        class="group"
      >
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-base-200/60"
        >
          <div>
            <p class="font-medium">
              {{ student.lastName }}, {{ student.firstName }}
            </p>
            <p class="font-mono text-xs text-base-content/70">
              {{ student.osis }}
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="badge badge-outline"
              >Out: {{ student.itemsOut.length }}</span
            >
            <span class="badge badge-outline"
              >History: {{ student.history.length }}</span
            >
            <Icon
              name="lucide:chevron-down"
              class="text-base transition-transform group-open:rotate-180"
            />
          </div>
        </summary>

        <div
          class="grid gap-4 border-t border-base-300 bg-base-100 px-4 py-4 lg:grid-cols-2"
        >
          <section>
            <h2 class="mb-2 text-sm font-semibold">Items Out</h2>
            <ul v-if="student.itemsOut.length > 0" class="space-y-2">
              <li
                v-for="item in student.itemsOut"
                :key="item.id"
                class="rounded-lg border border-base-300 px-3 py-2"
              >
                <p class="text-sm font-medium">{{ item.name }}</p>
                <p class="font-mono text-xs text-base-content/70">
                  {{ item.barcode }}
                </p>
              </li>
            </ul>
            <p v-else class="text-sm text-base-content/60">
              No items currently checked out.
            </p>
          </section>

          <section>
            <h2 class="mb-2 text-sm font-semibold">History</h2>
            <ul v-if="student.history.length > 0" class="space-y-2">
              <li
                v-for="entry in student.history"
                :key="entry.id"
                class="rounded-lg border border-base-300 px-3 py-2"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-sm font-medium">{{ entry.itemName }}</p>
                  <span class="badge badge-outline">{{ entry.action }}</span>
                </div>
                <p class="font-mono text-xs text-base-content/70">
                  {{ entry.barcode }}
                </p>
                <p class="text-xs text-base-content/60">{{ entry.date }}</p>
              </li>
            </ul>
            <p v-else class="text-sm text-base-content/60">
              No history records yet.
            </p>
          </section>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useInventoryStore } from "~/stores/inventory";

const inventoryStore = useInventoryStore();
const { studentsWithDetails } = storeToRefs(inventoryStore);
</script>
