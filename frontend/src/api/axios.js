import axios from "axios";

// 1. Create the axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : "/api",
});

export default instance;
