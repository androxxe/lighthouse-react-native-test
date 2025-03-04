import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { usePostTask } from "../endpoints/usePostTask";
import { router } from "expo-router";
import { useTinybaseCategoryList } from "../tinybase/useTinybaseCategoryList";
import { useTinybaseProjectList } from "../tinybase/useTinybaseProjectList";
import { usePatchTask } from "../endpoints/usePatchTask";
import { useBottomSheetFormTaskContext } from "../stores/useBottomSheetFormTaskStore";

export const useFormTask = () => {
  const { setIsVisible, setEditValue } = useBottomSheetFormTaskContext();

  const project = useTinybaseProjectList();
  const category = useTinybaseCategoryList();

  const task = usePostTask({
    onSuccess: (data) => {
      Toast.show({
        text1: "Task created",
        text2: `Successfully created ${data.data.name} task`,
        type: "success",
      });

      router.back();
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data?.message,
        type: "error",
      });
    },
  });

  const taskEdit = usePatchTask({
    onSuccess: (data) => {
      setEditValue(undefined);
      setIsVisible(false);
      Toast.show({
        text1: "Task updated",
        text2: `Successfully updated ${data.data.name} task`,
        type: "success",
      });
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data?.message,
        type: "error",
      });
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
    taskEdit,
  };
};
