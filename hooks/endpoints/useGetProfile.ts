import { axiosInstance } from "@/services/axiosInstance";
import { UserInterface } from "@/stores/useUserStore";
import { BaseResponseInterface } from "@/types/base-response";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ProfileResponseInterface extends BaseResponseInterface<string> {
  user: UserInterface;
  access_token: string;
  refresh_token: string;
}

export const getProfile = async (): Promise<ProfileResponseInterface> => {
  const { data } = await axiosInstance.get("/v1/user");

  return data;
};

export const useGetProfile = (
  options: Omit<UseQueryOptions<ProfileResponseInterface, AxiosError>, "queryFn" | "queryKey">,
) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    ...options,
  });
};
