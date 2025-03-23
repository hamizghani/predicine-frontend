
export interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  stock: number;
  sold: number;
  category: string;
  prediction: {
    restockDate: string;
    availability: {
      percentage: number;
      status: string;
    };
  };
}
