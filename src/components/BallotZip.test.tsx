import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BallotZip from './BallotZip';

describe('BallotZip', () => {
  it('renders the title and input', () => {
    render(<BallotZip />);
    expect(screen.getByText('Ballot Simplicity')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 90210')).toBeInTheDocument();
  });

  it('shows loading and then results when a valid ZIP is entered', async () => {
    render(<BallotZip />);
    const input = screen.getByPlaceholderText('e.g. 90210');
    fireEvent.change(input, { target: { value: '90210' } });
    
    // Simulating search by hitting enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(screen.getByText('Looking up ballot…')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Prop 1: Clean Energy Bond')).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
