import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('upload button is disabled initially', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled()
})

test('upload button enables when an image is selected', () => {
  const file = new File(['dummy'], 'test.png', { type: 'image/png' })
  render(<App />)
  const fileInput = screen.getByLabelText(/upload file/i)
  const uploadButton = screen.getByRole('button', { name: /upload/i })

  fireEvent.change(fileInput, { target: { files: [file] } })

  expect(uploadButton).toBeEnabled()
})

test('displays error message when Match API fails', async () => {
  jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce({
      json: () => Promise.resolve({ filename: 'test.png' })
    })
    .mockRejectedValueOnce(new Error('Server error, please try again later.'))

  render(<App />)
  const file = new File(['dummy'], 'test.png', { type: 'image/png' })
  const fileInput = screen.getByLabelText(/upload file/i)
  const uploadButton = screen.getByRole('button', { name: /upload/i })

  fireEvent.change(fileInput, { target: { files: [file] } })
  fireEvent.click(uploadButton)

  expect(await screen.findByText(/server error/i)).toBeInTheDocument()
})

test('clears preview image when file is removed', () => {
  const file = new File(['dummy'], 'test.png', { type: 'image/png' })
  render(<App />)
  const fileInput = screen.getByLabelText(/upload file/i)

  fireEvent.change(fileInput, { target: { files: [file] } })
  fireEvent.change(fileInput, { target: { files: [] } })

  const previewImage = screen.queryByRole('img', { name: /preview/i })
  expect(previewImage).not.toBeInTheDocument()
})