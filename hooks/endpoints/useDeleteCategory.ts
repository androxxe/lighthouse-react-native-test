import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface DeleteCategoryResponseInterface extends BaseResponseInterface<{ id: string; name: string }> {}

interface DeleteCategoryPayloadInterface {
  category_id: string;
}

export const deleteCategory = async (
  payload: DeleteCategoryPayloadInterface,
): Promise<DeleteCategoryResponseInterface> => {
  const { data } = await axiosInstance.delete(`/v1/Category/${payload.category_id}`);

  return data;
};

export const useDeleteCategory = (
  options: Omit<
    UseMutationOptions<
      DeleteCategoryResponseInterface,
      AxiosError<BaseResponseErrorInterface<unknown>>,
      DeleteCategoryPayloadInterface
    >,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["category", "delete"],
    mutationFn: (payload: DeleteCategoryPayloadInterface) => deleteCategory(payload),
    ...options,
  });
};
