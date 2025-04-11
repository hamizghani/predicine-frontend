import { Medicine } from "./Medicine";

export interface TransactionHistory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  medicineId: number;
  amount: number;
  userId: number;
  price: number;
  medicine: Medicine;
}