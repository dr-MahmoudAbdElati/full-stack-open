import { useState } from 'react'
import Notification from './Notification'
import { Button, TextField } from '@mui/material'

const BlogForm = ({ addBlog, notification, setNotification }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url,
    }

    addBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <Notification
        notification={notification}
        setNotification={setNotification}
      />

      <form onSubmit={createBlog}>
        <div style={{ marginTop: 10 }}>
          <TextField
            label="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <TextField
            label="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <TextField
            label="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          CREATE
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
