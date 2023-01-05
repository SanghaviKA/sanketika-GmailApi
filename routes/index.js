var express = require("express");
const controller = require("../controllers/gmailApi");
const router = express.Router();

module.exports = router;
router.post("/api/v1/mails/:id", controller.auth);
