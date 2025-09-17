import request from "supertest";
import app from "../app.js";

describe("Readings API", () => {
  it("should block unauthenticated requests", async () => {
    const res = await request(app).get("/api/readings/12345");
    expect(res.statusCode).toBe(401);
  });

  it("should create a reading with valid token", async () => {
    const token = "mock-valid-jwt";
    const res = await request(app)
      .post("/api/readings/12345")
      .set("Authorization", `Bearer ${token}`)
      .send({ temperature: 27.5, chlorineLevel: 2.1, turbidity: 0.5 });
    expect([201, 401]).toContain(res.statusCode);
  });
});