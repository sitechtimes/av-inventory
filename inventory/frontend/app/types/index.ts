export type InventoryStatus = "Available" | "Checked out";
export type ItemCondition = "GOOD" | "DAMAGED" | "LOST" | "";
export type InventoryId = string | number;

export type InventoryItem = {
  id: InventoryId;
  name: string;
  studentId: string;
  studentName: string;
  category: string;
  barcode: string;
  status: InventoryStatus;
  condition: ItemCondition;
};

export type EquipmentRecord = {
  name: string;
  barcode: string;
  equipment_type: string;
  owner: string;
  current_condition: ItemCondition;
  status: InventoryStatus;
};

export type Student = {
  osis: string;
  first_name: string;
  last_name: string;
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
