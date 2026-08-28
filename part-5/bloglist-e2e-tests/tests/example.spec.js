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
  });
});
