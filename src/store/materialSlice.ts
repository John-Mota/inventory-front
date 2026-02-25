import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  RawMaterial,
  Product,
  ProductionSuggestion,
} from "../types/inventory";
import {
  fetchMaterials,
  createMaterial,
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  fetchProductionSuggestions,
} from "./inventoryThunks";

interface InventoryState {
  materials: RawMaterial[];
  products: Product[];
  suggestions: ProductionSuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  materials: [],
  products: [],
  suggestions: [],
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addMaterial: (
      state,
      action: PayloadAction<Omit<RawMaterial, "id">>
    ) => {
      const newMaterial: RawMaterial = {
        id: String(Date.now()),
        ...action.payload,
      };
      state.materials.push(newMaterial);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchMaterials ──────────────────────────────────────
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error while fetching materials.";
      });

    // ── createMaterial ──────────────────────────────────────
    builder
      .addCase(createMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materials.push(action.payload);
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error while creating material.";
      });

    // ── fetchProducts ───────────────────────────────────────
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error while fetching products.";
      });

    // ── createProduct ───────────────────────────────────────
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error while creating product.";
      });

    // ── deleteProduct ───────────────────────────────────────
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error while deleting product.";
      });

    // ── updateProduct ───────────────────────────────────────
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error while updating product.";
      });

    // ── fetchProductionSuggestions ───────────────────────────
    builder
      .addCase(fetchProductionSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchProductionSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Unknown error while fetching production suggestions.";
      });
  },
});

export const { addMaterial, clearError } = materialSlice.actions;
export default materialSlice.reducer;
