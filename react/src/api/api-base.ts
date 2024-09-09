import { getAccessToken } from "@/components/utils/token"
import axios from "axios"
import { ErrorType, ProblemDetails, ValidationProblemDetails } from "./type"
import { ZodError } from "zod"

const baseURL = import.meta.env.VITE_SERVER_URL

export const apiClient = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: { "Content-Type" : "application/json" },
  withCredentials: true,
  timeout: 3000,
})

export class UnknownApiError extends Error {}

export class DetailedApiError extends Error {
  title: string
  type: ErrorType
  status?: number
  constructor({title, detail, type, status}:ProblemDetails) {
    super(detail)
    this.title = title
    this.type = type
    this.status = status
  }
}

export class ValidationApiError extends DetailedApiError {
  errors?: ZodError
  constructor({title, detail, status, errors}: ValidationProblemDetails){
    super({title, detail, type: "VALIDATION_ERROR", status})
    this.errors = errors
  }
  
}

apiClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  switch (error?.response?.status) {
    case 401:
      throw new DetailedApiError(error.response.data)
    case 403:
      throw new DetailedApiError(error.response.data)
    case 422:
      throw new ValidationApiError(error.response.data)
    case 500:
      throw new DetailedApiError(error.response.data)
    default:
      throw new UnknownApiError("UNKNOWN_API_ERROR")
  }
})

apiClient.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.set('Authorization', `Bearer ${getAccessToken()}`);
  }
  return config;
})