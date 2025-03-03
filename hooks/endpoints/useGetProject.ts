import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseErrorInterface, BaseResponseInterface } from "@/types/base-response";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface ProjectResponseInterface extends BaseResponseInterface<{ id: string; name: string }[]> {}

export const getProject = async (): Promise<ProjectResponseInterface> => {
  const { data } = await axiosInstance.get("/v1/project");

  return data;
};

export const useGetProject = (
  options?: Omit<
    UseQueryOptions<ProjectResponseInterface, AxiosError<BaseResponseErrorInterface<unknown>>>,
    "queryFn" | "queryKey"
  >,
) => {
  return useQuery({
    queryKey: ["project", "list"],
    queryFn: () => getProject(),
    ...options,
  });
};
