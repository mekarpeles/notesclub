import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('Header', () => {
  test('renders Asimov · Marie Curie\'s blog', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/curie/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.getAttribute("href")).toBe("/curie");
    expect(linkElement.innerHTML).toBe("Asimov · Marie Curie's blog");
  });
})
