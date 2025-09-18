import request from "supertest";
import app from "../app.js";
import { getAuth0Token } from "./getToken.js";

let token;

beforeAll(async () => {
  token = await getAuth0Token();
});

describe("Users API", () => {
  it("should deny unauthenticated access", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(401);
  });

  it("should allow authenticated access", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(res.statusCode);
  });

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "testuser@example.com",
        name: "Test User",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });
});
