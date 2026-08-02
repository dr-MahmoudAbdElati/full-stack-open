import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
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

  const handleCreateBlog = async (event) => {
    try {
      event.preventDefault();
      const newBlog = {
        title,
        author,
        url,
      };
      const createdBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(createdBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      setNotification({
        message: `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: "success",
      });
    } catch (err) {
      console.log(err);
      setNotification({ message: "Error creating blog", type: "error" });
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
          <div>
            <h2>create new</h2>
            <form onSubmit={handleCreateBlog}>
              <div>
                <label>
                  title:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  author:
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  url:
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </label>
              </div>
              <button type="submit">create</button>
            </form>
          </div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      </>
    );
  };

  return <>{user === null ? loginForm() : blogSection()}</>;
};

export default App;
