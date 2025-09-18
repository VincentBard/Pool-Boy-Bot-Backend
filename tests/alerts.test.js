import request from "supertest";
import app from "../app.js";
import { getAuth0Token } from "./getToken.js";

let token;

beforeAll(async () => {
  token = await getAuth0Token();
});

describe("Alerts API", () => {
  it("should deny unauthenticated access", async () => {
    const res = await request(app).get("/api/alerts");
    expect(res.statusCode).toBe(401);
  });

  it("should allow authenticated access", async () => {
    const res = await request(app)
      .get("/api/alerts")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 204]).toContain(res.statusCode); // in case DB is empty
  });

  it("should create a new alert", async () => {
    const res = await request(app)
      .post("/api/alerts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "temperature",
        message: "Water is too cold",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });
});
