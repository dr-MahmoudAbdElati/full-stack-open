const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const likesArr = blogs.map((b) => b.likes);
  const max = Math.max(...likesArr);
  const favorite = blogs.find((b) => b.likes === max);

  return favorite;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 0;

  const totalBlogs = (blogs, name) => {
    const reducer = (sum, blog) => {
      return blog.author === name ? sum + 1 : sum;
    };
    return blogs.reduce(reducer, 0);
  };

  const bloggerNameArr = blogs.reduce((res, blog) => {
    return res.includes(blog.author) ? res : res.concat(blog.author);
  }, []);

  const bloggersArr = bloggerNameArr.map((name) => {
    return { author: name, blogs: totalBlogs(blogs, name) };
  });

  const highestBlogCount = bloggersArr.reduce((highest, blogger) => {
    return blogger.blogs > highest ? blogger.blogs : highest;
  }, 0);
  return bloggersArr.find((blogger) => blogger.blogs === highestBlogCount);
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0;

  const totalLikesByAuthor = (blogs, name) => {
    const reducer = (sum, blog) => {
      return blog.author === name ? sum + blog.likes : sum;
    };
    return blogs.reduce(reducer, 0);
  };

  const authorNames = blogs.reduce((res, blog) => {
    return res.includes(blog.author) ? res : res.concat(blog.author);
  }, []);

  const authorsWithLikes = authorNames.map((name) => {
    return { author: name, likes: totalLikesByAuthor(blogs, name) };
  });

  const highestLikes = authorsWithLikes.reduce((max, author) => {
    return author.likes > max ? author.likes : max;
  }, 0);

  return authorsWithLikes.find((author) => author.likes === highestLikes);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
