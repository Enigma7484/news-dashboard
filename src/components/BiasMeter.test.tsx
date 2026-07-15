import React from 'react';
import { render, screen } from '@testing-library/react';
import BiasMeter from './BiasMeter';


describe('BiasMeter', () => {
  it('renders a directional article-framing designation', () => {
    render(
      <BiasMeter
        bias="left"
        score={-0.64}
        confidence={0.82}
        signals={[{ phrase: 'climate justice', lean: 'left' }]}
      />
    );

    expect(screen.getByLabelText('Political bias: left')).toBeInTheDocument();
    expect(screen.getByText('82% confidence')).toBeInTheDocument();
    expect(screen.getByText('climate justice')).toBeInTheDocument();
  });

  it('shows pending when the full-article analysis is unavailable', () => {
    render(<BiasMeter bias={null} score={null} compact />);

    expect(screen.getByLabelText('Political bias analysis pending')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
