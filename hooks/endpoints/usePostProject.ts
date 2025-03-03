import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface CreateProjectResponseInterface extends BaseResponseInterface<{ id: string; name: string }> {}

interface CreateProjectPayloadInterface {
  name: string;
}

export const postProject = async (payload: CreateProjectPayloadInterface): Promise<CreateProjectResponseInterface> => {
  const { data } = await axiosInstance.post("/v1/project", payload);

  return data;
};

export const usePostProject = (
  options: Omit<
    UseMutationOptions<
      CreateProjectResponseInterface,
      AxiosError<BaseResponseErrorInterface<unknown>>,
      CreateProjectPayloadInterface
    >,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["project", "create"],
    mutationFn: (payload: CreateProjectPayloadInterface) => postProject(payload),
    ...options,
  });
};
