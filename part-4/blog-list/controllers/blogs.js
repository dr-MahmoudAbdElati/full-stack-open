const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, url, author, likes } = request.body;
  if (!title || !url) {
    return response.status(400).json({ error: "missing content" });
  }

  const token = request.token;
  if (!token) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const decodedToken = jwt.verify(token, JWT_SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" });
  }

  const newBlog = new Blog({ title, url, author, likes, user: user._id });
  const savedBlog = await newBlog.save();

  user.blogs = user.blogs.concat(savedBlog);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = request.body;
  if (!updatedBlog.likes)
    return response.status(400).json({ error: "missing content" });

  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    returnDocument: "after",
    runValidators: true,
    context: "query",
  });

  if (result) {
    response.status(200).json(result);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
