import { useState } from "react";

const Blog = ({ blog, updateBlog }) => {
  const [visible, setVisible] = useState(false);

  const handleUpdateLikes = (blog) => {
    const blogId = blog.id ?? blog._id;

    if (!blogId) {
      console.error("Missing blog id:", blog);
      return;
    }

    updateBlog(blogId, { likes: blog.likes + 1 });
  };

  const blogStyle = {
    padding: 5,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return visible ? (
    <div style={blogStyle}>
      <p>
        {blog.title} {"  "}
        <button onClick={() => setVisible(false)}>hide</button>
      </p>
      <p>{blog.url}</p>
      <p>
        likes: {blog.likes}{" "}
        <button onClick={() => handleUpdateLikes(blog)}>like</button>
      </p>
      <p>{blog.author}</p>
    </div>
  ) : (
    <div style={blogStyle}>
      {blog.title} {blog.author} {"  "}
      <button onClick={() => setVisible(true)}>view</button>
    </div>
  );
};

export default Blog;
