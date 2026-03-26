export type InventoryStatus = "Available" | "Checked out";

export type InventoryItem = {
  id: number;
  name: string;
  studentId: string;
  studentName: string;
  category: string;
  barcode: string;
  status: InventoryStatus;
};

export type Student = {
  osis: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type StudentHistoryAction = "Checked out" | "Returned";

export type StudentHistoryEntry = {
  id: number;
  studentId: string;
  itemName: string;
  barcode: string;
  action: StudentHistoryAction;
  date: string;
};
