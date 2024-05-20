var express = require("express");
var router = express.Router();
const projectTrail = require("../middleware/projectTrail");
const auth = require("../middleware/auth");
const projectController = require("../controllers/project.controller");
const permission = require("../middleware/verifyPermission");

/* Search Projects */
router.get("/search", auth, projectController.getProjectByAttribute);

/* Search Projects */
router.get(
  "/searchByUser/:id",
  auth,
  projectController.getUserProjectByAttribute
);

/* GET Projects Classification By Type */
router.get("/statisticsByType", auth, projectController.getProjectsByType);

/* GET Projects Classification By Type ByUser */
router.get(
  "/statisticsByTypeByUser/:id",
  auth,
  projectController.getProjectsByTypeByUser
);

/* GET Projects Classification By Status */
router.get("/statisticsByStatus", auth, projectController.getProjectsByStatus);

/* GET Projects Classification By Status */
router.get(
  "/statisticsByStatusByUser/:id",
  auth,
  projectController.getProjectsByStatusByUser
);

/* GET Projects Statistics */
router.get("/statistics", auth, projectController.getProjectsStatistics);

/* Calculate Project Progress */
router.get(
  "/:id/calculateProgress",
  auth,
  projectController.calculateProjectProgress
);

/* Calculate users Progress */
router.get(
  "/:id/calculateUsersProgress",
  auth,
  projectController.calculateUsersProgress
);

/* GET Tasks By Projects */
router.get("/:id/tasks", auth, projectController.getTasksProject);

/* GET Project Count By User */
router.get(
  "/counProjectsByUser/:id",
  auth,
  projectController.calculateProjectsCountByUser
);

/* GET All Projects */
router.get("/", auth, permission, projectController.getAllProject);

/* GET Projects By User */
router.get("/:id", auth, projectController.getProjectsByUser);

/* GET Project By Id */
router.get("/:id/getOne", auth, permission, projectController.getProject);

/* Create New Project */
router.post(
  "/add",
  auth,
  permission,
  projectController.addProject,
  projectTrail
);

/* Update Existing Project */
router.put(
  "/:id/edit",
  auth,
  permission,
  projectTrail,
  projectController.updateProject
);

/* Delete Existing Project */
router.delete(
  "/:id/delete",
  auth,
  permission,
  projectController.deleteProject,
  projectTrail
);

/* Update Existing Project By Adding Users */
router.put(
  "/:id/affectUsersProject",
  auth,
  // permission,
  projectController.affectUsersProject
);

module.exports = router;
