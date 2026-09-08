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

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mahmoud", "password");
      await expect(page.getByText("new blog")).toBeVisible();
      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mahmoud", "wrong");
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mahmoud", "password");
    });

    test("logged in user can create a new blog", async ({ page }) => {
      await createBlog(page, "good title", "mahmoud", "example url");
      await expect(page.getByText("good title")).toBeVisible();
    });

    test("logged in user can like a blog", async ({ page, request }) => {
      await createBlog(page, "good title", "mahmoud", "example url");

      await page.getByRole("button", { name: "logout" }).click();

      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "another user",
          username: "another user",
          password: "password",
        },
      });

      await loginWith(page, "another user", "password");

      await page.getByRole("link", { name: "good title" }).click();

      const likesText = page.locator("span").filter({ hasText: "likes:" });

      await expect(likesText).toContainText("likes: 0");

      await page.getByRole("button", { name: "like" }).click();

      await expect(likesText).toContainText("likes: 1");
    });

    test("logged in user can delete a blog", async ({ page }) => {
      await createBlog(page, "good title", "mahmoud", "example url");

      await expect(
        page.getByRole("link", { name: "good title" }),
      ).toBeVisible();

      await page.getByRole("link", { name: "good title" }).click();
      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();
      await expect(
        page.getByRole("link", { name: "good title" }),
      ).not.toBeVisible();
    });

    test("only the user who added a blog can see the remove button", async ({
      page,
      request,
    }) => {
      await createBlog(page, "good title", "mahmoud", "example url");

      const createdBlog = page.getByRole("link", { name: "good title" });
      await expect(createdBlog).toBeVisible();

      await createdBlog.click();

      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();

      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "another user",
          username: "another user",
          password: "password",
        },
      });
      await loginWith(page, "another user", "password");

      const blogToDeleteAfterLogout = page.getByRole("link", {
        name: "good title",
      });

      await blogToDeleteAfterLogout.click();

      await expect(
        page.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });
  });
});
