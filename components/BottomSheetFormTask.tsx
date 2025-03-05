import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Priority } from "@/enums/priority";
import { taskCreateSchema } from "@/yup-schemas/task-create";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { View } from "react-native";
import * as yup from "yup";
import twrnc from "twrnc";
import { InputDatePicker } from "@/components/ui/InputDatePicker";
import { InputSelect } from "@/components/ui/InputSelect";
import { useFormTask } from "@/hooks/screens/useFormTask";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef } from "react";
import { useBackHandlerBottomSheet } from "@/hooks/useBackHandlerBottomSheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { InputPriority } from "./ui/InputPriority";
import { useBottomSheetFormTaskContext } from "@/hooks/stores/useBottomSheetFormTaskStore";
import { useNetInfo } from "@react-native-community/netinfo";
import { Status } from "@/enums/status";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { TaskInterface } from "@/types/task";
import { randomString } from "@/utils";
import { useTinybaseTaskList } from "@/hooks/tinybase/useTinybaseTaskList";

export interface BottomSheetFormTaskRef {
  present: () => void;
  close: () => void;
}

export const BottomSheetFormTask = () => {
  const { isVisible, setIsVisible } = useBottomSheetFormTaskContext();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
        <Form />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const Form = () => {
  const { setIsVisible, editValue, setEditValue } = useBottomSheetFormTaskContext();
  const { isConnected } = useNetInfo();

  const { addRowNotSync, updateRowNotSync } = useTinybaseTaskList();

  const {
    project,
    category,
    taskCreate: { mutate: postTask, isPending: isPendingTaskCreate },
    taskEdit: { mutate: patchTask, isPending: isPendingTaskEdit },
    categoryCreate: { mutate: postCategory },
    categoryPatch: { mutate: patchCategory },
    categoryDelete: { mutate: deleteCategory },
    projectCreate: { mutate: postProject },
    projectPatch: { mutate: patchProject },
    projectDelete: { mutate: deleteProject },
  } = useFormTask();

  const formik = useFormik<yup.InferType<typeof taskCreateSchema>>({
    initialValues: {
      name: "",
      description: "",
      priority: Priority.Low,
      due_date: dayjs().toDate(),
      project_id: "",
      project_name: "",
      category_ids: [],
    },
    validationSchema: taskCreateSchema,
    onSubmit: (values) => {
      if (isConnected) {
        if (editValue) {
          patchTask({
            ...values,
            task_id: editValue.task_id,
          });
        } else {
          postTask(values);
        }
      } else {
        const basePayload = {
          name: values.name,
          description: values.description,
          priority: values.priority as Priority,
          due_date: dayjs(values.due_date).toISOString(),
          project:
            values.project_id && values.project_name
              ? {
                  id: values.project_id,
                  name: values.project_name,
                }
              : null,
          status: Status.Created,
          created_at: dayjs().toISOString(),
          updated_at: dayjs().toISOString(),
          task_categories: values.category_ids ?? [],
          user: {
            id: useUserStore.getState().user?.id ?? "",
            email: useUserStore.getState().user?.email ?? "",
            name: useUserStore.getState().user?.name ?? "",
          },
          total_comment: 0,
        };

        if (editValue) {
          const payload: TaskInterface = {
            id: editValue.task_id,
            ...basePayload,
          };
          updateRowNotSync(payload);
        } else {
          const payload: TaskInterface = {
            id: randomString(10),
            ...basePayload,
          };
          addRowNotSync(payload);
        }
        setIsVisible(false);
        setEditValue(undefined);
      }
    },
  });

  useEffect(() => {
    if (editValue) {
      formik.setValues(editValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editValue]);

  return (
    <>
      <ThemedView style={twrnc`gap-y-4 p-4 flex-1`}>
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
              ? formik.values.category_ids.map((item) => item.id)
              : []
          }
          onChange={(data) => {
            formik.setFieldValue(
              "category_ids",
              data.map((item) => ({
                id: item.value,
                name: item.label,
              })),
            );
          }}
          onDeleteSelection={(item) => {
            formik.setFieldValue(
              "category_ids",
              formik.values.category_ids?.filter((data) => data.id !== item.value),
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
            formik.setFieldValue("project_name", data.label);
          }}
          onPressAdd={(data) => postProject({ name: data })}
          onPressUpdate={(data) => patchProject({ name: String(data.label), project_id: String(data.value) })}
          onPressRemove={(data) => {
            deleteProject({ project_id: String(data.value) });
          }}
        />
      </ThemedView>
      <ThemedView style={twrnc`p-4`}>
        <Button
          variant="background"
          isLoading={isPendingTaskEdit || isPendingTaskCreate}
          disabled={isPendingTaskEdit || isPendingTaskCreate}
          label="Submit"
          onPress={() => formik.handleSubmit()}
        />
      </ThemedView>
    </>
  );
};
