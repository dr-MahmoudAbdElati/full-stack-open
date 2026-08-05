import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogFrom";
import Togglable from "./components/Togglable";

const normalizeUser = (userData) => ({
  token: userData.token,
  username: userData.username ?? userData.user?.username,
  name: userData.name ?? userData.user?.name,
  blogs: userData.blogs ?? userData.user?.blogs ?? [],
});

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      const blogs = await blogService.getAll();
      setBlogs(blogs.toSorted((a, b) => b.likes - a.likes));
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const storedUser = JSON.parse(loggedUserJSON);
      setUser(normalizeUser(storedUser));
    }
  }, []);

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const loggedInUser = await loginService.login({ username, password });
      const normalizedUser = normalizeUser(loggedInUser);

      setUser(normalizedUser);
      blogService.setToken(normalizedUser.token);
      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(normalizedUser),
      );
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
  const deleteBlog = async (blogId) => {
    try {
      const response = await blogService.deleteBlog(blogId);

      if (response.status === 204) {
        setBlogs((currentBlogs) =>
          currentBlogs.filter((blog) => blog.id !== blogId),
        );

        setUser((currentUser) => {
          if (!currentUser) return currentUser;

          const updatedUser = {
            ...currentUser,
            blogs: (currentUser.blogs ?? []).filter((blog) => blog !== blogId),
          };

          window.localStorage.setItem(
            "loggedBlogappUser",
            JSON.stringify(updatedUser),
          );

          return updatedUser;
        });
      }
    } catch (error) {
      console.log(error);
      setNotification({ message: error.response.data.error });
    }
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
            {user.name} logged in{" "}
            <button onClick={handleLogout}>logout</button>{" "}
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>

          <div>
            {blogs.map((blog) => (
              <Blog
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                user={user}
                key={blog.id}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  return <>{user === null ? loginForm() : blogSection()}</>;
};

export default App;
