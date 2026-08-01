const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

describe("when there is only one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  describe("adding a user", () => {
    test.only("fails with invalid user with 400 status code and error message", async () => {
      const usersAtStart = await api.get("/api/users");

      const invalidUser = { username: "mahmoud", password: "" };
      const result = await api
        .post("/api/users")
        .send(invalidUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error.includes("invalid or missing password"));

      const usersAtEnd = await api.get("/api/users");

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
