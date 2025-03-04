import { Priority } from "@/enums/priority";
import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { taskCreateSchema } from "@/yup-schemas/task-create";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as yup from "yup";
import { ProjectResponseInterface } from "./useGetProject";
import { CategoryResponseInterface } from "./useGetCategory";
import { Status } from "@/enums/status";

interface PatchTaskResponseInterface
  extends BaseResponseInterface<{
    id: string;
    name: string;
    description: string;
    due_date: string;
    priority: Priority;
    status: Status;
    created_at: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    project: ProjectResponseInterface["data"][0] | null;
    task_categories: CategoryResponseInterface["data"];
  }> {}

type PatchTaskPayload = Partial<yup.InferType<typeof taskCreateSchema>> & { task_id: string };

export const patchTask = async (payload: PatchTaskPayload): Promise<PatchTaskResponseInterface> => {
  const { data } = await axiosInstance.patch(`/v1/task/${payload.task_id}`, payload);

  return data;
};

export const usePatchTask = (
  options: Omit<
    UseMutationOptions<PatchTaskResponseInterface, AxiosError<BaseResponseErrorInterface<unknown>>, PatchTaskPayload>,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["task", "patch"],
    mutationFn: (payload: PatchTaskPayload) => patchTask(payload),
    ...options,
  });
};
