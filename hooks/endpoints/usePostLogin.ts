import { axiosInstance } from "@/services/axiosInstance";
import { UserInterface } from "@/stores/useUserStore";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface LoginResponseInterface
  extends BaseResponseInterface<{ user: UserInterface; access_token: string; refresh_token: string }> {}

interface LoginPayloadInterface {
  email: string;
  password: string;
}

export const postLogin = async (payload: LoginPayloadInterface): Promise<LoginResponseInterface> => {
  const { data } = await axiosInstance.post("/v1/auth/login", payload);

  return data;
};

export const usePostLogin = (
  options: Omit<
    UseMutationOptions<LoginResponseInterface, AxiosError<BaseResponseErrorInterface<unknown>>, LoginPayloadInterface>,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (payload: LoginPayloadInterface) => postLogin(payload),
    ...options,
  });
};
