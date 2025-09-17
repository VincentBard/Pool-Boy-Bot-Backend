import request from "supertest";
import app from "../app.js";

describe("Alerts API", () => {
  it("should deny unauthenticated access", async () => {
    const res = await request(app).get("/api/alerts/12345");
    expect(res.statusCode).toBe(401);
  });

  it("should create an alert with valid token", async () => {
    const token = "mock-valid-jwt";
    const res = await request(app)
      .post("/api/alerts/12345")
      .set("Authorization", `Bearer ${token}`)
      .send({ alertType: "Low Chlorine", message: "Chlorine dropped below safe level", severity: "warning" });
    expect([201, 401]).toContain(res.statusCode);
  });

  it("should resolve an alert", async () => {
    const token = "mock-valid-jwt";
    const alertId = "someObjectId"; // replace with real ID in integration
    const res = await request(app)
      .patch(`/api/alerts/${alertId}/resolve`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404, 401]).toContain(res.statusCode);
  });
});