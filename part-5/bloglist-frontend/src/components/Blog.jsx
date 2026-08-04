import { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

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
        likes: {blog.likes} <button>like</button>
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
