import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { usePostTask } from "../endpoints/usePostTask";
import { router } from "expo-router";
import { useTinybaseCategoryList } from "../tinybase/useTinybaseCategoryList";
import { useTinybaseProjectList } from "../tinybase/useTinybaseProjectList";
import { usePatchTask } from "../endpoints/usePatchTask";
import { useBottomSheetFormTaskContext } from "../stores/useBottomSheetFormTaskStore";
import { PROJECT_LIST_QUERY_KEY } from "../endpoints/useGetProject";
import { usePatchProject } from "../endpoints/usePatchProject";
import { usePostProject } from "../endpoints/usePostProject";
import { useDeleteCategory } from "../endpoints/useDeleteCategory";
import { CATEGORY_LIST_QUERY_KEY } from "../endpoints/useGetCategory";
import { usePatchCategory } from "../endpoints/usePatchCategory";
import { usePostCategory } from "../endpoints/usePostCategory";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProject } from "../endpoints/useDeleteProject";

export const useFormTask = () => {
  const { setIsVisible, setEditValue } = useBottomSheetFormTaskContext();

  const project = useTinybaseProjectList();
  const category = useTinybaseCategoryList();

  const taskCreate = usePostTask({
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

  const queryClient = useQueryClient();

  const categoryCreate = usePostCategory({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_LIST_QUERY_KEY,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data.message,
        type: "error",
      });
    },
  });

  const categoryPatch = usePatchCategory({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_LIST_QUERY_KEY,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data.message,
        type: "error",
      });
    },
  });

  const categoryDelete = useDeleteCategory({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_LIST_QUERY_KEY,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data.message,
        type: "error",
      });
    },
  });

  const projectCreate = usePostProject({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_LIST_QUERY_KEY,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data.message,
        type: "error",
      });
    },
  });

  const projectPatch = usePatchProject({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_LIST_QUERY_KEY,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data.message,
        type: "error",
      });
    },
  });

  const projectDelete = useDeleteProject({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_LIST_QUERY_KEY,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data.message,
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
    taskCreate,
    taskEdit,
    categoryCreate,
    categoryPatch,
    categoryDelete,
    projectCreate,
    projectPatch,
    projectDelete,
  };
};
