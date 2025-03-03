import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface PatchProjectResponseInterface extends BaseResponseInterface<{ id: string; name: string }> {}

interface PatchProjectPayloadInterface {
  project_id: string;
  name: string;
}

export const patchProject = async (payload: PatchProjectPayloadInterface): Promise<PatchProjectResponseInterface> => {
  const { data } = await axiosInstance.patch(`/v1/project/${payload.project_id}`, {
    name: payload.name,
  });

  return data;
};

export const usePatchProject = (
  options: Omit<
    UseMutationOptions<
      PatchProjectResponseInterface,
      AxiosError<BaseResponseErrorInterface<unknown>>,
      PatchProjectPayloadInterface
    >,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["project", "patch"],
    mutationFn: (payload: PatchProjectPayloadInterface) => patchProject(payload),
    ...options,
  });
};
