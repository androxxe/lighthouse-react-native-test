import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useGetProject } from "../endpoints/useGetProject";
import { useGetCategory } from "../endpoints/useGetCategory";
import { usePostTask } from "../endpoints/usePostTask";
import { router } from "expo-router";

export const useCreateTask = () => {
  const project = useGetProject();

  const category = useGetCategory();

  const task = usePostTask({
    onSuccess: (data) => {
      Toast.show({
        text1: "Task created",
        text2: `Successfully created ${data.data.name} task`,
        type: "success",
      });

      router.back();
    },
  });

  useEffect(() => {
    if (project.error) {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: project.error.response?.data?.message,
        type: "error",
      });
    }
  }, [project.error]);

  useEffect(() => {
    if (category.error) {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: category.error.response?.data?.message,
        type: "error",
      });
    }
  }, [category.error]);

  return {
    project,
    category,
    task,
  };
};
