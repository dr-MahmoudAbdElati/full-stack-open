const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const app = require("../app");
const listHelper = require("../utils/list_helper");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Getting Started with Node.js",
    author: "John Doe",
    url: "https://example.com/nodejs-guide",
    likes: 12,
  },
  {
    title: "Understanding Express Middleware",
    author: "Jane Smith",
    url: "https://example.com/express-middleware",
    likes: 25,
  },
  {
    title: "Mastering MongoDB with Mongoose",
    author: "Alice Johnson",
    url: "https://example.com/mongoose-tutorial",
    likes: 18,
  },
];

describe("when there is initially some blogs saved to DB", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  describe("total likes", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
    ];
    const blogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0,
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
      },
    ];

    test("of empty list is zero", () => {
      const result = listHelper.totalLikes([]);
      assert.strictEqual(result, 0);
    });

    test("of list having only one blog, equals the likes of that", () => {
      const result = listHelper.totalLikes(listWithOneBlog);
      assert.strictEqual(result, 5);
    });

    test("of a bigger list is calculated right", () => {
      const result = listHelper.totalLikes(blogs);
      assert.strictEqual(result, 24);
    });
  });
  describe("favorite blog", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
    ];
    const blogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0,
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
      },
    ];

    test("when there is no blogs", () => {
      assert.strictEqual(listHelper.favoriteBlog([]), undefined);
    });
    test("when there is only one", () => {
      assert.deepStrictEqual(
        listHelper.favoriteBlog(listWithOneBlog),
        listWithOneBlog[0],
      );
    });
    test("when there is multiple blogs", () => {
      const expected = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
      };
      assert.deepStrictEqual(listHelper.favoriteBlog(blogs), expected);
    });
  });
  describe("most blogs", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
    ];
    const blogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0,
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
      },
    ];

    test("when there is no blogs", () => {
      assert.strictEqual(listHelper.mostBlogs([]), 0);
    });
    test("when there is only one", () => {
      const expected = {
        author: listWithOneBlog[0].author,
        blogs: 1,
      };
      assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), expected);
    });
    test("when there is multiple blogs", () => {
      const expected = {
        author: "Edsger W. Dijkstra",
        blogs: 2,
      };
      assert.deepStrictEqual(listHelper.mostBlogs(blogs), expected);
    });
  });
  describe("most likes", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
    ];
    const blogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0,
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
        likes: 5,
        __v: 0,
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
      },
    ];

    test("when there is no blogs", () => {
      assert.strictEqual(listHelper.mostLikes([]), 0);
    });
    test("when there is only one", () => {
      const expected = {
        author: listWithOneBlog[0].author,
        likes: 5,
      };
      assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), expected);
    });
    test("when there is multiple blogs", () => {
      const expected = {
        author: "Edsger W. Dijkstra",
        likes: 17,
      };
      assert.deepStrictEqual(listHelper.mostLikes(blogs), expected);
    });
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("unique identifier property is named id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const randomIndex = Math.floor(Math.random() * response.body.length);
    const randomBlog = response.body[randomIndex];

    const randomBlogKeys = Object.keys(randomBlog);
    assert(randomBlogKeys.includes("id"));
  });

  describe("creating a blog", () => {
    test("succeeds with valid blogs", async () => {
      const newBlog = {
        title: "A Deep Dive into JavaScript Closures",
        author: "Michael Brown",
        url: "https://example.com/javascript-closures",
        likes: 42,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      assert.strictEqual(response.body.length, initialBlogs.length + 1);

      const contents = response.body.map((b) => b.title);

      assert(contents.includes(newBlog.title));
    });

    test("fails with invalid blogs with status code 400", async () => {
      const blogWithoutTitle = {
        author: "Michael Brown",
        url: "https://example.com/javascript-closures",
        likes: 42,
      };
      const blogWithoutUrl = {
        title: "A Deep Dive into JavaScript Closures",
        author: "Michael Brown",
        likes: 42,
      };

      await api.post("/api/blogs").send(blogWithoutTitle).expect(400);
      await api.post("/api/blogs").send(blogWithoutUrl).expect(400);

      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("set likes to zero if likes property is missing", async () => {
      const newBlog = {
        title: "A Deep Dive into JavaScript Closures",
        author: "Michael Brown",
        url: "https://example.com/javascript-closures",
      };
      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      const blogs = response.body;

      const savedBlog = blogs.find((b) => b.title === newBlog.title);

      assert.strictEqual(savedBlog.likes, 0);
    });
  });

  describe("deleting a blog", () => {
    test("by its id", async () => {
      const resBefore = await api.get("/api/blogs");
      const blogsBefore = resBefore.body;

      const randomIndex = Math.floor(Math.random() * blogsBefore.length);
      const blogToDeleteId = blogsBefore[randomIndex].id;
      const blogToDeleteTitle = blogsBefore[randomIndex].title;

      await api.delete(`/api/blogs/${blogToDeleteId}`).expect(204);

      const resAfter = await api.get("/api/blogs");
      const blogsAfter = resAfter.body;
      const titles = blogsAfter.map((b) => b.title);

      assert.strictEqual(blogsAfter.length, blogsBefore.length - 1);
      assert.strictEqual(titles.includes(blogToDeleteTitle), false);
    });
  });

  describe("updating a blog", () => {
    test("by its id", async () => {
      const resBefore = await api.get("/api/blogs");
      const blogsBefore = resBefore.body;

      const randomIndex = Math.floor(Math.random() * blogsBefore.length);
      const blogToUpdateId = blogsBefore[randomIndex].id;
      const likesBefore = blogsBefore[randomIndex].likes;

      const updatedBlogResponse = await api
        .put(`/api/blogs/${blogToUpdateId}`)
        .send({ likes: likesBefore + 1 })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const likesAfter = updatedBlogResponse.body.likes;

      assert.strictEqual(likesAfter, likesBefore + 1);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
