import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchMaterials,
  createMaterial,
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  fetchProductionSuggestions,
} from './inventoryThunks';
import axiosInstance from '../api/axiosInstance';
import { configureStore } from '@reduxjs/toolkit';
import materialReducer from './materialSlice';

vi.mock('../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  },
}));

describe('inventoryThunks', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        inventory: materialReducer,
      },
    });
    vi.clearAllMocks();
  });

  // Verifica se a API de buscar materiais é chamada com sucesso
  it('fetchMaterials API is called successfully', async () => {
    const mockMaterials = [{ id: '1', name: 'Wood', unit: 'kg', quantity: 10, price: 50 }];
    (axiosInstance.get as any).mockResolvedValueOnce({ data: mockMaterials });

    const result = await store.dispatch(fetchMaterials() as any);
    expect(axiosInstance.get).toHaveBeenCalledWith('/raw-materials');
    expect(result.payload).toEqual(mockMaterials);
  });

  // Verifica se a API de buscar materiais lida com falhas corretamente
  it('fetchMaterials API handles failure', async () => {
    (axiosInstance.get as any).mockRejectedValueOnce(new Error('Network Error'));

    const result = await store.dispatch(fetchMaterials() as any);
    expect(result.payload).toBe('Network Error');
  });

  // Verifica se a API de criar material é chamada com sucesso
  it('createMaterial API is called successfully', async () => {
    const payload = { name: 'Wood', stockQuantity: 10 };
    const mockMaterial = { id: '1', name: 'Wood', unit: 'kg', quantity: 10, price: 50 };
    (axiosInstance.post as any).mockResolvedValueOnce({ data: mockMaterial });

    const result = await store.dispatch(createMaterial(payload) as any);
    expect(axiosInstance.post).toHaveBeenCalledWith('/raw-materials', payload);
    expect(result.payload).toEqual(mockMaterial);
  });

  // Verifica se a API de buscar produtos é chamada com sucesso
  it('fetchProducts API is called successfully', async () => {
    const mockProducts = [{ id: '1', name: 'Chair', quantity: 5, price: 100, rawMaterials: [] }];
    (axiosInstance.get as any).mockResolvedValueOnce({ data: mockProducts });

    const result = await store.dispatch(fetchProducts() as any);
    expect(axiosInstance.get).toHaveBeenCalledWith('/products');
    expect(result.payload).toEqual(mockProducts);
  });

  // Verifica se a API de criar produto é chamada com sucesso
  it('createProduct API is called successfully', async () => {
    const payload = {
      name: 'Chair',
      value: 100,
      rawMaterials: [{ rawMaterialId: '1', requiredQuantity: 5 }],
    };
    const createRes = { id: 'prod1', name: 'Chair', value: 100 };
    
    // axios post behavior setup
    (axiosInstance.post as any).mockImplementation((url: string) => {
      if (url === '/products') {
        return Promise.resolve({ data: createRes });
      }
      if (url === '/products/prod1/raw-materials') {
        return Promise.resolve({ data: { rawMaterialId: '1', requiredQuantity: 5 } });
      }
      return Promise.reject(new Error('Not found'));
    });

    const result = await store.dispatch(createProduct(payload) as any);
    expect(axiosInstance.post).toHaveBeenCalledWith('/products', { name: 'Chair', value: 100 });
    expect(axiosInstance.post).toHaveBeenCalledWith('/products/prod1/raw-materials', { rawMaterialId: '1', requiredQuantity: 5 });
    
    expect(result.payload).toEqual({
      ...createRes,
      rawMaterials: [{ rawMaterialId: '1', requiredQuantity: 5 }],
    });
  });

  // Verifica se a API de excluir produto é chamada com sucesso
  it('deleteProduct API is called successfully', async () => {
    (axiosInstance.delete as any).mockResolvedValueOnce({});

    const result = await store.dispatch(deleteProduct('prod1') as any);
    expect(axiosInstance.delete).toHaveBeenCalledWith('/products/prod1');
    expect(result.payload).toBe('prod1');
  });

  // Verifica se a API de atualizar produto é chamada com sucesso
  it('updateProduct API is called successfully', async () => {
    const payload = {
      id: 'prod1',
      name: 'Chair',
      value: 120,
      rawMaterials: [],
    };
    const mockRes = { ...payload };
    (axiosInstance.put as any).mockResolvedValueOnce({ data: mockRes });

    const result = await store.dispatch(updateProduct(payload) as any);
    expect(axiosInstance.put).toHaveBeenCalledWith('/products/prod1', { name: 'Chair', value: 120, rawMaterials: [] });
    expect(result.payload).toEqual(mockRes);
  });

  // Verifica se a API de buscar sugestões de produção é chamada com sucesso
  it('fetchProductionSuggestions API is called successfully', async () => {
    const mockSuggestions = [{ productId: '1', productName: 'Chair', maxProducible: 2 }];
    (axiosInstance.get as any).mockResolvedValueOnce({ data: mockSuggestions });

    const result = await store.dispatch(fetchProductionSuggestions() as any);
    expect(axiosInstance.get).toHaveBeenCalledWith('/production/suggestions');
    expect(result.payload).toEqual(mockSuggestions);
  });

  // === ERROR PATHS ===
  // Verifica se a criação de material lida com mensagens de erro da API
  it('createMaterial handles API failure', async () => {
    (axiosInstance.post as any).mockRejectedValueOnce({ response: { data: { message: 'Failed' } } });
    const result = await store.dispatch(createMaterial({ name: 'x', stockQuantity: 1 }) as any);
    expect(result.payload).toBe('Failed to create raw material.');
  });

  // Verifica se a busca de produtos lida com mensagens de erro da API
  it('fetchProducts handles API failure', async () => {
    (axiosInstance.get as any).mockRejectedValueOnce({ response: { data: { message: 'Error fetching products' } } });
    const result = await store.dispatch(fetchProducts() as any);
    expect(result.payload).toBe('Failed to fetch products.');
  });

  // Verifica se a criação de produto sem matérias-primas funciona corretamente
  it('createProduct API without rawMaterials successfully', async () => {
    const payload = { name: 'Chair', value: 100, rawMaterials: [] };
    const createRes = { id: 'prod1', name: 'Chair', value: 100 };
    
    (axiosInstance.post as any).mockResolvedValueOnce({ data: createRes });

    const result = await store.dispatch(createProduct(payload) as any);
    expect(axiosInstance.post).toHaveBeenCalledWith('/products', { name: 'Chair', value: 100 });
    expect(result.payload).toEqual({
      ...createRes,
      rawMaterials: [], // Returns default empty array if none provided
    });
  });

  // Verifica se a criação de produto lida com erro desconhecido da API
  it('createProduct handles API failure', async () => {
    (axiosInstance.post as any).mockRejectedValueOnce({ error: 'Unknown' });
    const result = await store.dispatch(createProduct({ name: 'x', value: 1, rawMaterials: [] }) as any);
    expect(result.payload).toBe('Failed to create product.');
  });

  // Verifica se a exclusão de produto lida com mensagens de erro da API
  it('deleteProduct handles API failure', async () => {
    (axiosInstance.delete as any).mockRejectedValueOnce({ response: { data: { message: 'Cannot delete' } } });
    const result = await store.dispatch(deleteProduct('prod1') as any);
    expect(result.payload).toBe('Failed to delete product.');
  });

  // Verifica se a atualização de produto lida com erro desconhecido da API
  it('updateProduct handles API failure', async () => {
    (axiosInstance.put as any).mockRejectedValueOnce({ error: 'Failed update' });
    const result = await store.dispatch(updateProduct({ id: '1', name: 'x', value: 1, rawMaterials: [] }) as any);
    expect(result.payload).toBe('Failed to update product.');
  });

  // Verifica se a busca de sugestões de produção lida com respostas nulas da API
  it('fetchProductionSuggestions handles API failure', async () => {
    (axiosInstance.get as any).mockRejectedValueOnce({ response: { data: null } });
    const result = await store.dispatch(fetchProductionSuggestions() as any);
    expect(result.payload).toBe('Failed to fetch production suggestions.');
  });

  // === ERROR PATHS (instanceof Error) ===
  // Verifica se a busca de materiais lida com instâncias de classe Error genéricas
  it('fetchMaterials handles Error instance', async () => {
    (axiosInstance.get as any).mockRejectedValueOnce(new Error('Fetch Mat Error'));
    const result = await store.dispatch(fetchMaterials() as any);
    expect(result.payload).toBe('Fetch Mat Error');
  });

  // Verifica se a criação de material lida com instâncias de classe Error genéricas
  it('createMaterial handles Error instance', async () => {
    (axiosInstance.post as any).mockRejectedValueOnce(new Error('Create Mat Error'));
    const result = await store.dispatch(createMaterial({ name: 'x', stockQuantity: 1 }) as any);
    expect(result.payload).toBe('Create Mat Error');
  });

  // Verifica se a busca de produtos lida com instâncias de classe Error genéricas
  it('fetchProducts handles Error instance', async () => {
    (axiosInstance.get as any).mockRejectedValueOnce(new Error('Fetch Prod Error'));
    const result = await store.dispatch(fetchProducts() as any);
    expect(result.payload).toBe('Fetch Prod Error');
  });

  // Verifica se a criação de produto lida com instâncias de classe Error genéricas
  it('createProduct handles Error instance', async () => {
    (axiosInstance.post as any).mockRejectedValueOnce(new Error('Create Prod Error'));
    const result = await store.dispatch(createProduct({ name: 'x', value: 1, rawMaterials: [] }) as any);
    expect(result.payload).toBe('Create Prod Error');
  });

  // Verifica se a exclusão de produto lida com instâncias de classe Error genéricas
  it('deleteProduct handles Error instance', async () => {
    (axiosInstance.delete as any).mockRejectedValueOnce(new Error('Delete Prod Error'));
    const result = await store.dispatch(deleteProduct('prod1') as any);
    expect(result.payload).toBe('Delete Prod Error');
  });

  // Verifica se a atualização de produto lida com instâncias de classe Error genéricas
  it('updateProduct handles Error instance', async () => {
    (axiosInstance.put as any).mockRejectedValueOnce(new Error('Update Prod Error'));
    const result = await store.dispatch(updateProduct({ id: '1', name: 'x', value: 1, rawMaterials: [] }) as any);
    expect(result.payload).toBe('Update Prod Error');
  });

  // Verifica se a busca de sugestões de produção lida com instâncias de classe Error genéricas
  it('fetchProductionSuggestions handles Error instance', async () => {
    (axiosInstance.get as any).mockRejectedValueOnce(new Error('Fetch Sugg Error'));
    const result = await store.dispatch(fetchProductionSuggestions() as any);
    expect(result.payload).toBe('Fetch Sugg Error');
  });
});
