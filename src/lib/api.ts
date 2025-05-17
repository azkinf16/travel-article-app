import axios from "axios";

const api = axios.create({
  baseURL: "https://extra-brooke-yeremiadio-46b2183e.koyeb.app", // Replace with actual API URL from Postman link
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
