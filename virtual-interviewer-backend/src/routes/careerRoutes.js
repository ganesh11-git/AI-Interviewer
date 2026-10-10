const express = require("express");
const router = express.Router();

const { selectCareer } = require("../controllers/careerController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/select", authMiddleware, selectCareer);

module.exports = router;
