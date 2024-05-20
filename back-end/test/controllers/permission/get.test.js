// const request = require("supertest");
// const app = require("../../../src/app"); // assuming your Node.js code is in a file called 'app.js'

// // Test GET /permissions/details/:id
// describe("GET /permissions/details/:id", () => {
//   let permissionId = "641d85f6cc55e9df2479942a";

//   it("should return the permission with the specified ID", async () => {
//     const res = await request(app).get(`/permissions/details/${permissionId}`);
//     expect(res.status).toBe(200);
//     expect(res.body.type).toBe("Success");
//     expect(res.body.results.name).toBeDefined();
//     expect(res.body.results.path).toBeDefined();
//   });

//   it("should fail to get a permission with an invalid ID", async () => {
//     const res = await request(app).get(`/permissions/details/${permissionId}`);
//     expect(res.status).toBe(404);
//     expect(res.body.type).toBe("Failed");
//     expect(res.body.message).toBe("Unable to Find the Permission");
//   });

//   it("returns an error response if an error occurs during the search", async () => {
//     const res = await request(app).get(`/permissions/details/${permissionId}`);
//     expect(res.status).toBe(500);
//     expect(res.body.type).toBe("Failed");
//     expect(res.body.message).not.toBeNull();
//   });
// });
