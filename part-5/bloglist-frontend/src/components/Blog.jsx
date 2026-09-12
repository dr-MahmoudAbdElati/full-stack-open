import { Button, Paper } from '@mui/material'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const handleUpdateLikes = (blog) => {
    const blogId = blog.id ?? blog._id
    if (!blogId) {
      console.error('Missing blog id:', blog)
      return
    }
    if (!user) return

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

  if (!blog) {
    return null
  }

  const isOwner = blog.user?.username === user?.username

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <h2>{blog.title}</h2>

      <a href="" style={{ color: '#1976d2', textDecoration: 'underline' }}>
        {blog.url}
      </a>

      <p style={{ color: 'gray' }}>
        Added by {blog.user?.name ?? 'unknown user'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{blog.likes} likes</span>
        {user && !isOwner && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleUpdateLikes(blog)}
          >
            LIKE
          </Button>
        )}
        {user && isOwner && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteBlog(blog)}
          >
            REMOVE
          </Button>
        )}
      </div>
    </Paper>
  )
}

export default Blog
