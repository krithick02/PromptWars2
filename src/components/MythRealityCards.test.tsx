import { render, screen, fireEvent } from '@testing-library/react';
import MythRealityCards from './MythRealityCards';

describe('MythRealityCards', () => {
  it('renders myths initially', () => {
    render(<MythRealityCards />);
    expect(screen.getByText('Myth vs. Reality')).toBeInTheDocument();
    expect(screen.getByText(/My vote doesn't really matter locally/i)).toBeInTheDocument();
  });

  it('flips a card on click to show reality', () => {
    render(<MythRealityCards />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(screen.getByText(/Local elections are often decided by/i)).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-pressed', 'true');
  });

  it('flips back on second click', () => {
    render(<MythRealityCards />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card); // Flip to reality
    fireEvent.click(card); // Flip back to myth
    
    expect(card).toHaveAttribute('aria-pressed', 'false');
  });
});
