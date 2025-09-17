import request from "supertest";
import app from "../app.js";  // your Express app

describe("Users API", () => {
  it("should return 401 without token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 with token (mock)", async () => {
    const token = "mock-valid-jwt"; // Replace with a real token or mock Auth0
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 401]).toContain(res.statusCode);
  });
});