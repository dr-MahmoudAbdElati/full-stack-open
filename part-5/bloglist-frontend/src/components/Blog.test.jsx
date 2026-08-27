import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog /> component', () => {
  test('renders the title', async () => {
    const newBlog = {
      title: 'good title',
      url: 'example url',
      user: { name: 'mahmoud' },
      likes: 0,
    }

    render(<Blog blog={newBlog} />)

    const titleElement = await screen.findByText(/good title/)
    const urlElement = await screen.queryByText(/example url/)
    const likesElement = await screen.queryByText(/likes:/)

    expect(titleElement).toBeInTheDocument()
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  test('displays URL, likes and user when pressing the view button', async () => {
    const newBlog = {
      title: 'good title',
      url: 'example url',
      likes: 0,
      user: { name: 'mahmoud' },
    }

    render(<Blog blog={newBlog} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')

    await user.click(viewButton)

    const urlElement = await screen.findByText(/example url/)
    const likes = await screen.findByText(/likes:\s*0/)
    const username = await screen.findByText(/mahmoud/)

    expect(urlElement).toBeInTheDocument()
    expect(likes).toBeInTheDocument()
    expect(username).toBeInTheDocument()
  })

  test('pressing like button twice calls updateBlog twice', async () => {
    const newBlog = {
      id: 'blog-1',
      title: 'good title',
      url: 'example url',
      user: { name: 'mahmoud' },
      likes: 0,
    }

    const mockHandler = vi.fn()
    render(<Blog blog={newBlog} updateBlog={mockHandler} />)

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))
    await user.click(screen.getByText('like'))
    await user.click(screen.getByText('like'))

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
