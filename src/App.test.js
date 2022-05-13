import { render, screen } from '@testing-library/react';
import App from './App';

test('renders population text', () => {
  render(<App />);
  const element = screen.getByText("Total population of EU combined");
  expect(element).toBeInTheDocument();
});