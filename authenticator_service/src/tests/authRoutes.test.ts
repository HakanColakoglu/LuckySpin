import request from "supertest";
import jwt, { JwtPayload } from "jsonwebtoken";

import { app } from "../app";

describe("Authentication Routes", () => {
  it("should signup successfully", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ username: "admin", password: "adminPwd123." });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  it("should fail signin with wrong password", async () => {
    const response = await request(app)
      .post("/signin")
      .send({ username: "admin", password: "wrongpwd" });

    expect(response.status).toBe(401); // Unathorized
  });

  it("should fail signin with wrong username", async () => {
    const response = await request(app)
      .post("/signin")
      .send({ username: "wrongusername", password: "adminPwd123." });

    expect(response.status).toBe(401); // Unathorized
  });

  it("should signin successfully", async () => {
    const response = await request(app)
      .post("/signin")
      .send({ username: "admin", password: "adminPwd123." });

    expect(response.status).toBe(200); // Success
  });
});

describe("JWT Sign-In", () => {
  let token: string;

  it("should sign in successfully and return a JWT token", async () => {
    const response = await request(app)
      .post("/signin")
      .send({ username: "admin", password: "adminPwd123." });

    // Check for a successful status
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    // Save token for later verification
    token = response.body.token;

    // Decode the token and verify its contents
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    expect(decoded).toMatchObject({
      id: expect.any(Number), 
      username: "admin",
      role: "admin",
    });
  });
});
