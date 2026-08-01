const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const extractTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

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

  const token = extractTokenFrom(request);
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

  const newBlog = new Blog({ title, url, author, likes });
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
