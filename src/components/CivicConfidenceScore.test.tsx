import { render, screen } from '@testing-library/react';
import CivicConfidenceScore from './CivicConfidenceScore';

describe('CivicConfidenceScore', () => {
  it('renders default score when nothing is completed', () => {
    render(<CivicConfidenceScore score={0} achieved={[]} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('◆ New Voter')).toBeInTheDocument();
  });

  it('calculates level correctly for a high score', () => {
    render(<CivicConfidenceScore score={55} achieved={['State selected', 'Registration done']} />);
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('◆ Prepared')).toBeInTheDocument();
  });
});
