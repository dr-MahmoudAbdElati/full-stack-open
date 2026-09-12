import { useState, useEffect } from 'react'
import { useNavigate, Link, Route, Routes, useMatch } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogFrom'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

const normalizeUser = (userData) => ({
  token: userData.token,
  username: userData.username ?? userData.user?.username,
  name: userData.name ?? userData.user?.name,
  blogs: userData.blogs ?? userData.user?.blogs ?? [],
})

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  useEffect(() => {
    async function fetchBlogs() {
      const blogs = await blogService.getAll()
      setBlogs(blogs.toSorted((a, b) => b.likes - a.likes))
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const storedUser = JSON.parse(loggedUserJSON)
      setUser(normalizeUser(storedUser))
    }
  }, [])

  const handleLogin = async (event) => {
    try {
      event.preventDefault()
      const loggedInUser = await loginService.login({ username, password })
      const normalizedUser = normalizeUser(loggedInUser)

      setUser(normalizedUser)
      blogService.setToken(normalizedUser.token)
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(normalizedUser),
      )
      setUsername('')
      setPassword('')

      navigate('/')
    } catch (err) {
      console.log(err)
      setNotification({ message: 'Wrong username or password', type: 'error' })
    }
  }
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)

    navigate('/')
  }
  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      setNotification({
        message: `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'success',
      })
      navigate('/')
    } catch (err) {
      setNotification({ message: 'Error creating blog', type: 'error' })
      console.log(err)
    }
  }
  const updateBlog = async (id, updatedObject) => {
    const updatedBlog = await blogService.update(id, updatedObject)
    setBlogs(blogs.map((blog) => (blog.id === id ? updatedBlog : blog)))
  }
  const deleteBlog = async (blogId) => {
    try {
      const response = await blogService.deleteBlog(blogId)

      if (response.status === 204) {
        setBlogs((currentBlogs) =>
          currentBlogs.filter((blog) => blog.id !== blogId),
        )

        setUser((currentUser) => {
          if (!currentUser) return currentUser

          const updatedUser = {
            ...currentUser,
            blogs: (currentUser.blogs ?? []).filter((blog) => blog !== blogId),
          }

          window.localStorage.setItem(
            'loggedBlogappUser',
            JSON.stringify(updatedUser),
          )

          return updatedUser
        })
      }
      navigate('/')
    } catch (error) {
      console.log(error)
      setNotification({ message: error.response.data.error })
    }
  }

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>

          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            BLOGS
          </Button>
          {user === null ? (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              LOGIN
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={hoverStyle}
              >
                NEW BLOG
              </Button>
              <Button color="inherit" sx={hoverStyle} onClick={handleLogout}>
                LOGOUT
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Notification
        notification={notification}
        setNotification={setNotification}
      />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/login"
          element={
            <LoginForm
              handleLogin={handleLogin}
              notification={notification}
              setNotification={setNotification}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              user={user}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              notification={notification}
              setNotification={setNotification}
            />
          }
        />
        <Route
          path="/create"
          element={
            <BlogForm
              addBlog={addBlog}
              notification={notification}
              setNotification={setNotification}
            />
          }
        />
      </Routes>
    </Container>
  )
}

export default App
