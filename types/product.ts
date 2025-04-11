import { Medicine } from "./Medicine";

export interface Product {
  id: number;
  name: string;
  description: string;
  sold: number;
  prediction: {
    restockDate: string;
    availability: {
      percentage: number;
      status: string;
    };
  };
}
