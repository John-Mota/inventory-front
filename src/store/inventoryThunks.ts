import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import type {
  RawMaterial,
  Product,
  ProductionSuggestion,
} from "../types/inventory";

// ── Raw Materials ──────────────────────────────────────────────

/**
 * Fetches the list of raw materials from the API.
 * GET /raw-materials
 */
export const fetchMaterials = createAsyncThunk<
  RawMaterial[],
  void,
  { rejectValue: string }
>("inventory/fetchMaterials", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<RawMaterial[]>("/raw-materials");
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch raw materials.";
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
>("inventory/createMaterial", async (payload, { rejectWithValue }) => {
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
        : "Failed to create raw material.";
    return rejectWithValue(message);
  }
});

// ── Products ───────────────────────────────────────────────────

/**
 * Fetches the list of products from the API.
 * GET /products
 */
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("inventory/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Product[]>("/products");
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch products.";
    return rejectWithValue(message);
  }
});

/**
 * Creates a new product with associated materials (RF007).
 * POST /products
 */
export const createProduct = createAsyncThunk<
  Product,
  { name: string; price: number; materials: { materialId: number; neededQuantity: number }[] },
  { rejectValue: string }
>("inventory/createProduct", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<Product>("/products", payload);
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create product.";
    return rejectWithValue(message);
  }
});

// ── Production Suggestions ─────────────────────────────────────

/**
 * Fetches production suggestions based on current stock (RF008).
 * GET /production-suggestions
 */
export const fetchProductionSuggestions = createAsyncThunk<
  ProductionSuggestion[],
  void,
  { rejectValue: string }
>(
  "inventory/fetchProductionSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ProductionSuggestion[]>(
        "/production/suggestions"
      );
      return response.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch production suggestions.";
      return rejectWithValue(message);
    }
  }
);
