// import request from "supertest";
// import app from "../../../src/app"; // assuming your Node.js code is in a file called 'app.js'

// // Test GET /permissions/list
// describe("GET /permissions/list", () => {
//   it("should return all permissions", async () => {
//     const res = await request(app).get("/permissions/list");
//     expect(res.status).toBe(200);
//     expect(res.body.type).toBe("Success");
//     expect(Array.isArray(res.body.results)).toBe(true);
//   });

//   it("returns an error response if there is no permissions", async () => {
//     const res = await request(app).get("/permissions/list");
//     expect(res.status).toBe(404);
//     expect(res.body.type).toBe("Failed");
//     expect(res.body.message).toBe("Unable to Find Permissions");
//   });

//   it("returns an error response if an error occurs during the search", async () => {
//     const res = await request(app).get("/permissions/list");
//     expect(res.status).toBe(500);
//     expect(res.body.type).toBe("Failed");
//     expect(res.body.message).not.toBeNull();
//   });
// });
