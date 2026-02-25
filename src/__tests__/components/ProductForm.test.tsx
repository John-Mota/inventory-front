import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductFormModal from '../../components/ProductForm';
import { renderWithProviders } from '../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as inventoryThunks from '../store/inventoryThunks';

describe('ProductFormModal', () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.spyOn(inventoryThunks, 'fetchMaterials').mockReturnValue({ type: 'mock' } as any);
  });

  // Verifica se o modal não é renderizado quando isOpen é falso
  it('does not render when isOpen is false', () => {
    renderWithProviders(<ProductFormModal isOpen={false} onClose={onCloseMock} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // Verifica se o modal é renderizado corretamente para a criação de um novo produto
  it('renders correctly for creating a new product', () => {
    renderWithProviders(<ProductFormModal isOpen={true} onClose={onCloseMock} />);
    expect(screen.getByText('Novo Produto')).toBeInTheDocument();
  });

  // Verifica se o modal é renderizado corretamente com os dados ao editar um produto existente
  it('renders correctly for editing an existing product', () => {
    const initialData = {
      id: '1',
      name: 'Old Chair',
      value: 150,
      quantity: 5,
      rawMaterials: [{ rawMaterialId: 'mat1', requiredQuantity: 2 }],
    };

    renderWithProviders(<ProductFormModal isOpen={true} onClose={onCloseMock} initialData={initialData} />);
    
    expect(screen.getByText('Editar Produto')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Old Chair')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150,00')).toBeInTheDocument();
  });

  // Verifica se o botão de envio fica desabilitado quando o formulário é inválido
  it('disables submit button when form is invalid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductFormModal isOpen={true} onClose={onCloseMock} />);
    
    const submitBtn = screen.getByRole('button', { name: /Salvar Produto/i });
    expect(submitBtn).toBeDisabled();
    await user.type(screen.getByLabelText(/Nome do Produto/i), 'Chair');
    expect(submitBtn).toBeDisabled(); 
  });

  // Verifica se a ação createProduct é disparada corretamente ao enviar um novo produto válido
  it('dispatches createProduct on valid submission', async () => {
    const user = userEvent.setup();
    const mockMaterials = [{ id: 'mat1', name: 'Wood', quantity: 10, unit: 'kg', price: 50, stockQuantity: 15 }];
    const createSpy = vi.spyOn(inventoryThunks, 'createProduct');
    createSpy.mockImplementation((() => ({ type: 'mock', unwrap: () => Promise.resolve() })) as any);

    renderWithProviders(<ProductFormModal isOpen={true} onClose={onCloseMock} />, {
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

    await user.type(screen.getByLabelText(/Nome do Produto/i), 'New Table');
    const priceInput = screen.getByLabelText(/Valor \(R\$\)/i);
    await user.clear(priceInput);
    await user.type(priceInput, '10000'); 
    await user.click(screen.getByRole('button', { name: /\+ Adicionar Material/i }));
    const submitBtn = screen.getByRole('button', { name: /Salvar Produto/i });
    expect(submitBtn).not.toBeDisabled();
    await user.click(submitBtn);

    expect(createSpy).toHaveBeenCalledWith({
      name: 'New Table',
      value: 100,
      rawMaterials: [{ rawMaterialId: 'mat1', requiredQuantity: 1 }]
    });

    await waitFor(() => {
      expect(screen.getByText(/Produto salvo com sucesso!/i)).toBeInTheDocument();
    });
  });

  // Verifica se a ação updateProduct é disparada corretamente ao editar um produto
  it('dispatches updateProduct when editing', async () => {
    const user = userEvent.setup();
    const mockMaterials = [{ id: 'mat1', name: 'Wood', quantity: 10, unit: 'kg', price: 50, stockQuantity: 15 }];
    const updateSpy = vi.spyOn(inventoryThunks, 'updateProduct');
    updateSpy.mockImplementation((() => ({ type: 'mock', unwrap: () => Promise.resolve() })) as any);

    const initialData = {
      id: 'prod1',
      name: 'Chair',
      value: 50,
      quantity: 5,
      rawMaterials: [{ rawMaterialId: 'mat1', requiredQuantity: 2 }],
    };

    renderWithProviders(<ProductFormModal isOpen={true} onClose={onCloseMock} initialData={initialData} />, {
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

    const nameInput = screen.getByLabelText(/Nome do Produto/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Chair');

    const submitBtn = screen.getByRole('button', { name: /Atualizar Produto/i });
    expect(submitBtn).not.toBeDisabled();
    await user.click(submitBtn);

    expect(updateSpy).toHaveBeenCalledWith({
      id: 'prod1',
      name: 'Updated Chair',
      value: 50,
      rawMaterials: [{ rawMaterialId: 'mat1', requiredQuantity: 2 }]
    });

    await waitFor(() => {
      expect(screen.getByText(/Produto atualizado com sucesso!/i)).toBeInTheDocument();
    });
  });
});
