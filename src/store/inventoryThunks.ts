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
 * Creates a new product, then adds each raw material via the separate endpoint.
 * 1) POST /products                        → cria o produto
 * 2) POST /products/:id/raw-materials      → adiciona cada material
 * 3) GET  /products/:id                    → retorna produto completo
 */
export const createProduct = createAsyncThunk<
  Product,
  { name: string; value: number; rawMaterials: { rawMaterialId: string; requiredQuantity: number }[] },
  { rejectValue: string }
>("inventory/createProduct", async (payload, { rejectWithValue }) => {
  try {
    // 1) Criar o produto (só name + value)
    const { rawMaterials, ...productData } = payload;
    const createRes = await axiosInstance.post<Product>("/products", productData);
    const productId = createRes.data.id;

    // 2) Adicionar cada material via rota separada e coletar respostas
    const materialsResponses = [];
    for (const mat of rawMaterials) {
      const matRes = await axiosInstance.post(`/products/${productId}/raw-materials`, mat);
      materialsResponses.push(matRes.data);
    }

    // 3) Montar o produto completo com os materiais
    return {
      ...createRes.data,
      rawMaterials: materialsResponses,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create product.";
    return rejectWithValue(message);
  }
});

/**
 * Deletes a product by ID.
 * DELETE /products/:id
 */
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("inventory/deleteProduct", async (productId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/products/${productId}`);
    return productId;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete product.";
    return rejectWithValue(message);
  }
});

/**
 * Updates an existing product, re-syncs raw materials.
 * 1) PUT    /products/:id                        → atualiza name + value
 * 2) DELETE /products/raw-materials/:assocId      → remove materiais antigos
 * 3) POST   /products/:id/raw-materials           → adiciona novos materiais
 * 4) GET    /products/:id                         → retorna produto completo
 */
export const updateProduct = createAsyncThunk<
  Product,
  {
    id: string;
    name: string;
    value: number;
    rawMaterials: { rawMaterialId: string; requiredQuantity: number }[];
  },
  { rejectValue: string }
>("inventory/updateProduct", async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    // PUT envia name + value + rawMaterials tudo junto
    const response = await axiosInstance.put<Product>(`/products/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update product.";
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
