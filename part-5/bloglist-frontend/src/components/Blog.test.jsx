import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog /> component', () => {
  test('information and the number of likes are shown to non-logged-in users, buttons are not shown', async () => {
    const newBlog = {
      title: 'good title',
      url: 'example url',
      user: { name: 'mahmoud' },
      likes: 0,
    }

    render(<Blog blog={newBlog} />)

    const titleElement = await screen.findByText(/good title/)
    const urlElement = screen.queryByText(/example url/)
    const likesElement = screen.queryByText(/likes:/)
    const likesNumberElement = screen.queryByText(/0/)
    const likeButton = screen.queryByRole('button', { name: 'like' })
    const removeButton = screen.queryByRole('button', { name: 'remove' })

    expect(titleElement).toBeInTheDocument()
    expect(urlElement).toBeInTheDocument()
    expect(likesElement).toBeInTheDocument()
    expect(likesNumberElement).toBeInTheDocument()
    expect(likeButton).toBeNull()
    expect(removeButton).toBeNull()
  })

  test('like button is shown only to logged-in users who are not the owner, remove button is shown only to the owner', async () => {
    const newBlog = {
      title: 'good title',
      url: 'example url',
      user: { name: 'mahmoud', username: 'mahmoud' },
      likes: 0,
    }

    const loggedInUser = {
      name: 'mahmoud',
      username: 'mahmoud',
    }

    const { rerender } = render(<Blog blog={newBlog} user={loggedInUser} />)

    const likeButton = screen.queryByRole('button', { name: 'like' })
    const removeButton = screen.queryByRole('button', { name: 'remove' })

    expect(likeButton).toBeNull()
    expect(removeButton).toBeInTheDocument()

    rerender(
      <Blog
        blog={newBlog}
        user={{ name: 'someone else', username: 'someone' }}
      />,
    )

    const likeButtonForOtherUser = screen.queryByRole('button', {
      name: 'like',
    })
    const removeButtonForOtherUser = screen.queryByRole('button', {
      name: 'remove',
    })

    expect(likeButtonForOtherUser).toBeInTheDocument()
    expect(removeButtonForOtherUser).toBeNull()
  })

  test('pressing like button twice calls updateBlog twice', async () => {
    const newBlog = {
      id: '1',
      title: 'good title',
      url: 'example url',
      user: { name: 'mahmoud', username: 'mahmoud' },
      likes: 0,
    }

    const mockHandler = vi.fn()
    render(
      <Blog
        blog={newBlog}
        user={{ name: 'alice', username: 'alice' }}
        updateBlog={mockHandler}
      />,
    )

    const user = userEvent.setup()
    const likeButton = screen.getByRole('button', { name: 'like' })

    expect(likeButton).toBeInTheDocument()

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
