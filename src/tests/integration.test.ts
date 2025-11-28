import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/database";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Integration Tests", () => {
  let token: string;
  let taskId: number;

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("username", "testuser");
  });

  it("should login the user", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "This is a test task",
        status: "todo",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Test Task");
    taskId = res.body.id;
  });

  it("should get all tasks", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a single task", async () => {
    const res = await request(app)
      .get(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", taskId);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "in-progress",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "in-progress");
  });

  it("should soft delete a task", async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);

    // Verify soft delete
    const checkRes = await request(app)
      .get(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(checkRes.status).toBe(404);
  });
});
