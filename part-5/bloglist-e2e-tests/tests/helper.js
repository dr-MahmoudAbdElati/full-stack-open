import { expect } from "@playwright/test";

const loginWith = async (page, username, password) => {
  await page.getByRole("link", { name: "login" }).click();
  await expect(page.getByRole("button", { name: "login" })).toBeVisible();

  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("link", { name: "new blog" }).click();
  await expect(page.getByRole("button", { name: "create" })).toBeVisible();

  await page.getByLabel("title:").fill(title);
  await page.getByLabel("author:").fill(author);
  await page.getByLabel("url:").fill(url);
  await page.getByRole("button", { name: "create" }).click();

  await expect(page.getByRole("link", { name: title })).toBeVisible();
};

export { loginWith, createBlog };
