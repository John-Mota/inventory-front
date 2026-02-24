export interface RawMaterial {
  id: string;
  name: string;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  value: number;
  materials: {
    materialId: string;
    neededQuantity: number;
  }[];
}

export interface ProductionSuggestion {
  productName: string;
  quantityToProduce: number;
  totalValue: number;
}
