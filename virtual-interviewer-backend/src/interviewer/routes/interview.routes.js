const express = require("express");
const multer = require("multer");
const upload = multer();

const controller = require("../controllers/interview.controller");

const router = express.Router();

router.post("/start", controller.startInterview);
router.post("/answer", controller.submitAnswer);
router.post("/resume/upload", upload.single("resume"), controller.uploadResume);

router.post("/feedback", controller.generateFeedback);   // NEW

module.exports = router;