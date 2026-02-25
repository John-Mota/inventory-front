import { screen } from '@testing-library/react';
import Dashboard from '../../components/Dashboard';
import { renderWithProviders } from '../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as inventoryThunks from '../store/inventoryThunks';

describe('Dashboard', () => {
  beforeEach(() => {
    vi.spyOn(inventoryThunks, 'fetchMaterials').mockReturnValue({ type: 'mock' } as any);
    vi.spyOn(inventoryThunks, 'fetchProductionSuggestions').mockReturnValue({ type: 'mock' } as any);
  });
  // Verifica se as ações de busca (fetch) são disparadas ao montar o componente
  it('dispatches fetch actions on mount', () => {
    const fetchSuggSpy = vi.spyOn(inventoryThunks, 'fetchProductionSuggestions');
    const fetchMatSpy = vi.spyOn(inventoryThunks, 'fetchMaterials');
    
    renderWithProviders(<Dashboard />);
    
    expect(fetchSuggSpy).toHaveBeenCalled();
    expect(fetchMatSpy).toHaveBeenCalled();
  });

  // Verifica se os esqueletos de carregamento (skeletons) são exibidos enquanto os dados estão sendo carregados
  it('renders loading skeletons when loading', () => {
    renderWithProviders(<Dashboard />, {
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

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  // Verifica se os dados são renderizados corretamente e exibe status de estoque OK quando há materiais suficientes
  it('renders data correctly with good stock', () => {
    const mockSuggestions = [
      { productId: '1', productName: 'Chair', maxProducible: 5, totalValue: 500, quantityToProduce: 5 }
    ];
    const mockMaterials = [
      { id: '1', name: 'Wood', quantity: 10, unit: 'kg', price: 50, stockQuantity: 20 }
    ];

    renderWithProviders(<Dashboard />, {
      preloadedState: {
        material: {
          materials: mockMaterials as any,
          products: [],
          suggestions: mockSuggestions as any,
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getAllByText(/R\$\s?500,00/i).length).toBeGreaterThan(0);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    
    expect(screen.getByText('✅ Estoque OK')).toBeInTheDocument();

    expect(screen.getAllByText('Chair').length).toBeGreaterThan(0);
  });

  // Verifica se o aviso de estoque baixo é exibido corretamente quando a quantidade é inferior a 10 unidades
  it('renders low stock warning correctly', () => {
    const mockMaterials = [
      { id: '1', name: 'Wood', quantity: 10, unit: 'kg', price: 50, stockQuantity: 2 } // < 10
    ];

    renderWithProviders(<Dashboard />, {
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

    expect(screen.getByText('⚠️ Estoque Baixo')).toBeInTheDocument();
    expect(screen.getByText(/1 material com menos de 10 unidades/i)).toBeInTheDocument();
  });
});
