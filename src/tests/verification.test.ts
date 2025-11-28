import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/database";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Real World Scenario Verification", () => {
  let aliceToken: string;
  let bobToken: string;
  let groceryTaskId: number;
  let reportTaskId: number;

  it("Scenario: User Registration", async () => {
    // Register Alice
    const aliceRes = await request(app).post("/auth/register").send({
      username: "alice_wonderland",
      password: "securePassword123",
    });
    expect(aliceRes.status).toBe(201);
    console.log("Registered Alice:", aliceRes.body);

    // Register Bob
    const bobRes = await request(app).post("/auth/register").send({
      username: "bob_builder",
      password: "canWeFixIt?",
    });
    expect(bobRes.status).toBe(201);
    console.log("Registered Bob:", bobRes.body);
  });

  it("Scenario: User Login", async () => {
    // Login Alice
    const aliceLogin = await request(app).post("/auth/login").send({
      username: "alice_wonderland",
      password: "securePassword123",
    });
    expect(aliceLogin.status).toBe(200);
    aliceToken = aliceLogin.body.token;
    console.log("Alice Logged In. Token acquired.");

    // Login Bob
    const bobLogin = await request(app).post("/auth/login").send({
      username: "bob_builder",
      password: "canWeFixIt?",
    });
    expect(bobLogin.status).toBe(200);
    bobToken = bobLogin.body.token;
    console.log("Bob Logged In. Token acquired.");
  });

  it("Scenario: Alice manages her tasks", async () => {
    // Alice creates a task
    const task1 = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${aliceToken}`)
      .send({
        title: "Buy Groceries",
        description: "Milk, Eggs, Bread, and Coffee",
        status: "todo",
        due_date: "2023-12-31",
      });
    expect(task1.status).toBe(201);
    groceryTaskId = task1.body.id;
    console.log("Alice created task 'Buy Groceries':", task1.body);

    // Alice creates another task
    const task2 = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${aliceToken}`)
      .send({
        title: "Write Monthly Report",
        description: "Financial summary for November",
        status: "in-progress",
      });
    expect(task2.status).toBe(201);
    reportTaskId = task2.body.id;
    console.log("Alice created task 'Write Monthly Report':", task2.body);

    // Alice lists her tasks
    const list = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${aliceToken}`);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(2);
    console.log("Alice's Task List:", list.body);

    // Alice updates Grocery task to DONE
    const update = await request(app)
      .put(`/tasks/${groceryTaskId}`)
      .set("Authorization", `Bearer ${aliceToken}`)
      .send({
        status: "done",
      });
    expect(update.status).toBe(200);
    expect(update.body.status).toBe("done");
    console.log("Alice updated 'Buy Groceries' to DONE:", update.body);
  });

  it("Scenario: Data Isolation (Bob cannot see Alice's tasks)", async () => {
    const bobList = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${bobToken}`);
    expect(bobList.status).toBe(200);
    expect(bobList.body).toHaveLength(0);
    console.log("Bob's Task List (Should be empty):", bobList.body);

    // Bob tries to access Alice's task
    const bobTryGet = await request(app)
      .get(`/tasks/${groceryTaskId}`)
      .set("Authorization", `Bearer ${bobToken}`);
    expect(bobTryGet.status).toBe(404); // Or 403 depending on implementation, currently 404 "Task not found" for user
    console.log("Bob tried to fetch Alice's task, got:", bobTryGet.status);
  });

  it("Scenario: Soft Delete", async () => {
    // Alice deletes the report task
    const del = await request(app)
      .delete(`/tasks/${reportTaskId}`)
      .set("Authorization", `Bearer ${aliceToken}`);
    expect(del.status).toBe(204);
    console.log("Alice deleted 'Write Monthly Report'");

    // Verify it's gone from list
    const list = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${aliceToken}`);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(groceryTaskId);
    console.log("Alice's list after delete:", list.body);
  });
});
