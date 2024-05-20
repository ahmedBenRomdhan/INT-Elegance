var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");

const multer = require("multer");
const path = require("path");

router.use(express.static(path.resolve(__dirname, "public")));
const messageController = require("../controllers/message.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
      console.log(file.originalname);
      cb(null, file.originalname);
    },
  });
  const maxSize = 2 * 1024 * 1024;
router.post('/create', auth, messageController.createConversation)
router.post("/send", auth,messageController.sendMessage)
router.get("/get", auth,messageController.getUserConversation);
router.get('/:id/getOne', auth, messageController.getConvById);
router.put('/viewed', auth, messageController.viewed)
// router.post('/uploadFile', 
// // auth,
//  multer({storage: storage, limits: { fileSize: maxSize },}).single('file'),
//   messageController.uploadAndReturnFileMetadata)
module.exports = router;


