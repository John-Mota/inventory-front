import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { describe, it, expect } from 'vitest';

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  // Verifica se o logotipo e os links de navegação são renderizados corretamente
  it('renders logo and navigation links', () => {
    renderHeader();

    expect(screen.getByText('Autoflex')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Autoflex Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Painel' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Matérias-Primas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Produtos' })).toBeInTheDocument();
  });

  // Verifica se o menu mobile abre e fecha corretamente ao clicar no botão de menu
  it('toggles mobile menu when menu button is clicked', async () => {
    const user = userEvent.setup();
    renderHeader();

    const menuButton = screen.getByRole('button', { name: /Toggle navigation menu/i });
    
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();

    const allPanelLinks = screen.getAllByRole('link', { name: 'Painel' });
    expect(allPanelLinks.length).toBe(2);

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
});
