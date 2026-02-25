import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MaterialFormModal from '../../components/MaterialForm';
import { renderWithProviders } from '../../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as inventoryThunks from '../../store/inventoryThunks';

describe('MaterialFormModal', () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.spyOn(inventoryThunks, 'createMaterial').mockReturnValue({ type: 'mock' } as any);
  });

  // Verifica se o modal não é renderizado quando isOpen é falso
  it('does not render when isOpen is false', () => {
    renderWithProviders(<MaterialFormModal isOpen={false} onClose={onCloseMock} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // Verifica se o modal é renderizado corretamente quando isOpen é verdadeiro
  it('renders correctly when isOpen is true', () => {
    renderWithProviders(<MaterialFormModal isOpen={true} onClose={onCloseMock} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Nova Matéria-Prima')).toBeInTheDocument();
  });

  // Verifica se a função onClose é chamada ao clicar no botão de cancelar
  it('calls onClose when clicking cancel button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MaterialFormModal isOpen={true} onClose={onCloseMock} />);
    
    await user.click(screen.getByText('Cancelar'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  // Verifica se o botão de envio fica desabilitado quando o formulário é inválido
  it('disables submit button if form is invalid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MaterialFormModal isOpen={true} onClose={onCloseMock} />);
    
    const submitBtn = screen.getByRole('button', { name: /Salvar/i });
    expect(submitBtn).toBeDisabled();
    
    await user.type(screen.getByLabelText(/Nome/i), 'Wood');
    expect(submitBtn).toBeDisabled();

    await user.type(screen.getByLabelText(/Quantidade/i), '10');
    expect(submitBtn).not.toBeDisabled();
  });

  // Verifica se a ação createMaterial é disparada e exibe mensagem de sucesso ao enviar um formulário válido
  it('dispatches createMaterial and shows success on valid submit', async () => {
    const user = userEvent.setup();
    const createSpy = vi.spyOn(inventoryThunks, 'createMaterial');

    renderWithProviders(<MaterialFormModal isOpen={true} onClose={onCloseMock} />);

    createSpy.mockImplementation((() => ({
      type: 'mock',
      unwrap: () => Promise.resolve({ id: '1', name: 'Wood', quantity: 10 })
    })) as any);

    await user.type(screen.getByLabelText(/Nome/i), 'Wood');
    await user.type(screen.getByLabelText(/Quantidade/i), '10');
    
    await user.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(createSpy).toHaveBeenCalledWith({ name: 'Wood', stockQuantity: 10 });
    
    await waitFor(() => {
      expect(screen.getByText(/Material salvo com sucesso!/i)).toBeInTheDocument();
    });
  });

  // Verifica se a mensagem de erro vinda do estado (store) é exibida corretamente
  it('displays error message from store', () => {
    renderWithProviders(<MaterialFormModal isOpen={true} onClose={onCloseMock} />, {
      preloadedState: {
        material: {
          materials: [],
          products: [],
          suggestions: [],
          loading: false,
          error: 'Something went wrong',
        },
      },
    });

    expect(screen.getByText('❌ Something went wrong')).toBeInTheDocument();
  });
});
