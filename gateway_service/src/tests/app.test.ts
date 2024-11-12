import request from "supertest";
import { app } from "../app";

describe("App test", () => {
  it("should respond with 200 on the index route", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Main Page");
  });

  it("should respond with 404 on unknown route", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
  });
});
