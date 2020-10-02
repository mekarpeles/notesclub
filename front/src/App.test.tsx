import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

describe('Header', () => {
  test('renders Book Notes Club', () => {
    const { getByText } = render(<App />)
    const linkElement = getByText(/Are you a book reader?/i)
    expect(linkElement).toBeInTheDocument()
  });
})
