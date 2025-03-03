import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface DeleteProjectResponseInterface extends BaseResponseInterface<{ id: string; name: string }> {}

interface DeleteProjectPayloadInterface {
  project_id: string;
}

export const deleteProject = async (
  payload: DeleteProjectPayloadInterface,
): Promise<DeleteProjectResponseInterface> => {
  const { data } = await axiosInstance.delete(`/v1/project/${payload.project_id}`);

  return data;
};

export const useDeleteProject = (
  options: Omit<
    UseMutationOptions<
      DeleteProjectResponseInterface,
      AxiosError<BaseResponseErrorInterface<unknown>>,
      DeleteProjectPayloadInterface
    >,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["project", "delete"],
    mutationFn: (payload: DeleteProjectPayloadInterface) => deleteProject(payload),
    ...options,
  });
};
