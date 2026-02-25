import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MaterialsPage from '../../components/MaterialsPage';
import { renderWithProviders } from '../../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as inventoryThunks from '../../store/inventoryThunks';

describe('MaterialsPage', () => {
  beforeEach(() => {
    vi.spyOn(inventoryThunks, 'fetchMaterials').mockReturnValue({ type: 'mock' } as any);
  });
  // Verifica se o título e o estado de carregamento inicial são renderizados
  it('renders title and loading state initially', () => {
    renderWithProviders(<MaterialsPage />, {
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

    expect(screen.getByText('Matérias-Primas')).toBeInTheDocument();
    expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  // Verifica se a mensagem de lista vazia é exibida e permite abrir o modal pelo botão principal (CTA)
  it('renders empty message and allows opening modal via CTA', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MaterialsPage />, {
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

    expect(screen.getByText('Nenhuma matéria-prima cadastrada ainda.')).toBeInTheDocument();
    
    // Click "Cadastrar primeiro material"
    await user.click(screen.getByRole('button', { name: /Cadastrar primeiro material/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // Verifica se a lista de materiais é renderizada e permite abrir o modal pelo botão no cabeçalho
  it('renders materials list and allows opening modal via header button', async () => {
    const user = userEvent.setup();
    const mockMaterials = [
      { id: '1', name: 'Wood', quantity: 10, unit: 'kg', price: 50, stockQuantity: 15 },
    ];

    renderWithProviders(<MaterialsPage />, {
      preloadedState: {
        material: {
          materials: mockMaterials as any,
          products: [],
          suggestions: [],
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('Wood')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Adicionar Material/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // Verifica se a ação fetchMaterials é disparada ao iniciar a página
  it('dispatches fetchMaterials on mount', () => {
    const fetchSpy = vi.spyOn(inventoryThunks, 'fetchMaterials');
    renderWithProviders(<MaterialsPage />);
    expect(fetchSpy).toHaveBeenCalled();
  });
});
