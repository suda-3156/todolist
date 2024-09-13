import { getTokenFromStorage } from "@/lib/token"
import axios from "axios"
import { ApiError, ValidationApiError } from "./type"



const baseURL = import.meta.env.VITE_SERVER_URL


export const apiClient = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
  timeout: 3000,
})


apiClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  switch (error?.response?.data?.status) {
    case 401:
      throw new ApiError(error.response.data)
    case 403:
      throw new ApiError(error.response.data)
    case 422:
      throw new ValidationApiError(error.response.data)
    case 500:
      throw new ApiError(error.response.data)
    default:
      throw new ApiError({ title: "UNKNOWN_ERROR", category: "UNKNOWN_ERROR" })
  }
})


apiClient.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.set('authorization', `Bearer ${getTokenFromStorage().accessToken}`);
  }
  return config;
})