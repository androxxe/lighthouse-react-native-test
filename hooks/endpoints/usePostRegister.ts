import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { registerSchema } from "@/yup-schemas/register";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as yup from "yup";

interface RegisterResponseInterface extends BaseResponseInterface<string> {
  email: string;
}

type RegisterPayload = yup.InferType<typeof registerSchema>;

export const postRegister = async (payload: RegisterPayload): Promise<RegisterResponseInterface> => {
  const { data } = await axiosInstance.post("/v1/auth/register", payload);

  return data;
};

export const usePostRegister = (
  options: Omit<
    UseMutationOptions<RegisterResponseInterface, AxiosError<BaseResponseErrorInterface<unknown>>, RegisterPayload>,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: (payload: RegisterPayload) => postRegister(payload),
    ...options,
  });
};
