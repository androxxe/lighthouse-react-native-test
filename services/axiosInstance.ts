import { useUserStore } from "@/hooks/stores/useUserStore";
import { config } from "../config";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const baseHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const axiosBaseConfigOptions: AxiosRequestConfig = {
  timeout: 30000,
  headers: baseHeaders,
};

export const axiosInterceptorRequest = (headerConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = useUserStore.getState().token;

  if (token) {
    headerConfig.headers.Authorization = `Bearer ${token}`;
  }

  // No need to return a new object, just return the modified headerConfig
  return headerConfig;
};

export const axiosInterceptorResponseError = async ({ error }: { error: AxiosError; instance: AxiosInstance }) => {
  return Promise.reject(error);
};

const instanceInstance: AxiosRequestConfig = {
  ...axiosBaseConfigOptions,
  baseURL: config.API_URL,
};

export const axiosInstance = axios.create(instanceInstance);

axiosInstance.interceptors.request.use(axiosInterceptorRequest);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    axiosInterceptorResponseError({
      error,
      instance: axiosInstance,
    }),
);
