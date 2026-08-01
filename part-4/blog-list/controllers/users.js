const userRouter = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

userRouter.get("/", async (request, response) => {
  const usersInDb = await User.find({});
  response.status(200).json(usersInDb);
});

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!(password && password.length >= 3))
    return response.status(400).json({ error: "invalid or missing password" });

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await newUser.save();

  response.status(201).json(savedUser);
});

module.exports = userRouter;
