var express = require("express");
var router = express.Router();

const permissionController = require("../controllers/permission.controller");

/* GET All Permissions */
router.get("/", permissionController.getAllPermissions);

/* GET Permission By Id */
router.get("/details/:id", permissionController.getPermission);

/* Create New Permission */
router.post("/add", permissionController.addPermission);

/* Update Existing Permission */
router.put("/update/:id", permissionController.updatePermission);

/* Delete Existing Permission */
router.delete("/delete/:id", permissionController.deletePermission);

module.exports = router;
