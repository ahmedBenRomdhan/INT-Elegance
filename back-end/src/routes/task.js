var express = require("express");
var router = express.Router();
const taskTrail = require("../middleware/taskTrail");
const auth = require("../middleware/auth");
const permission = require("../middleware/verifyPermission");

const taskController = require("../controllers/task.controller");

/* Search Tasks By Project By User */
router.get("/searchByProject", auth, taskController.getTasksByProjectByUser);

/* Search Tasks */
router.get("/search", auth, taskController.getTasksByAttribute);

/* Create New Task */
router.post("/add", auth, permission, taskController.addTask, taskTrail);

/* GET Tasks Statistics By User */
router.get("/statistics/:id", auth, taskController.getStatisticsTasksByUser);

/* Get Tasks By Phase */
router.get("/:id", auth, taskController.getTasksByPhase);

/* Get Tasks By User */
router.get("/getUserTasks/:id", auth, taskController.getTasksByUser);

/* Get Children Tasks */
router.get("/getChildren/:id", auth, taskController.getChildrenTasks);

/* Get Task By Id */
router.get("/:id/getOne", auth, taskController.getTask);

/* Delete Task By Id */
router.delete(
  "/:id/delete",
  auth,
  permission,
  taskController.deleteTask,
  taskTrail
);

/* Update Task By Id */
router.put("/:id/edit", auth, permission, taskTrail, taskController.editTask);

/* Create child task */
router.post(
  "/addChild/:parentId",
  auth,
  permission,
  taskController.addChild,
  taskTrail
);

module.exports = router;
