import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import type {
  RawMaterial,
  ProductionSuggestion,
} from "../types/inventory";

/**
 * Fetches the list of raw materials from the API.
 * GET /raw-materials
 */
export const fetchMaterials = createAsyncThunk<
  RawMaterial[],
  void,
  { rejectValue: string }
>("material/fetchMaterials", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<RawMaterial[]>("/raw-materials");
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao buscar matérias-primas.";
    return rejectWithValue(message);
  }
});

/**
 * Creates a new raw material.
 * POST /raw-materials
 */
export const createMaterial = createAsyncThunk<
  RawMaterial,
  { name: string; stockQuantity: number },
  { rejectValue: string }
>("material/createMaterial", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<RawMaterial>(
      "/raw-materials",
      payload
    );
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao cadastrar matéria-prima.";
    return rejectWithValue(message);
  }
});

/**
 * Fetches production suggestions based on current stock.
 * GET /production-suggestions
 */
export const fetchProductionSuggestions = createAsyncThunk<
  ProductionSuggestion[],
  void,
  { rejectValue: string }
>(
  "material/fetchProductionSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ProductionSuggestion[]>(
        "/production-suggestions"
      );
      return response.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao buscar sugestões de produção.";
      return rejectWithValue(message);
    }
  }
);
