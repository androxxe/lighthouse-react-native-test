import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface PatchCategoryResponseInterface extends BaseResponseInterface<{ id: string; name: string }> {}

interface PatchCategoryPayloadInterface {
  project_id: string;
  name: string;
}

export const patchCategory = async (
  payload: PatchCategoryPayloadInterface,
): Promise<PatchCategoryResponseInterface> => {
  const { data } = await axiosInstance.patch(`/v1/category/${payload.project_id}`, {
    name: payload.name,
  });

  return data;
};

export const usePatchCategory = (
  options: Omit<
    UseMutationOptions<
      PatchCategoryResponseInterface,
      AxiosError<BaseResponseErrorInterface<unknown>>,
      PatchCategoryPayloadInterface
    >,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["category", "patch"],
    mutationFn: (payload: PatchCategoryPayloadInterface) => patchCategory(payload),
    ...options,
  });
};
