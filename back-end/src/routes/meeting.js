var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/verifyPermission");
const meetingController = require("../controllers/meeting.controller");

/* Create New Meeting */
router.post("/add", auth, permission, meetingController.addMeeting);

/* GET All Meetings */
router.get("/", auth, permission, meetingController.getAllMeeting);

/* GET Incoming Meetings */
router.get(
  "/incoming",
  auth,
  permission,
  meetingController.getIncomingMeetings
);

/* Update Existing Meeting */
router.put("/:id/edit", auth, permission, meetingController.updateMeeting);

/* Delete Existing Meeting */
router.delete("/:id/delete", auth, permission, meetingController.deleteMeeting);

module.exports = router;
