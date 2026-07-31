const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();
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
