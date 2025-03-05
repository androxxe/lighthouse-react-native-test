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

interface CreateTaskResponseInterface
  extends BaseResponseInterface<{
    id: string;
    name: string;
    description: string;
    due_date: string;
    priority: Priority;
    status: Status;
    created_at: string;
    updated_at: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    project: ProjectResponseInterface["data"][0] | null;
    task_categories: CategoryResponseInterface["data"];
    total_comment: number;
  }> {}

type CreateTaskPayload = yup.InferType<typeof taskCreateSchema>;

export const postTask = async (payload: CreateTaskPayload): Promise<CreateTaskResponseInterface> => {
  const { data } = await axiosInstance.post("/v1/task", {
    ...payload,
    category_ids: payload.category_ids?.map((item) => item.id),
  });

  return data;
};

export const usePostTask = (
  options: Omit<
    UseMutationOptions<CreateTaskResponseInterface, AxiosError<BaseResponseErrorInterface<unknown>>, CreateTaskPayload>,
    "mutationFn" | "mutationKey"
  >,
) => {
  return useMutation({
    mutationKey: ["task", "create"],
    mutationFn: (payload: CreateTaskPayload) => postTask(payload),
    ...options,
  });
};
