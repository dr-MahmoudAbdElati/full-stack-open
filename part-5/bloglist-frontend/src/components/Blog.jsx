import Notification from './Notification'

const Blog = ({
  blog,
  updateBlog,
  deleteBlog,
  user,
  notification,
  setNotification,
}) => {
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
    <div>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <h2>{blog.title}</h2>

      <a href="">{blog.url}</a>

      <p>
        likes: {blog.likes}
        {'  '}
        <button onClick={() => handleUpdateLikes(blog)}>like</button>
      </p>

      <p>Added by {blog.user?.name ?? 'unknown user'}</p>

      {isOwner ? (
        <button onClick={() => handleDeleteBlog(blog)}>remove</button>
      ) : null}
    </div>
  )
}

export default Blog
