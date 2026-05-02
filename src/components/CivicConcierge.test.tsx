import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CivicConcierge from './CivicConcierge';
import * as geminiLib from '../lib/gemini';
import { vi } from 'vitest';

vi.mock('../lib/gemini', () => ({
  askCivicConcierge: vi.fn(),
}));

describe('CivicConcierge', () => {
  it('renders the empty state initially', () => {
    render(<CivicConcierge />);
    expect(screen.getByText(/Ask me anything about the voting process/i)).toBeInTheDocument();
  });

  it('sends a message and displays the bot response', async () => {
    const mockResponse = "You can register to vote online or by mail.";
    (geminiLib.askCivicConcierge as any).mockResolvedValue(mockResponse);

    render(<CivicConcierge />);
    
    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'How do I register?' } });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('How do I register?')).toBeInTheDocument();
    expect(screen.getByText('Thinking...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockResponse)).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
  });

  it('disables the send button when input is empty', () => {
    render(<CivicConcierge />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
