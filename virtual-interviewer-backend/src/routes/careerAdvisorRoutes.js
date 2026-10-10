const express = require("express");
const router = express.Router();
const { askCareerAdvisor } = require("../controllers/careerAdvisorController");

router.post("/ask", askCareerAdvisor);

module.exports = router;
