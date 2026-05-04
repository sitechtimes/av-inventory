//ben what is this im not even gonna touch or look at this godforsaken file and just make other stores that might have the same function :D

import { defineStore } from "pinia";
import {
  placeholderInventory,
  placeholderStudentHistory,
  placeholderStudents,
} from "~/data/placeholderData";

type SortKey = "name" | "studentName" | "barcode";
type NoticeType = "success" | "info" | "error";

function cloneInventory(items: InventoryItem[]) {
  return items.map((item) => ({ ...item }));
}

export const useInventoryStore = defineStore("inventory", () => {
  const inventory = ref<InventoryItem[]>(cloneInventory(placeholderInventory));
  const selectedIds = ref<number[]>([]);
  const searchQuery = ref("");
  const categoryFilter = ref("all");
  const statusFilter = ref("all");
  const sortKey = ref<SortKey>("name");
  const sortDirection = ref<"asc" | "desc">("asc");
  const notice = ref("");
  const noticeType = ref<NoticeType>("info");

  let noticeTimer: ReturnType<typeof setTimeout> | undefined;

  const filteredItems = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    const matched = inventory.value.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.name.toLowerCase().includes(query) ||
        item.studentId.toLowerCase().includes(query) ||
        item.studentName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        item.barcode.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter.value === "all" ||
        item.category === categoryFilter.value;

      const matchesStatus =
        statusFilter.value === "all" || item.status === statusFilter.value;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    return [...matched].sort((a, b) => {
      const direction = sortDirection.value === "asc" ? 1 : -1;

      if (sortKey.value === "studentName") {
        return a.studentName.localeCompare(b.studentName) * direction;
      }

      if (sortKey.value === "barcode") {
        return a.barcode.localeCompare(b.barcode) * direction;
      }

      return a.name.localeCompare(b.name) * direction;
    });
  });

  const availableCategories = computed(() => {
    return [...new Set(inventory.value.map((item) => item.category))].sort(
      (a, b) => a.localeCompare(b),
    );
  });

  const availableStatuses = computed(() => {
    return [...new Set(inventory.value.map((item) => item.status))].sort(
      (a, b) => a.localeCompare(b),
    );
  });

  const availableCount = computed(() => {
    return filteredItems.value.filter((item) => item.status === "Available")
      .length;
  });

  const checkedOutCount = computed(() => {
    return filteredItems.value.filter((item) => item.status !== "Available")
      .length;
  });

  const selectedCount = computed(() => selectedIds.value.length);

  const allSelected = computed(() => {
    return (
      filteredItems.value.length > 0 &&
      filteredItems.value.every((item) => selectedIds.value.includes(item.id))
    );
  });

  const noticeClass = computed(() => {
    if (noticeType.value === "success") {
      return "alert-success";
    }

    if (noticeType.value === "error") {
      return "alert-error";
    }

    return "alert-info";
  });

  const selectedItems = computed(() => {
    return filteredItems.value.filter((item) =>
      selectedIds.value.includes(item.id),
    );
  });

  const studentsWithDetails = computed(() => {
    return placeholderStudents
      .map((student) => {
        const itemsOut = inventory.value.filter(
          (item) =>
            item.studentId === student.osis && item.status === "Checked out",
        );

        const history = placeholderStudentHistory.filter(
          (entry) => entry.studentId === student.osis,
        );

        return {
          ...student,
          itemsOut,
          history,
        };
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  });

  function isSelected(id: number) {
    return selectedIds.value.includes(id);
  }

  function toggleItem(id: number) {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter(
        (selectedId) => selectedId !== id,
      );
      return;
    }

    selectedIds.value = [...selectedIds.value, id];
  }

  function selectAll() {
    selectedIds.value = filteredItems.value.map((item) => item.id);
  }

  function clearSelection() {
    selectedIds.value = [];
  }

  function toggleSort(nextSortKey: SortKey) {
    if (sortKey.value === nextSortKey) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      return;
    }

    sortKey.value = nextSortKey;
    sortDirection.value = "asc";
  }

  function clearFilters() {
    searchQuery.value = "";
    categoryFilter.value = "all";
    statusFilter.value = "all";
    sortKey.value = "name";
    sortDirection.value = "asc";
    showNotice("info", "Filters cleared.");
  }

  function editSelection() {
    if (selectedCount.value === 0) {
      showNotice("error", "Select at least one item.");
      return;
    }

    showNotice("info", `${selectedCount.value} item(s) selected for edit.`);
  }

  function moveSelection() {
    if (selectedCount.value === 0) {
      showNotice("error", "Select at least one item.");
      return;
    }

    inventory.value = inventory.value.map((item) => {
      if (!selectedIds.value.includes(item.id)) {
        return item;
      }

      if (item.status === "Available") {
        return {
          ...item,
          studentId: "000000001",
          studentName: "Temp Checkout",
          status: "Checked out",
        };
      }

      return {
        ...item,
        studentId: "000000000",
        studentName: "Unassigned",
        status: "Available",
      };
    });

    showNotice("success", `${selectedCount.value} item(s) moved.`);
  }

  function deleteSelection() {
    if (selectedCount.value === 0) {
      showNotice("error", "Select at least one item.");
      return;
    }

    const before = inventory.value.length;
    inventory.value = inventory.value.filter(
      (item) => !selectedIds.value.includes(item.id),
    );
    clearSelection();
    showNotice(
      "success",
      `${before - inventory.value.length} item(s) deleted.`,
    );
  }

  function labelSelection() {
    if (selectedCount.value === 0) {
      showNotice("error", "Select at least one item.");
      return;
    }

    const rows = selectedItems.value.map(
      (item) => `${item.name} | ${item.barcode} | ${item.studentName}`,
    );

    downloadFile(
      rows.join("\n"),
      `inventory-labels-${Date.now()}.txt`,
      "text/plain;charset=utf-8",
    );
    showNotice("success", `Generated ${rows.length} label line(s).`);
  }

  function exportSelection() {
    if (selectedItems.value.length === 0) {
      showNotice("error", "Select at least one item.");
      return;
    }

    const head = [
      "Name",
      "Student ID",
      "Student Name",
      "Category",
      "Status",
      "Barcode",
    ];

    const csv = [
      head.map(escapeCsvValue).join(","),
      ...selectedItems.value.map((item) =>
        [
          item.name,
          item.studentId,
          item.studentName,
          item.category,
          item.status,
          item.barcode,
        ]
          .map(escapeCsvValue)
          .join(","),
      ),
    ].join("\n");

    downloadFile(
      csv,
      `inventory-export-${Date.now()}.csv`,
      "text/csv;charset=utf-8",
    );
    showNotice("success", `Exported ${selectedItems.value.length} item(s).`);
  }

  function showNotice(type: NoticeType, value: string) {
    noticeType.value = type;
    notice.value = value;

    clearNoticeTimer();
    noticeTimer = setTimeout(() => {
      notice.value = "";
    }, 2200);
  }

  function clearNoticeTimer() {
    if (!noticeTimer) {
      return;
    }

    clearTimeout(noticeTimer);
    noticeTimer = undefined;
  }

  function resetInventory() {
    inventory.value = cloneInventory(placeholderInventory);
    clearSelection();
    clearFilters();
    notice.value = "";
    clearNoticeTimer();
  }

  return {
    inventory,
    searchQuery,
    categoryFilter,
    statusFilter,
    sortKey,
    sortDirection,
    notice,
    filteredItems,
    availableCategories,
    availableStatuses,
    availableCount,
    checkedOutCount,
    selectedCount,
    allSelected,
    noticeClass,
    studentsWithDetails,
    isSelected,
    toggleItem,
    selectAll,
    clearSelection,
    toggleSort,
    clearFilters,
    editSelection,
    moveSelection,
    deleteSelection,
    labelSelection,
    exportSelection,
    showNotice,
    clearNoticeTimer,
    resetInventory,
  };
});

function escapeCsvValue(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadFile(content: string, filename: string, mime: string) {
  if (!import.meta.client) {
    return;
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
