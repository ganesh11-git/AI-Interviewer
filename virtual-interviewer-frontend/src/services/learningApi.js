import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
export const saveProfile = (formData) => {
  return API.post("/profile/save", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const BASE_URL = "http://localhost:5000";

export const getTopics = async (subject) => {
  const res = await fetch(`${BASE_URL}/api/learning/topics/${subject}`);
  return res.json();
};

export const getTopicContent = async (topic) => {
  const res = await fetch(`${BASE_URL}/api/learning/content/${topic}`);
  return res.json();
};
