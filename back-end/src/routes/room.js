var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");

const roomController = require("../controllers/room.controller");

/* GET All Rooms */
router.get("/", auth, roomController.getAllRooms);

/* GET Available Rooms */
router.get("/available", auth, roomController.getAvailableRooms);

module.exports = router;
