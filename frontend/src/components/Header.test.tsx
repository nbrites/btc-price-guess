import { render, screen } from '@testing-library/react';
import Header from './Header';


describe('Header Component', () => {
  it('renders the header content correctly', () => {
    render(<Header />);

    expect(screen.getByRole('heading', { name: /BTC Price Guessing Game/i })).toBeInTheDocument();
    expect(screen.getByText(/Guess whether the market price of Bitcoin \(BTC\/USD\) will be higher or lower after one minute\./i)).toBeInTheDocument();
  });
});


