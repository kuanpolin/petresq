// client/src/App.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('upload button is disabled initially', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled()
})
