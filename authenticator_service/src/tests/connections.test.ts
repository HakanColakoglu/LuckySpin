import request from "supertest";
import { app } from "../app";
import { loggerTest } from "../logger/logger";

describe("CORS Middleware", () => {
  it("should include CORS headers in the response for preflight request", async () => {
    const response = await request(app)
      .options("/") // Preflight request
      .set("Origin", "https://example.com");

    loggerTest.warn(response.headers["access-control-allow-origin"]);

    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://example.com"
    );
    expect(response.headers["access-control-allow-methods"]).toContain("GET");
    expect(response.headers["access-control-allow-methods"]).toContain("POST");
    expect(response.headers["access-control-max-age"]).toBeDefined();
  });

  it("should include CORS headers in the response for a request", async () => {
    const response = await request(app)
      .get("/") // Preflight request
      .set("Origin", "https://example.com");

    loggerTest.warn(response.headers["access-control-allow-origin"]);

    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://example.com"
    );
  });

  it("should not allow requests from disallowed origins", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "http://unauthorized.com");

    // Ensure no CORS headers are sent when the origin is not allowed
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

let maxNumberOfRequests = 100;
describe("Rate Limiting", () => {
  it("should allow requests below the rate limit", async () => {
    for (let i = 0; i < maxNumberOfRequests - 1; i++) {
      const response = await request(app)
        .post("/signin")
        .send({ username: "wrongusername", password: "adminPwd123." });

      expect(response.status).toBe(401); // Unathorized
    }
  });

  it("should block requests that exceed the rate limit", async () => {
    // Make 5 requests to hit the limit
    for (let i = 0; i < maxNumberOfRequests; i++) {
      const response = await request(app)
        .post("/signup")
        .send({ username: "admin", password: "adminPwd123." });
    }

    // The 6th request should fail due to rate limiting
    const response = await request(app).get("/");
    expect(response.status).toBe(429); // 429 is the Too Many Requests status code
  });
});
