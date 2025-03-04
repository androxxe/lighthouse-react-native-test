import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Priority } from "@/enums/priority";
import { taskCreateSchema } from "@/yup-schemas/task-create";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { ScrollView, View } from "react-native";
import * as yup from "yup";
import twrnc from "twrnc";
import { InputDatePicker } from "@/components/ui/InputDatePicker";
import { InputSelect } from "@/components/ui/InputSelect";
import { useCreateTask } from "@/hooks/screens/useCreateTask";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { useBackHandlerBottomSheet } from "@/hooks/useBackHandlerBottomSheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { InputPriority } from "./ui/InputPriority";
import { useBottomSheetCreateTaskContext } from "@/hooks/stores/useBottomSheetCreateTaskStore";
import { usePostCategory } from "@/hooks/endpoints/usePostCategory";
import { usePostProject } from "@/hooks/endpoints/usePostProject";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";
import { PROJECT_LIST_QUERY_KEY } from "../hooks/endpoints/useGetProject";
import { CATEGORY_LIST_QUERY_KEY } from "@/hooks/endpoints/useGetCategory";
import { usePatchCategory } from "@/hooks/endpoints/usePatchCategory";
import { useDeleteCategory } from "@/hooks/endpoints/useDeleteCategory";
import { usePatchProject } from "@/hooks/endpoints/usePatchProject";
import { useDeleteProject } from "@/hooks/endpoints/useDeleteProject";

export interface BottomSheetCreateTaskRef {
  present: () => void;
  close: () => void;
}

export const BottomSheetCreateTask = forwardRef<BottomSheetCreateTaskRef>((_, ref) => {
  const { isVisible, setIsVisible, defaultValue } = useBottomSheetCreateTaskContext();

  const formik = useFormik<yup.InferType<typeof taskCreateSchema>>({
    initialValues: {
      name: "",
      description: "",
      priority: Priority.Low,
      due_date: dayjs().toDate(),
      project_id: "",
      category_ids: [],
    },
    validationSchema: taskCreateSchema,
    onSubmit: (values) => {
      if (defaultValue) {
        taskEdit.mutate({
          ...values,
          task_id: defaultValue.task_id,
        });
      } else {
        task.mutate(values);
      }
    },
  });

  useEffect(() => {
    if (defaultValue) {
      formik.setValues(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const queryClient = useQueryClient();

  const { project, category, task, taskEdit } = useCreateTask();

  const { mutate: postCategory } = usePostCategory({
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

  const { mutate: patchCategory } = usePatchCategory({
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

  const { mutate: deleteCategory } = useDeleteCategory({
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

  const { mutate: postProject } = usePostProject({
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

  const { mutate: patchProject } = usePatchProject({
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

  const { mutate: deleteProject } = useDeleteProject({
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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
    close: () => bottomSheetModalRef.current?.close(),
  }));

  const { onChange: onChangeSheet, isOpen } = useBackHandlerBottomSheet(bottomSheetModalRef);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible]);

  useEffect(() => {
    setIsVisible(isOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={onChangeSheet}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={true}
    >
      <BottomSheetView style={twrnc`flex-1 bg-white`}>
        <ThemedView style={twrnc`flex-1`}>
          <ScrollView>
            <ThemedView style={twrnc`p-4 gap-y-4`}>
              <InputText
                isRequired
                label="Name"
                value={formik.values.name}
                onChangeText={(value) => formik.setFieldValue("name", value)}
                placeholder="Enter task name"
                error={formik.touched.name && formik.errors.name}
              />
              <InputText
                isRequired
                label="Description"
                isTextArea
                value={formik.values.description}
                onChangeText={(value) => formik.setFieldValue("description", value)}
                placeholder="Enter description"
                error={formik.touched.description && formik.errors.description}
              />
              <View style={twrnc`flex-1 flex-row gap-x-4`}>
                <InputPriority
                  isRequired
                  containerStyle={twrnc`flex-1`}
                  label="Priority"
                  value={formik.values.priority}
                  onChange={(data) => formik.setFieldValue("priority", data.value)}
                  placeholder="Select task priority"
                  error={formik.touched.priority && formik.errors.priority}
                />
                <InputDatePicker
                  containerStyle={twrnc`flex-1`}
                  variant="regular"
                  label="Due Date"
                  value={formik.values.due_date}
                  onChange={(value) => formik.setFieldValue("due_date", value)}
                />
              </View>
              <InputSelect
                containerStyle={twrnc`flex-1`}
                variant="regular"
                label="Category"
                placeholder="Select category"
                isMultiple
                value={
                  formik.values.category_ids && formik.values.category_ids?.length > 0
                    ? formik.values.category_ids.map((item) => String(item))
                    : []
                }
                onChange={(data) => {
                  formik.setFieldValue(
                    "category_ids",
                    data.map((item) => item.value),
                  );
                }}
                onDeleteSelection={(item) => {
                  formik.setFieldValue(
                    "category_ids",
                    formik.values.category_ids?.filter((data) => data !== item.value),
                  );
                }}
                data={category?.data?.map((item) => ({ label: item.name, value: item.id })) ?? []}
                onPressAdd={(data) => postCategory({ name: data })}
                onPressUpdate={(data) => patchCategory({ name: String(data.label), category_id: String(data.value) })}
                onPressRemove={(data) => {
                  deleteCategory({ category_id: String(data.value) });
                }}
              />
              <InputSelect
                containerStyle={twrnc`flex-1`}
                variant="regular"
                label="Project"
                placeholder="Select project"
                isMultiple={false}
                value={formik.values.project_id ?? ""}
                data={
                  project?.data?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })) ?? []
                }
                onChange={(data) => {
                  formik.setFieldValue("project_id", data.value);
                }}
                onPressAdd={(data) => postProject({ name: data })}
                onPressUpdate={(data) => patchProject({ name: String(data.label), project_id: String(data.value) })}
                onPressRemove={(data) => {
                  deleteProject({ project_id: String(data.value) });
                }}
              />
            </ThemedView>
          </ScrollView>
        </ThemedView>
        <ThemedView style={twrnc`p-4`}>
          <Button variant="background" label="Submit" onPress={() => formik.handleSubmit()} />
        </ThemedView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

BottomSheetCreateTask.displayName = "BottomSheetCreateTask";
