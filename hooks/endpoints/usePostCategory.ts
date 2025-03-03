import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface CreateCategoryResponseInterface extends BaseResponseInterface<{ id: string; name: string }> {}

interface CreateCategoryPayloadInterface {
  name: string;
}

export const postCategory = async (
  payload: CreateCategoryPayloadInterface,
): Promise<CreateCategoryResponseInterface> => {
  const { data } = await axiosInstance.post("/v1/category", payload);

  return data;
};

export const usePostCategory = (
  options: Omit<
    UseMutationOptions<
      CreateCategoryResponseInterface,
      AxiosError<BaseResponseErrorInterface<unknown>>,
      CreateCategoryPayloadInterface
    >,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["category", "create"],
    mutationFn: (payload: CreateCategoryPayloadInterface) => postCategory(payload),
    ...options,
  });
};
