import { BASE_URL } from "@/config";
import axios, { AxiosResponse, AxiosError, AxiosInstance } from "axios";

const baseURL = `${BASE_URL}/api`;

const instance: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const handleSuccessResponse = (response: AxiosResponse) => {
  return response;
};

const handleErrorResponse = (error: AxiosError) => {
  if (error.response) {
    return Promise.reject(error.response.data);
  } else if (error.request) {
    return Promise.reject({ message: "No response from server" });
  } else {
    return Promise.reject({ message: "Network Error" });
  }
};

export const setHeaderConfigAxios = (token?: string) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add any request preprocessing here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(handleSuccessResponse, handleErrorResponse);

export default instance;
