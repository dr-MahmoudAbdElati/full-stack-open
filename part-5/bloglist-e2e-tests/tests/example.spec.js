const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "mahmoud",
        username: "mahmoud",
        password: "password",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mahmoud", "password");
      await expect(page.getByText("mahmoud logged in")).toBeVisible();
      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mahmoud", "wrong");
      await expect(page.getByText("wrong username or password")).toBeVisible();
      await expect(page.getByText("mahmoud logged in")).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "logout" }),
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mahmoud", "password");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "good title", "mahmoud", "example url");
      await expect(page.getByText("good title mahmoud")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "first blog", "mahmoud", "example url");
      await createBlog(page, "second blog", "mahmoud", "example url");
      await createBlog(page, "third blog", "mahmoud", "example url");

      await page
        .locator("div")
        .filter({ hasText: /^third/ })
        .last()
        .getByRole("button", { name: "view" })
        .click();

      await page
        .locator("div")
        .filter({ hasText: /^first/ })
        .last()
        .getByRole("button", { name: "view" })
        .click();

      const secondBlogs = page.locator("div").filter({ hasText: /^second/ });

      const blogToLike = secondBlogs.last();

      await blogToLike.getByRole("button", { name: "view" }).click();
      await expect(blogToLike).toContainText("likes: 0");

      await blogToLike.getByRole("button", { name: "like" }).click();
      await expect(blogToLike).toContainText("likes: 1");
    });

    test("a blog can be deleted by the user who added it", async ({ page }) => {
      await createBlog(page, "good title", "mahmoud", "example url");
      const blogToDelete = page
        .locator("div")
        .filter({ hasText: /^good/ })
        .last();

      await blogToDelete.getByRole("button", { name: "view" }).click();
      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();
      await expect(blogToDelete).not.toBeVisible();
    });

    test("only the user who added a blog can see the delete button", async ({
      page,
      request,
    }) => {
      await createBlog(page, "good title", "mahmoud", "example url");
      const blogToDelete = page
        .locator("div")
        .filter({ hasText: /^good/ })
        .last();

      await blogToDelete.getByRole("button", { name: "view" }).click();
      await expect(
        blogToDelete.getByRole("button", { name: "remove" }),
      ).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();
      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "another user",
          username: "anotheruser",
          password: "password",
        },
      });
      await loginWith(page, "anotheruser", "password");

      const blogToDeleteAfterLogout = page
        .locator("div")
        .filter({ hasText: /^good/ })
        .last();

      await blogToDeleteAfterLogout
        .getByRole("button", { name: "view" })
        .click();
      await expect(
        blogToDeleteAfterLogout.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });

    test("blogs are arranged in order of likes. blog with the most likes first", async ({
      page,
    }) => {
      await createBlog(page, "first blog", "mahmoud", "example url");
      await createBlog(page, "second blog", "mahmoud", "example url");
      await createBlog(page, "third blog", "mahmoud", "example url");

      const firstBlog = page
        .locator("div")
        .filter({ hasText: /^first/ })
        .last();
      const secondBlog = page
        .locator("div")
        .filter({ hasText: /^second/ })
        .last();
      const thirdBlog = page
        .locator("div")
        .filter({ hasText: /^third/ })
        .last();

      await firstBlog.getByRole("button", { name: "view" }).click();
      await secondBlog.getByRole("button", { name: "view" }).click();
      await thirdBlog.getByRole("button", { name: "view" }).click();

      await secondBlog.getByRole("button", { name: "like" }).click();
      await secondBlog.getByRole("button", { name: "like" }).click();
      await firstBlog.getByRole("button", { name: "like" }).click();

      const blogs = page.locator("div").filter({ hasText: /blog/ });

      const firstBlogText = await blogs.nth(0).textContent();
      const secondBlogText = await blogs.nth(1).textContent();
      const thirdBlogText = await blogs.nth(2).textContent();

      expect(firstBlogText).toContain("second blog");
      expect(secondBlogText).toContain("first blog");
      expect(thirdBlogText).toContain("third blog");
    });
  });
});
