import request from "supertest";
import app from "../app.js";
import { getAuth0Token } from "./getToken.js";

let token;

beforeAll(async () => {
  token = await getAuth0Token();
});

describe("Devices API", () => {
  it("should deny unauthenticated access", async () => {
    const res = await request(app).get("/api/devices");
    expect(res.statusCode).toBe(401);
  });

  it("should allow authenticated access", async () => {
    const res = await request(app)
      .get("/api/devices")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.statusCode);
  });

  it("should create a new device", async () => {
    const res = await request(app)
      .post("/api/devices")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "PoolBot 01",
        location: "Backyard",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });
});