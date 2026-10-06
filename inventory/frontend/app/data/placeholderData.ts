import type {
  InventoryItem,
  Student,
  StudentHistoryEntry,
} from "~~/utils/types/types";

export const placeholderInventory: InventoryItem[] = [
  {
    id: 1,
    name: "CAM-01",
    studentId: "123456789",
    studentName: "test, test",
    category: "NX100",
    barcode: "CAM-01",
    status: "Available",
    condition: "GOOD",
  },
  {
    id: 2,
    name: "camera",
    studentId: "123456789",
    studentName: "test, test",
    category: "BAG",
    barcode: "camera",
    status: "Checked out",
    condition: "DAMAGED",
  },
];

export const placeholderStudents: Student[] = [
  {
    osis: "123456789",
    first_name: "test",
    last_name: "test",
    email: "test@test.com",
  },
];

export const placeholderStudentHistory: StudentHistoryEntry[] = [];
