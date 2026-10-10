import axios from "axios";

export const askCareerAdvisor = async (message) => {
  const res = await axios.post("http://localhost:5000/api/career-advisor/ask", {
    message,
  });

  return res.data.reply;
};
