export interface RawMaterial {
  id: string;
  name: string;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  value: number;
  rawMaterials: {
    id?: string;
    rawMaterialId: string;
    rawMaterialName?: string;
    requiredQuantity: number;
  }[];
}

export interface ProductionSuggestion {
  productName: string;
  quantityToProduce: number;
  totalValue: number;
}
