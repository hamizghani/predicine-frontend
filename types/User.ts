import { TransactionHistory } from "./TransactionHistory";
import { UserStock } from "./UserStock";

export interface User {
  id: number;
  username: string;
  name: string;
  region: string;
  sales: number;
  quantitySold: number;
  price: number[];
  transactionHistory: TransactionHistory[];
  userStock: UserStock[];
}


