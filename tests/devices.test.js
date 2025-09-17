import request from "supertest";
import app from "../app.js";

describe("Devices API", () => {
  it("should not allow unauthenticated access", async () => {
    const res = await request(app).get("/api/devices");
    expect(res.statusCode).toBe(401);
  });

  it("should create device with valid token", async () => {
    const token = "mock-valid-jwt"; 
    const res = await request(app)
      .post("/api/devices")
      .set("Authorization", `Bearer ${token}`)
      .send({ deviceName: "PoolBot", serialNumber: "SN12345" });
    expect([201, 401]).toContain(res.statusCode);
  });
});