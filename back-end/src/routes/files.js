var express = require("express");
var router = express.Router();

const auth = require('../middleware/auth')
const fileController = require("../controllers/file.controller");
router.post("/upload", fileController.upload);
  router.get("/files", fileController.getListFiles);
  router.get("/files/:name",fileController.download);
  router.delete("/files/:name",auth ,fileController.remove);

  module.exports = router;