import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogFrom";
import Togglable from "./components/Togglable";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (err) {
      console.log(err);
      setNotification({ message: "Wrong username or password", type: "error" });
    }
  };
  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
  };
  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const createdBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(createdBlog));
      setNotification({
        message: `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: "success",
      });
    } catch (err) {
      setNotification({ message: "Error creating blog", type: "error" });
      console.log(err);
    }
  };
  const updateBlog = async (id, updatedObject) => {
    const updatedBlog = await blogService.update(id, updatedObject);
    setBlogs(blogs.map((blog) => (blog.id === id ? updatedBlog : blog)));
  };

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );

  const blogFormRef = useRef();
  const blogSection = () => {
    return (
      <>
        <div>
          <h2>blogs</h2>
          {notification && (
            <Notification
              notification={notification}
              setNotification={setNotification}
            />
          )}
          <p>
            {user.user.name} logged in{" "}
            <button onClick={handleLogout}>logout</button>{" "}
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>

          <div>
            {blogs.map((blog) => (
              <Blog blog={blog} updateBlog={updateBlog} key={blog.id} />
            ))}
          </div>
        </div>
      </>
    );
  };

  return <>{user === null ? loginForm() : blogSection()}</>;
};

export default App;
