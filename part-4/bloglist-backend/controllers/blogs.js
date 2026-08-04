const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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

  const user = request.user;
  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" });
  }

  const newBlog = new Blog({ title, url, author, likes, user: user._id });
  const savedBlog = await newBlog.save();

  user.blogs = user.blogs || [];
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const token = request.token;
  if (!token) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = request.user;
  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" });
  }

  if (!request.params.id) {
    return response.status(400).json({ error: "BlogId missing or not valid" });
  }

  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) {
    return response.status(404).json({ error: "Blog not found" });
  }

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: "user not authorized to delete that blog" });
  }

  await Blog.findByIdAndDelete(blogToDelete._id);

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const blogId = request.params.id;

  if (!blogId) {
    return response.status(400).json({ error: "BlogId missing or not valid" });
  }

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return response.status(400).json({ error: "malformatted id" });
  }

  const { likes } = request.body;

  if (likes === undefined) {
    return response.status(400).json({ error: "missing content" });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    { likes },
    {
      returnDocument: "after",
      runValidators: true,
      context: "query",
    },
  );

  if (!updatedBlog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  return response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
