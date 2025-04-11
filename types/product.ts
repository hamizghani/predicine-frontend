import { Medicine } from "./Medicine";

export interface Product extends Medicine {
  sold: number;
  prediction: {
    restockDate: string;
    availability: {
      percentage: number;
      status: string;
    };
  };
}
