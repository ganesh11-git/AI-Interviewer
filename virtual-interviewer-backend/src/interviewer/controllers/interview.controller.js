const axios = require("axios");
const FormData = require("form-data");

const {
  generateQuestion,
  evaluateAnswer,
} = require("../services/interview.service");

exports.uploadResume = async (req, res) => {
  try {
    const form = new FormData();
    form.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      "http://localhost:8001/resume/upload",
      form,
      { headers: form.getHeaders() }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resume upload failed" });
  }
};

exports.startInterview = async (req, res) => {
  try {
    const data = await generateQuestion(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to start interview" });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const data = await evaluateAnswer(req.body.answer);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to process answer" });
  }
};

exports.generateFeedback = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8001/interview/feedback",
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Feedback generation failed" });
  }
};