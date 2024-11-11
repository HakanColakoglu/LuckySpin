import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

describe("/user/profile Route", () => {
  let userToken: string;
  let userCookie: string;

  beforeAll(() => {
    // Mock a valid token for a "user" role
    userToken = jwt.sign(
      { id: 2, username: "user", role: "user" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    userCookie = `token=${userToken}`;
  });

  it("should deny access without authentication", async () => {
    const response = await request(app).get("/user/profile");
    expect(response.status).toBe(401); // Unauthorized
  });

  it("should deny access with invalid role", async () => {
    const adminToken = jwt.sign(
      { id: 1, username: "admin", role: "admin" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    const adminCookie = `token=${adminToken}`;

    const response = await request(app)
      .get("/user/profile")
      .set("Cookie", adminCookie);

    expect(response.status).toBe(403); // Forbidden
  });

  it("should allow access with correct role and retrieve profile data", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Cookie", userCookie);

    expect(response.status).toBe(200); // Success
    expect(response.body).toHaveProperty("username", "user");
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBeGreaterThanOrEqual(0);
    expect(response.body).toHaveProperty("history");
    expect(Array.isArray(response.body.history)).toBe(true);
  });

  it("should return balance and history with correct data format", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("Cookie", userCookie);

    expect(response.status).toBe(200);
    expect(response.body.balance).toBeDefined();
    expect(typeof response.body.balance).toBe("number");

    expect(response.body.history).toBeDefined();
    expect(Array.isArray(response.body.history)).toBe(true);
    expect(response.body.history.length).toBeGreaterThan(0);

    // Check history item structure
    const historyItem = response.body.history[0];
    expect(historyItem).toHaveProperty("date");
    expect(historyItem).toHaveProperty("amount");
    expect(historyItem).toHaveProperty("type");
    expect(["lost", "won", "deposit", "withdraw"]).toContain(historyItem.type);
  });
});

describe("user balance management and game result", () => {
    let userToken: string;
    let userCookie: string;
  
    beforeAll(() => {
      // Generate a valid token for a user with role "user"
      userToken = jwt.sign(
        { id: 2, username: "user", role: "user" },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
  
      userCookie = `token=${userToken}`;
    });
  
    describe("deposit and withdraw)", () => {
      it("should deposit successfully", async () => {
        const response = await request(app)
          .post("/user/credit")
          .set("Cookie", userCookie)
          .send({ amount: 100, type: "deposit" });
  
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Transaction successful");
        expect(response.body.balance).toBeGreaterThanOrEqual(100);
      });
  
      it("should withdraw successfully", async () => {
        const response = await request(app)
          .post("/user/credit")
          .set("Cookie", userCookie)
          .send({ amount: 50, type: "withdraw" });
  
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Transaction successful");
        expect(response.body.balance).toBeGreaterThanOrEqual(0);
      });
  
      it("should not allow withdrawal if balance is insufficient", async () => {
        const response = await request(app)
          .post("/user/credit")
          .set("Cookie", userCookie)
          .send({ amount: 100000, type: "withdraw" });
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Insufficient balance");
      });
  
      it("should not allow deposit if it exceeds maximum balance", async () => {
        const response = await request(app)
          .post("/user/credit")
          .set("Cookie", userCookie)
          .send({ amount: 10000, type: "deposit" });
  
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("Balance cannot exceed");
      });
    });
  
    describe("coin flip game", () => {
      it("should allow playing the game and winning or losing", async () => {
        const response = await request(app)
          .post("/play/coinflip")
          .set("Cookie", userCookie)
          .send({ amount: 50, selection: 1 }); // Selection is either head or tails, depends on the implementation
  
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/You won!|You lost!/);
        expect(response.body).toHaveProperty("newBalance");
      });
  
      it("should not allow playing the game if balance is insufficient", async () => {
        const response = await request(app)
          .post("/play/coinflip")
          .set("Cookie", userCookie)
          .send({ amount: 100000, selection: 1 });
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Insufficient balance");
      });
  
      it("should not allow playing the game with an invalid amount", async () => {
        const response = await request(app)
          .post("/play/coinflip")
          .set("Cookie", userCookie)
          .send({ amount: -50, selection: 1 });
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid amount");
      });
    });
  });
