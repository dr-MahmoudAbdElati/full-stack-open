import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogFrom'
import { render, screen } from '@testing-library/react'

test('<BlogFrom /> component calls addBlog once and with the correct data', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={mockHandler} />)

  const titleInput = screen.getByLabelText(/title/i)
  const authorInput = screen.getByLabelText(/author/i)
  const urlInput = screen.getByLabelText(/url/i)
  const createButton = screen.getByRole('button', { name: /create/i })

  await user.type(titleInput, 'good title')
  await user.type(authorInput, 'mahmoud')
  await user.type(urlInput, 'example url')

  await user.click(createButton)

  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'good title',
    author: 'mahmoud',
    url: 'example url',
  })
})
