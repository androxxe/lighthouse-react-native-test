import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ValidateTokenResponseInterface extends BaseResponseInterface<unknown> {}

export const validateToken = async (): Promise<ValidateTokenResponseInterface> => {
  const { data } = await axiosInstance.get("/v1/auth/validate");

  return data;
};

export const useGetValidateToken = (
  options: Omit<UseMutationOptions<ValidateTokenResponseInterface, AxiosError>, "mutationFn" | "mutationKey">,
) => {
  return useMutation({
    mutationKey: ["auth", "validate-token"],
    mutationFn: () => validateToken(),
    ...options,
  });
};
