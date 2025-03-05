import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface DeleteTaskResponseInterface extends BaseResponseInterface<{ id: string; name: string }> {}

interface DeleteTaskPayloadInterface {
  task_id: string;
}

export const deleteTask = async (payload: DeleteTaskPayloadInterface): Promise<DeleteTaskResponseInterface> => {
  const { data } = await axiosInstance.delete(`/v1/task/${payload.task_id}`);

  return data;
};

export const useDeleteTask = (
  options: Omit<
    UseMutationOptions<
      DeleteTaskResponseInterface,
      AxiosError<BaseResponseErrorInterface<unknown>>,
      DeleteTaskPayloadInterface
    >,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["task", "delete"],
    mutationFn: (payload: DeleteTaskPayloadInterface) => deleteTask(payload),
    ...options,
  });
};
