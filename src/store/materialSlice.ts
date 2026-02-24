import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  RawMaterial,
  ProductionSuggestion,
} from "../types/inventory";
import {
  fetchMaterials,
  createMaterial,
  fetchProductionSuggestions,
} from "./inventoryThunks";

interface MaterialState {
  materials: RawMaterial[];
  suggestions: ProductionSuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: MaterialState = {
  materials: [],
  suggestions: [],
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    addMaterial: (
      state,
      action: PayloadAction<Omit<RawMaterial, "id">>
    ) => {
      const newMaterial: RawMaterial = {
        id: Date.now(),
        ...action.payload,
      };
      state.materials.push(newMaterial);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- fetchMaterials ---
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
        state.error = action.payload ?? "Erro desconhecido ao buscar materiais.";
      });

    // --- createMaterial ---
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
        state.error = action.payload ?? "Erro desconhecido ao cadastrar material.";
      });

    // --- fetchProductionSuggestions ---
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
          action.payload ?? "Erro desconhecido ao buscar sugestões de produção.";
      });
  },
});

export const { addMaterial, clearError } = materialSlice.actions;
export default materialSlice.reducer;
