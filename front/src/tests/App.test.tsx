import React from 'react'
import { render } from '@testing-library/react'
import App from './../App'

describe('App', () => {
  test('renders Book Notes Club', () => {
    const { getByText } = render(<App />)
    const linkElement = getByText(/Book Notes Club/i)
    expect(linkElement).toBeInTheDocument()
    expect(linkElement.getAttribute("href")).toEqual("/")
  })
})
