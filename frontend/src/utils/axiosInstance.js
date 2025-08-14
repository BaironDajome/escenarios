// Axios centralizado
import axios from "axios";
import { API } from "./constants";

export const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});