var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/verifyPermission");
const phaseController = require("../controllers/phase.controller");
const phaseTrail = require("../middleware/phaseTrail");

/* Create New Phase */
router.post("/add", auth, permission, phaseController.addPhase, phaseTrail);

/* Get All Phases */
router.get("/:id", auth, phaseController.getPhasesByProject);

/* Get Phase By Id */
router.get("/:id/getOne", auth, phaseController.getPhase);

/* Update Existing Phase */
router.put(
  "/:id/edit",
  auth,
  permission,
  phaseController.updatePhase,
  phaseTrail
);

/* Delete Existing Phase */
router.delete(
  "/:id/delete",
  auth,
  permission,
  phaseController.deletePhase,
  phaseTrail
);

module.exports = router;
