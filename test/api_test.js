const { test, after, describe, beforeEach } = require("node:test");
const bcrypt = require("bcrypt");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app.js");
const api = supertest(app);
const User = require("../models/user.js");
const helper = require("./helper.js");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekrett", 10);
    const user = new User({
      username: "root",
      passwordHash,
    });
    await user.save();
  });

  test("creation sucess with a fresh username", async () => {
    const userAtStart = await helper.userInDb();

    const newUser = {
      username: "mluukkai",
      password: "salainen",
      name: "Matti Luukkainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const userAtEnd = await helper.userInDb();
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1);

    const usernames = userAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already take", async () => {
    const userAtStart = await helper.userInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const userAtEnd = await helper.userInDb();
    assert(result.body.error.includes("expected username tobe uqiqe"));
    assert.strictEqual(userAtEnd.length, userAtStart.length);
  });
  after(async () => {
    await User.deleteMany({});
    await mongoose.conection.close();
  });
});
