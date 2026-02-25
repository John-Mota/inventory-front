import { render } from '@testing-library/react';
import Spinner from '../../components/Spinner';
import { describe, it, expect } from 'vitest';

describe('Spinner', () => {
  // Verifica se o tamanho padrão (md) é renderizado corretamente
  it('renders default md size correctly', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-6');
    expect(svg).toHaveClass('w-6');
  });

  it('renders sm size correctly', () => {
    const { container } = render(<Spinner size="sm" />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveClass('h-4');
    expect(svg).toHaveClass('w-4');
  });

  // Verifica se o tamanho grande (lg) é renderizado corretamente
  it('renders lg size correctly', () => {
    const { container } = render(<Spinner size="lg" />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveClass('h-10');
    expect(svg).toHaveClass('w-10');
  });
});
