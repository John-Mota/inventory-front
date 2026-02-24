export interface RawMaterial {
  id: number;
  name: string;
  stockQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  materials: {
    materialId: number;
    neededQuantity: number;
  }[];
}

export interface ProductionSuggestion {
  productName: string;
  quantityToProduce: number;
  totalValue: number;
}
