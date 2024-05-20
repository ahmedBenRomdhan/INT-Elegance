// const request = require("supertest");
// const app = require("../../../src/app"); // assuming your Node.js code is in a file called 'app.js'

// // Test DELETE /permissions/delete/:id
// describe("DELETE /permissions/delete/:id", () => {
//   let permissionId = "6422b753adb1c872b23dddd8";

//   it("should delete the permission with the specified ID", async () => {
//     const res = await request(app).delete(
//       `/permissions/delete/${permissionId}`
//     );

//     expect(res.status).toBe(200);
//     expect(res.body.type).toBe("Success");
//     expect(res.body.message).toBe("Permission Deleted Successfully !");
//     expect(res.body.results.name).toBeDefined();
//     expect(res.body.results.path).toBeDefined();
//   });

//   it("should fail to delete a permission with an invalid ID", async () => {
//     const res = await request(app).delete(
//       `/permissions/delete/${permissionId}`
//     );
//     expect(res.status).toBe(404);
//     expect(res.body.type).toBe("Failed");
//     expect(res.body.message).toBe("Unable to Find the Permission");
//   });

//   it("returns an error response if an error occurs during the delete operation", async () => {
//     const res = await request(app).delete(
//       `/permissions/delete/${permissionId}`
//     );
//     expect(res.status).toBe(500);
//     expect(res.body.type).toBe("Failed");
//     expect(res.body.message).toBe("Unable to Delete the Permission");
//   });
// });
