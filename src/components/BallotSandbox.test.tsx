import { render, screen, fireEvent } from '@testing-library/react';
import BallotSandbox from './BallotSandbox';

describe('BallotSandbox', () => {
  it('renders the ballot options', () => {
    render(<BallotSandbox />);
    expect(screen.getByText('Simulated Ballot')).toBeInTheDocument();
    expect(screen.getByText('Test your selections in focus mode.')).toBeInTheDocument();
  });

  it('allows category and option selection', () => {
    render(<BallotSandbox />);
    
    // Select Mayor category
    const mayorBtn = screen.getByText('Mayor');
    fireEvent.click(mayorBtn);
    
    // Select Candidate A
    const candidateABtn = screen.getByText('Candidate A');
    fireEvent.click(candidateABtn);
    
    expect(screen.getByText(/LOGGED:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Candidate A/i).length).toBeGreaterThan(1);
    
    // Cast ballot
    const castBtn = screen.getByText('Cast Simulated Ballot');
    fireEvent.click(castBtn);
    
    expect(screen.getByText(/BALLOT CAST SUCCESSFULLY/i)).toBeInTheDocument();
  });

});
