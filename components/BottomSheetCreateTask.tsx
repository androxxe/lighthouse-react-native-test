import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { Priority } from "@/enums/priority";
import { taskCreateSchema } from "@/yup-schemas/task-create";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { ScrollView } from "react-native";
import * as yup from "yup";
import twrnc from "twrnc";
import { InputDatePicker } from "@/components/ui/InputDatePicker";
import { InputSelect } from "@/components/ui/InputSelect";
import { useCreateTask } from "@/hooks/screens/useCreateTask";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef } from "react";
import { useBackHandlerBottomSheet } from "@/hooks/useBackHandlerBottomSheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { useBottomSheetCreateTask } from "@/hooks/states/useBottomSheetCreateTask";
import { useModalConfirmationStore } from "@/hooks/states/useModalConfirmationStore";

export const BottomSheetCreateTask = () => {
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
    onSubmit: (values) => task.mutate(values),
  });

  const { showModalConfirmation, closeModalConfirmation } = useModalConfirmationStore();

  const { project, category, task } = useCreateTask();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { isVisible, setIsVisible } = useBottomSheetCreateTask();

  const { onChange: onChangeSheet, isOpen } = useBackHandlerBottomSheet(bottomSheetModalRef, () => {
    showModalConfirmation({
      title: "Are you sure you want to cancel creating task?",
      message: "All unsaved data will be lost.",
      onConfirm: () => {
        bottomSheetModalRef.current?.close();
        closeModalConfirmation();
      },
      onCancel: closeModalConfirmation,
    });
    // bottomSheetModalRef.current?.close();

    return true;
  });

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
      onChange={(index) => {
        onChangeSheet(index);
      }}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={true}
      enablePanDownToClose={false}
      enableDismissOnClose={false}
    >
      <BottomSheetView style={twrnc`flex-1 bg-white`}>
        <ThemedView style={twrnc`flex-1`}>
          <ScrollView>
            <ThemedView style={twrnc`p-4 gap-y-4`}>
              <InputText
                value={formik.values.name}
                onChangeText={(value) => formik.setFieldValue("name", value)}
                placeholder="Enter task name"
                error={formik.touched.name && formik.errors.name}
              />
              <InputText
                isTextArea
                value={formik.values.description}
                onChangeText={(value) => formik.setFieldValue("description", value)}
                placeholder="Enter task description"
                error={formik.touched.description && formik.errors.description}
              />
              <InputText
                label="Priority"
                value={formik.values.priority}
                onChangeText={(value) => formik.setFieldValue("priority", value)}
                placeholder="Select task priority"
                error={formik.touched.priority && formik.errors.priority}
              />
              <InputDatePicker
                variant="regular"
                label="Due Date"
                value={formik.values.due_date}
                onChange={(value) => formik.setFieldValue("due_date", value)}
              />
              <InputSelect
                variant="regular"
                label="Project"
                placeholder="Select project"
                isMultiple={false}
                value={formik.values.project_id ?? ""}
                data={
                  project?.data?.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })) ?? []
                }
                onChange={(data) => {
                  formik.setFieldValue("project_id", data.value);
                }}
              />
              <InputSelect
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
                data={category?.data?.data.map((item) => ({ label: item.name, value: item.id })) ?? []}
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
};
