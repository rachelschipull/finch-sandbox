const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");

router.get('/', mainController.getIndex)
router.get('/', mainController.getData)

module.exports = router;
