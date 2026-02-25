import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsPage from '../../components/ProductsPage';
import { renderWithProviders } from '../../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as inventoryThunks from '../../store/inventoryThunks';

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.spyOn(inventoryThunks, 'fetchMaterials').mockReturnValue({ type: 'mock' } as any);
    vi.spyOn(inventoryThunks, 'fetchProducts').mockReturnValue({ type: 'mock' } as any);
    vi.spyOn(inventoryThunks, 'deleteProduct').mockReturnValue({ type: 'mock', unwrap: () => Promise.resolve() } as any);
  });
  // Verifica se o estado de carregamento inicial é renderizado
  it('renders loading state initially', () => {
    renderWithProviders(<ProductsPage />, {
      preloadedState: {
        material: {
          materials: [],
          products: [],
          suggestions: [],
          loading: true,
          error: null,
        },
      },
    });

    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  // Verifica se a mensagem de lista vazia é exibida e permite abrir o modal pelo botão principal (CTA)
  it('renders empty message and allows opening modal via CTA', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />, {
      preloadedState: {
        material: {
          materials: [],
          products: [],
          suggestions: [],
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('Nenhum produto cadastrado ainda.')).toBeInTheDocument();
    
    await user.click(screen.getByRole('button', { name: /Cadastrar primeiro produto/i }));
    expect(screen.getByRole('dialog', { name: /Cadastrar produto/i })).toBeInTheDocument();
  });

  // Verifica se a lista de produtos é renderizada corretamente
  it('renders list of products', () => {
    const mockProducts = [
      { id: '1', name: 'Chair', value: 100, quantity: 5, rawMaterials: [] }
    ];

    renderWithProviders(<ProductsPage />, {
      preloadedState: {
        material: {
          materials: [],
          products: mockProducts as any,
          suggestions: [],
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('Chair')).toBeInTheDocument();
    expect(screen.getByText('R$ 100.00')).toBeInTheDocument();
  });

  // Verifica se o modal de detalhes do produto abre e fecha corretamente
  it('opens and closes view product modal', async () => {
    const user = userEvent.setup();
    const mockProducts = [
      { id: '1', name: 'Chair', value: 100, quantity: 5, rawMaterials: [{ rawMaterialId: 'mat1', requiredQuantity: 2 }] }
    ];
    const mockMaterials = [{ id: 'mat1', name: 'Wood', quantity: 10, unit: 'kg', price: 50, stockQuantity: 15 }];

    renderWithProviders(<ProductsPage />, {
      preloadedState: {
        material: {
          materials: mockMaterials as any,
          products: mockProducts as any,
          suggestions: [],
          loading: false,
          error: null,
        },
      },
    });

    await user.click(screen.getByRole('button', { name: /Ver/i }));

    const viewModal = screen.getByRole('dialog');
    expect(viewModal).toBeInTheDocument();
    
    const dialogScope = within(viewModal);
    expect(dialogScope.getByText('Detalhes do Produto')).toBeInTheDocument();
    expect(dialogScope.getByText('Wood')).toBeInTheDocument();
    expect(dialogScope.getByText('×2')).toBeInTheDocument();

    await user.click(dialogScope.getByRole('button', { name: /Fechar/i }));
    expect(screen.queryByText('Detalhes do Produto')).not.toBeInTheDocument();
  });

  // Verifica se o modal de edição de produto é aberto corretamente
  it('opens edit product modal', async () => {
    const user = userEvent.setup();
    const mockProducts = [
      { id: '1', name: 'Chair', value: 100, quantity: 5, rawMaterials: [] }
    ];

    renderWithProviders(<ProductsPage />, {
      preloadedState: {
        material: {
          materials: [],
          products: mockProducts as any,
          suggestions: [],
          loading: false,
          error: null,
        },
      },
    });

    await user.click(screen.getByRole('button', { name: /Editar/i }));

    expect(screen.getByRole('dialog', { name: /Editar produto/i })).toBeInTheDocument();
  });

  // Verifica se o aviso de exclusão abre e se a ação de deletar é disparada ao confirmar
  it('opens delete confirmation and dispatches deleteThunk on confirm', async () => {
    const user = userEvent.setup();
    const mockProducts = [
      { id: 'prod1', name: 'Chair', value: 100, quantity: 5, rawMaterials: [] }
    ];
    
    const deleteSpy = vi.spyOn(inventoryThunks, 'deleteProduct');
    deleteSpy.mockImplementation((() => ({ type: 'mock', unwrap: () => Promise.resolve() })) as any);

    renderWithProviders(<ProductsPage />, {
      preloadedState: {
        material: {
          materials: [],
          products: mockProducts as any,
          suggestions: [],
          loading: false,
          error: null,
        },
      },
    });

    await user.click(screen.getByRole('button', { name: /Excluir/i }));

    const deleteModal = screen.getByRole('dialog');
    expect(deleteModal).toBeInTheDocument();
    expect(within(deleteModal).getByText(/Tem certeza que deseja excluir/i)).toBeInTheDocument();

    await user.click(within(deleteModal).getByRole('button', { name: /^Excluir$/i }));

    expect(deleteSpy).toHaveBeenCalledWith('prod1');
    
    await waitFor(() => {
      expect(screen.queryByText(/Tem certeza que deseja excluir/i)).not.toBeInTheDocument();
    });
  });

  // Verifica se a ação fetchProducts é disparada ao iniciar a página
  it('dispatches fetchProducts on mount', () => {
    const fetchProdsSpy = vi.spyOn(inventoryThunks, 'fetchProducts');
    renderWithProviders(<ProductsPage />);
    expect(fetchProdsSpy).toHaveBeenCalled();
  });
});
