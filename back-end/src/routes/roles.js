var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/verifyPermission");

const roleController = require("../controllers/role.controller");

/* GET All Roles */
router.get("/", auth, permission, roleController.getAllRoles);

/* GET Role By Id */
router.get("/:id/getOne", roleController.getRole);

/* Create New Role */
router.post("/add",
  //auth, 
  //permission, 
 roleController.addRole);

/* Update Existing Role */
router.put("/:id/edit", auth, permission, roleController.updateRole);

/* Delete Existing Role */
router.delete("/:id/delete", auth, permission, roleController.deleteRole);

module.exports = router;
