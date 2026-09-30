import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getHealth = () => API.get("/health");

export const getMetrics = () => API.get("/metrics");

export const getForecast = () => API.get("/forecast");

export default API;