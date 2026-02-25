import { describe, it, expect } from "vitest";
import materialReducer, { addMaterial, clearError } from "../../store/materialSlice";
import {
  fetchMaterials,
  createMaterial,
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  fetchProductionSuggestions,
} from "../../store/inventoryThunks";
import type { RawMaterial, Product, ProductionSuggestion } from "../../types/inventory";

describe("materialSlice", () => {
  const initialState = {
    materials: [],
    products: [],
    suggestions: [],
    loading: false,
    error: null,
  };

  // Verifica se o estado inicial é retornado corretamente
  it("should return the initial state", () => {
    expect(materialReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  // Verifica se a ação addMaterial adiciona um material ao estado
  it("should handle addMaterial", () => {
    const newMaterial = { name: "Wood", stockQuantity: 10 };
    const actual = materialReducer(initialState, addMaterial(newMaterial));
    expect(actual.materials.length).toBe(1);
    expect(actual.materials[0].name).toBe("Wood");
    expect(actual.materials[0].id).toBeDefined();
  });

  // Verifica se a ação clearError limpa o erro do estado
  it("should handle clearError", () => {
    const stateWithError = { ...initialState, error: "Some error" };
    const actual = materialReducer(stateWithError, clearError());
    expect(actual.error).toBeNull();
  });

  describe("extraReducers", () => {
    // === fetchMaterials ===
    // Verifica a ação pendente de buscar materiais
    it("should handle fetchMaterials.pending", () => {
      const actual = materialReducer(initialState, fetchMaterials.pending("reqId"));
      expect(actual.loading).toBe(true);
      expect(actual.error).toBeNull();
    });

    // Verifica a ação concluída de buscar materiais
    it("should handle fetchMaterials.fulfilled", () => {
      const materials: RawMaterial[] = [{ id: "1", name: "Wood", stockQuantity: 10 }];
      const actual = materialReducer(initialState, fetchMaterials.fulfilled(materials, "reqId"));
      expect(actual.loading).toBe(false);
      expect(actual.materials).toEqual(materials);
    });

    // Verifica a ação rejeitada de buscar materiais
    it("should handle fetchMaterials.rejected", () => {
      const errorMsg = "Failed to fetch";
      const actual = materialReducer(initialState, fetchMaterials.rejected(null, "reqId", undefined, errorMsg));
      expect(actual.loading).toBe(false);
      expect(actual.error).toBe(errorMsg);
    });

    // === createMaterial ===
    // Verifica a ação pendente de criar material
    it("should handle createMaterial.pending", () => {
      const actual = materialReducer(initialState, createMaterial.pending("reqId", {} as any));
      expect(actual.loading).toBe(true);
      expect(actual.error).toBeNull();
    });

    // Verifica a ação concluída de criar material
    it("should handle createMaterial.fulfilled", () => {
      const material: RawMaterial = { id: "1", name: "Wood", stockQuantity: 10 };
      const actual = materialReducer(initialState, createMaterial.fulfilled(material, "reqId", material));
      expect(actual.loading).toBe(false);
      expect(actual.materials).toEqual([material]);
    });

    // Verifica a ação rejeitada de criar material
    it("should handle createMaterial.rejected", () => {
      const errorMsg = "Failed to create";
      // To simulate rejected action payload (the 4th arg is conventionally the error if serializedError is not used, 
      // but Redux Toolkit pass `action.payload` when using `rejectWithValue`)
      const actual = materialReducer(initialState, {
        type: createMaterial.rejected.type,
        payload: errorMsg
      });
      expect(actual.loading).toBe(false);
      expect(actual.error).toBe(errorMsg);
    });

    // === fetchProducts ===
    // Verifica a ação pendente de buscar produtos
    it("should handle fetchProducts.pending", () => {
      const actual = materialReducer(initialState, fetchProducts.pending("reqId"));
      expect(actual.loading).toBe(true);
      expect(actual.error).toBeNull();
    });

    // Verifica a ação concluída de buscar produtos
    it("should handle fetchProducts.fulfilled", () => {
      const products: Product[] = [{ id: "1", name: "Chair", value: 100, rawMaterials: [] }];
      const actual = materialReducer(initialState, fetchProducts.fulfilled(products, "reqId"));
      expect(actual.loading).toBe(false);
      expect(actual.products).toEqual(products);
    });

    // Verifica a ação rejeitada de buscar produtos
    it("should handle fetchProducts.rejected", () => {
      const errorMsg = "Failed to fetch products";
      const actual = materialReducer(initialState, {
        type: fetchProducts.rejected.type,
        payload: errorMsg
      });
      expect(actual.loading).toBe(false);
      expect(actual.error).toBe(errorMsg);
    });

    // === createProduct ===
    // Verifica a ação pendente de criar um produto
    it("should handle createProduct.pending", () => {
      const actual = materialReducer(initialState, createProduct.pending("reqId", {} as any));
      expect(actual.loading).toBe(true);
    });

    // Verifica a ação concluída de criar um produto
    it("should handle createProduct.fulfilled", () => {
      const product: Product = { id: "1", name: "Chair", value: 100, rawMaterials: [] };
      const actual = materialReducer(initialState, createProduct.fulfilled(product, "reqId", {} as any));
      expect(actual.loading).toBe(false);
      expect(actual.products).toEqual([product]);
    });

    // Verifica a ação rejeitada de criar um produto
    it("should handle createProduct.rejected", () => {
      const errorMsg = "Error creating product";
      const actual = materialReducer(initialState, { type: createProduct.rejected.type, payload: errorMsg });
      expect(actual.error).toBe(errorMsg);
    });

    // === updateProduct ===
    // Verifica a ação concluída de atualizar um produto
    it("should handle updateProduct.fulfilled", () => {
      const stateWithProduct = {
        ...initialState,
        products: [{ id: "1", name: "Chair", value: 100, rawMaterials: [] }]
      };
      const updatedProduct: Product = { id: "1", name: "Better Chair", value: 150, rawMaterials: [] };
      const actual = materialReducer(stateWithProduct, updateProduct.fulfilled(updatedProduct, "reqId", updatedProduct));
      
      expect(actual.loading).toBe(false);
      expect(actual.products[0]).toEqual(updatedProduct);
    });

    // Verifica a ação rejeitada de atualizar um produto
    it("should handle updateProduct.rejected", () => {
      const errorMsg = "Error updating product";
      const actual = materialReducer(initialState, { type: updateProduct.rejected.type, payload: errorMsg });
      expect(actual.error).toBe(errorMsg);
    });

    // === deleteProduct ===
    // Verifica a ação concluída de excluir um produto
    it("should handle deleteProduct.fulfilled", () => {
      const stateWithProduct = {
        ...initialState,
        products: [{ id: "1", name: "Chair", value: 100, rawMaterials: [] }]
      };
      const actual = materialReducer(stateWithProduct, deleteProduct.fulfilled("1", "reqId", "1"));
      
      expect(actual.loading).toBe(false);
      expect(actual.products.length).toBe(0);
    });

    // Verifica a ação rejeitada de excluir um produto
    it("should handle deleteProduct.rejected", () => {
      const errorMsg = "Error deleting product";
      const actual = materialReducer(initialState, { type: deleteProduct.rejected.type, payload: errorMsg });
      expect(actual.error).toBe(errorMsg);
    });

    // === fetchProductionSuggestions ===
    // Verifica a ação pendente de buscar sugestões de produção
    it("should handle fetchProductionSuggestions.pending", () => {
      const actual = materialReducer(initialState, fetchProductionSuggestions.pending("reqId"));
      expect(actual.loading).toBe(true);
    });

    // Verifica a ação concluída de buscar sugestões de produção
    it("should handle fetchProductionSuggestions.fulfilled", () => {
      const suggestions: ProductionSuggestion[] = [{ productName: "Chair", quantityToProduce: 2, totalValue: 200 }];
      const actual = materialReducer(initialState, fetchProductionSuggestions.fulfilled(suggestions, "reqId"));
      
      expect(actual.loading).toBe(false);
      expect(actual.suggestions).toEqual(suggestions);
    });

    // Verifica a ação rejeitada de buscar sugestões de produção
    it("should handle fetchProductionSuggestions.rejected", () => {
      const errorMsg = "Error suggestions";
      const actual = materialReducer(initialState, { type: fetchProductionSuggestions.rejected.type, payload: errorMsg });
      expect(actual.error).toBe(errorMsg);
    });
    // === MISSING BRANCHES FOR COVERAGE ===
    // Verifica o comportamento quando não há payload nas ações rejeitadas
    it("should handle missing payload for rejected actions", () => {
      const types = [
        fetchMaterials.rejected.type,
        createMaterial.rejected.type,
        fetchProducts.rejected.type,
        createProduct.rejected.type,
        updateProduct.rejected.type,
        deleteProduct.rejected.type,
        fetchProductionSuggestions.rejected.type
      ];

      types.forEach(type => {
        const actual = materialReducer(initialState, { type, payload: undefined });
        expect(actual.error).toContain("Unknown error");
      });
    });

    // Verifica se o estado não é alterado quando o produto a ser atualizado não é encontrado
    it("should handle updateProduct.fulfilled when product not found", () => {
      const stateWithProduct = {
        ...initialState,
        products: [{ id: "1", name: "Chair", value: 100, rawMaterials: [] }] as any
      };
      const updatedProduct: Product = { id: "999", name: "Ghost Chair", value: 150, rawMaterials: [] };
      const actual = materialReducer(stateWithProduct, updateProduct.fulfilled(updatedProduct, "reqId", updatedProduct));
      
      // Should remain unchanged
      expect(actual.products[0].id).toBe("1");
    });
  });
});
