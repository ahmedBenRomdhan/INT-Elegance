var express = require("express");
var router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
/* Signin */
router.post("/signin", authController.signin);

/* Forgot Password */
router.post("/forgot", authController.forgot);

/*Reset Password */
router.post("/reset/:id/:token", authController.reset);

/* Refresh */
router.post("/refresh", authController.refresh);

router.get("/home", auth, authController.home);

module.exports = router;
