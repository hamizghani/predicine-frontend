import { TransactionHistory } from "./TransactionHistory";

export interface Medicine {
  id: number;
  name: string;
  description: string;
  brief: string;
  imageUrl: string;
  transactionHistory: TransactionHistory[]
}