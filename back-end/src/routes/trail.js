var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/verifyPermission");

const trailController = require("../controllers/trail.controller");

/* GET All Trails Users */
router.get("/users", auth, permission, trailController.getAllTrailsUsers);

/* GET All Trails By Project */
router.get(
  "/project/:id",
  auth,
  permission,
  trailController.getAllTrailsProject
);

/* GET All Trails By Task */
router.get("/task/:id", auth, permission, trailController.getAllTrailsTask);

module.exports = router;
