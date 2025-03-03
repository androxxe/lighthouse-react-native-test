import { axiosInstance } from "@/services/axiosInstance";
import { BaseResponseInterface } from "@/types/base-response";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface CategoryResponseInterface extends BaseResponseInterface<{ id: string; name: string }[]> {}

export const getCategory = async (): Promise<CategoryResponseInterface> => {
  const { data } = await axiosInstance.get("/v1/category");

  return data;
};

export const useGetCategory = (
  options?: Omit<
    UseQueryOptions<CategoryResponseInterface, AxiosError<BaseResponseInterface<unknown>>>,
    "queryFn" | "queryKey"
  >,
) => {
  return useQuery({
    queryKey: ["category", "list"],
    queryFn: () => getCategory(),
    ...options,
  });
};
