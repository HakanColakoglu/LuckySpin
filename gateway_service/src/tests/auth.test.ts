import request from "supertest";
import { app } from "../app";
import nock from "nock";
import jwt from "jsonwebtoken";
import { redisClient } from "../config/redisClient";

describe("Authentication Routes", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it("should signup successfully", async () => {
    // Mock for successful signup response
    nock("http://localhost:4000")
      .post("/signup")
      .reply(201, { message: "User created successfully" });

    const response = await request(app)
      .post("/auth/signup")
      .send({ username: "admin", password: "adminPwd123." });

    expect(response.status).toBe(201);
  });

  it("should fail signin with wrong password", async () => {
    // Mock for faulty credentials
    nock("http://localhost:4000")
      .post("/signin")
      .reply(401, { message: "Invalid credentials" });

    const response = await request(app)
      .post("/auth/signin")
      .send({ username: "admin", password: "wrongpwd" });

    expect(response.status).toBe(401); // Unathorized
  });

  it("should fail signin with wrong username", async () => {
    // Mock for faulty credentials
    nock("http://localhost:4000")
      .post("/signin")
      .reply(401, { message: "Invalid credentials" });

    const response = await request(app)
      .post("/auth/signin")
      .send({ username: "wrongusername", password: "adminPwd123." });

    expect(response.status).toBe(401); // Unathorized
  });

  it("should signin successfully", async () => {
    // Mock for successful credentials
    nock("http://localhost:4000")
      .post("/signin")
      .reply(200, { message: "Sign-in successful", token: "mocked.jwt.token" });

    const response = await request(app)
      .post("/auth/signin")
      .send({ username: "admin", password: "adminPwd123." });

    expect(response.status).toBe(200); // Success
  });
});
