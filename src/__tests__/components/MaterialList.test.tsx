import { screen } from '@testing-library/react';
import MaterialList from '../../components/MaterialList';
import { renderWithProviders } from '../../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as inventoryThunks from '../../store/inventoryThunks';

describe('MaterialList', () => {
  beforeEach(() => {
    vi.spyOn(inventoryThunks, 'fetchMaterials').mockReturnValue({ type: 'mock' } as any);
  });
  // Verifica se o indicador de carregamento (spinner) é exibido quando está carregando e não há materiais
  it('renders loading spinner when loading and no materials', () => {
    renderWithProviders(<MaterialList />, {
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

    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  // Verifica se a mensagem de lista vazia é exibida quando não há materiais registrados
  it('renders empty message when no materials', () => {
    renderWithProviders(<MaterialList />, {
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

    expect(screen.getByText('No raw materials registered yet.')).toBeInTheDocument();
  });

  // Verifica se a lista de materiais é renderizada corretamente com seus respectivos dados na tabela
  it('renders a list of materials correctly', () => {
    const mockMaterials = [
      { id: 'mat-1', name: 'Wood', quantity: 10, unit: 'kg', price: 50, stockQuantity: 15 },
      { id: 'mat-2', name: 'Iron', quantity: 5, unit: 'kg', price: 100, stockQuantity: 2 },
    ];

    renderWithProviders(<MaterialList />, {
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
    expect(screen.getByText('15')).toBeInTheDocument();
    
    expect(screen.getByText('Iron')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); 
  });

  // Verifica se a ação fetchMaterials é disparada ao montar o componente
  it('dispatches fetchMaterials on mount', () => {
    const fetchSpy = vi.spyOn(inventoryThunks, 'fetchMaterials');
    
    renderWithProviders(<MaterialList />);

    expect(fetchSpy).toHaveBeenCalled();
  });
});
