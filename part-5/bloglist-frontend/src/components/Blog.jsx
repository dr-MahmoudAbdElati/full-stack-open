import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const handleUpdateLikes = (blog) => {
    const blogId = blog.id ?? blog._id

    if (!blogId) {
      console.error('Missing blog id:', blog)
      return
    }

    updateBlog(blogId, { likes: blog.likes + 1 })
  }

  const handleDeleteBlog = (blog) => {
    const blogId = blog.id ?? blog._id

    if (!blogId) {
      console.error('Missing blog id:', blog)
      return
    }

    if (!window.confirm(`remove blog ${blog.title} by ${blog.user.username}`))
      return
    deleteBlog(blogId)
  }

  const blogStyle = {
    padding: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const isOwner = blog.user?.username === user?.username

  return visible ? (
    <div style={blogStyle}>
      <p>
        {blog.title} {'  '}
        <button onClick={() => setVisible(false)}>hide</button>
      </p>
      <p>{blog.url}</p>
      <p>
        likes: {blog.likes}
        {'  '}
        <button onClick={() => handleUpdateLikes(blog)}>like</button>
      </p>
      <p>{blog.user?.name ?? 'unknown user'}</p>
      {isOwner ? (
        <button onClick={() => handleDeleteBlog(blog)}>remove</button>
      ) : null}
    </div>
  ) : (
    <div style={blogStyle}>
      {blog.title} {blog.user?.name ?? 'unknown user'} {'  '}
      <button onClick={() => setVisible(true)}>view</button>
    </div>
  )
}

export default Blog
