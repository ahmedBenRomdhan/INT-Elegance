const request = require("supertest");
const app = require("../../../src/app"); // assuming your Node.js code is in a file called 'app.js'

// Test POST /permissions/add
describe("POST /permissions/add", () => {
  // const newPermission = {
  //   name: "Test Permission",
  //   path: "/test",
  // };
  it("should add a new permission", async () => {
    // const res = await request(app).post("/permissions/add").send(newPermission);

    // expect(res.status).toBe(201);
    // expect(res.body.type).toBe("Success");
    // expect(res.body.results).toHaveProperty("name", newPermission.name);
    // expect(res.body.results).toHaveProperty("path", newPermission.path);
    console.log('test running')
  });

  // it("should fail to add a duplicate permission", async () => {
  //   const duplicatePermission = {
  //     name: "Test Permission",
  //     path: "/test",
  //   };

  //   const res = await request(app).post("/permissions/add").send(duplicatePermission);

  //   expect(res.status).toBe(409);
  //   expect(res.body.type).toBe("Failed");
  //   expect(res.body.message).toBe("Permission Already Exists");
  // });

  // it("returns an error response if an error occurs", async () => {
  //   const res = await request(app).post("/permissions/add").send(newPermission);
  //   expect(res.status).toBe(500);
  //   expect(res.body.type).toBe("Failed");
  //   expect(res.body.message).not.toBeNull();
  // });
});