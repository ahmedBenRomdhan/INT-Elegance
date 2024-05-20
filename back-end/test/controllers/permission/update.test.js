// const request = require("supertest");
// const app = require("../../../src/app"); // assuming your Node.js code is in a file called 'app.js'

// // Test PUT /permissions/update/:id
// describe("PUT /permissions/update/:id", () => {
//   const updatedPermission = {
//     name: "Updated10 Test Permission",
//     path: "/updated10-test",
//   };
//   let permissionId = "642178f28ddf30d92399b38f";
//   it("should update the permission with the specified ID", async () => {
//     const res = await request(app)
//       .put(`/permissions/update/${permissionId}`)
//       .send(updatedPermission);

//     expect(res.status).toBe(200);
//     expect(res.body.type).toBe("Success");
//     expect(res.body.message).toBe("Permission Updated Successfully !");
//     expect(res.body.results).toHaveProperty("name", updatedPermission.name);
//     expect(res.body.results).toHaveProperty("path", updatedPermission.path);
//   });

//   it("should fail to update a permission with an invalid ID", async () => {
//     const res = await request(app)
//       .put(`/permissions/update/${permissionId}`)
//       .send(updatedPermission);
//     expect(res.status).toBe(404);
//     expect(res.body.type).toBe("Failed");
//     expect(res.body.message).toBe("Unable to Find the Permission");
//   });

//   it("returns an error response if an error occurs during the update operation", async () => {
//     const res = await request(app)
//       .put(`/permissions/update/${permissionId}`)
//       .send(updatedPermission);
//     expect(res.status).toBe(500);
//     expect(res.body.type).toBe("Failed");
//     expect(res.body.message).toBe("Unable to Update the Permission");
//   });
// });
