import axios from "axios";

export const generateAIRoadmap = (skills) => {
  return axios.post("http://localhost:5000/api/ai-roadmap", {
    skills
  });
};
