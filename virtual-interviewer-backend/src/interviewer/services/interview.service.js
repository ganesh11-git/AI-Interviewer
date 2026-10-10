const axios = require("axios");

const PY_API = "http://localhost:8001";

/**
 * Start interview (calls FastAPI)
 */

exports.uploadResume = async (formData) => {
  const res = await axios.post(
    `${PY_API}/resume/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};


exports.generateQuestion = async (data) => {
  const res = await axios.post(`${PY_API}/interview/start`, data);
  return res.data;
};



exports.extractResume = async (data) => {
  const res = await axios.post(`${PY_API}/resume/extract`, data);
  return res.data;
};


/**
 * Send answer (calls FastAPI)
 */
exports.evaluateAnswer = async (answer) => {
  const res = await axios.post(`${PY_API}/interview/answer`, { answer });
  return res.data;
};