import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/profile",
});


export const saveProfile = (formData) => {
  return API.post("/save", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const getProfile = (email) => {
  return API.get(`/${email}`);
};
