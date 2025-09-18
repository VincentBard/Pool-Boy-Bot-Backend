import request from "supertest";
import app from "../app.js";
import { getAuth0Token } from "./getToken.js";

let token;

beforeAll(async () => {
  token = await getAuth0Token();
});

describe("Readings API", () => {
  it("should deny unauthenticated access", async () => {
    const res = await request(app).get("/api/readings");
    expect(res.statusCode).toBe(401);
  });

  it("should allow authenticated access", async () => {
    const res = await request(app)
      .get("/api/readings")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.statusCode);
  });

  it("should create a new reading", async () => {
    const res = await request(app)
      .post("/api/readings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        deviceId: "test-device-id", // replace with valid ObjectId in seeded DB
        temperature: 25.5,
        chlorine: 1.2,
        turbidity: 0.8,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });
});
