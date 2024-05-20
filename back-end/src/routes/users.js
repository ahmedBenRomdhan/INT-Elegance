var express = require("express");
var router = express();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const permission = require("../middleware/verifyPermission");
const { check } = require("express-validator");
const userTrail = require("../middleware/userTrail");

const multer = require("multer");
const path = require("path");

router.use(express.static(path.resolve(__dirname, "public")));

var storageFiles = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//define images to insert
const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storageImages = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    // verify if image is corresponds to mime type
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Mime type is invalid");
    if (isValid) {
      error = null;
    }
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

/* Create New User */
router.post(
  "/add",
  [
    check("firstName", "FirstName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("lastName", "LastName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("email", "Please provide a valid email address")
      .isEmail()
      .normalizeEmail()
      .toLowerCase(),
    check("department", "Department is required").not().isEmpty(),
    check("position", "Position is required").not().isEmpty(),
    check("roleId", "Role is required").not().isEmpty(),
  ],
  //  auth,
  //  permission,
  multer({ storage: storageImages }).single("image"),
  userController.addUser,
  userTrail
);

/* Import File  */
router.post(
  "/importFile",
  auth,
  permission,
  multer({ storage: storageFiles }).single("file"),
  userController.importFile
);

/* GET All Users */
router.get("/", auth, permission, userController.getAllUsers);

/* GET Active Users */
router.get("/active", auth, userController.getActiveUsers);

/* GET A User By Id */
router.get("/:id/getOne", auth, permission, userController.getUser);

/* GET A User Profile */
router.get("/:id/profile", auth, permission, userController.getUserProfile);

/* Update Existing User */
router.put(
  "/:id/edit",
  [
    check("firstName", "FirstName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("lastName", "LastName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("email", "Please provide a valid email address")
      .isEmail()
      .normalizeEmail()
      .toLowerCase(),
    check("departement", "Department is required").not().isEmpty(),
    check("position", "Position is required").not().isEmpty(),
    check("roleId", "Role is required").not().isEmpty(),
  ],
  auth,
  permission,
  multer({ storage: storageImages }).single("image"),
  userTrail,
  userController.updateUser
);

/* Delete Existing User */
router.delete(
  "/:id/delete",
  auth,
  permission,
  userController.deleteUser,
  userTrail
);

/* GET Project Count By User */
router.get("/countProjects", auth, userController.calculateProjectCountByUser);

/* GET Users Count By Department */
router.get(
  "/countUsersByDept",
  auth,
  userController.calculateUserCountByDepartment
);

/* GET Users Count By Department */
router.get("/countUsers", auth, userController.calculateUsersCount);

/* GET Users Count By Role */
router.get("/countUsersByRole", auth, userController.countUsersByRole);

router.get("/searchUsers", auth, userController.searchUsers);

router.put("/:id/editPassword", auth, userController.updatePassword);

/* RESTORE User By Id */
router.get(
  "/:id/restore",
  auth,
  permission,
  userController.restoreUser,
  userTrail
);

/* GET Only Available Users */
router.get("/available/:id", auth, userController.getAvailableUsers);

router.get('/search-users', auth, userController.searchUsersChat)
router.get('/search-user-conversation',auth,userController.getUserByConversation)

module.exports = router;
