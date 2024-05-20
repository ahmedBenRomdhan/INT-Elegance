var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const permission = require("../middleware/verifyPermission");

const notificationController = require("../controllers/notification.controller");
const addNotif = require('../controllers/notification.controller');

router.post("/send",auth, notificationController.addNotif);


router.get("/get",auth, notificationController.getNotif);

router.patch("/:id/edit", auth, notificationController.editNotif)
module.exports = router;