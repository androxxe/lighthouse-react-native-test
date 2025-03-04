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

export default function CreateTaskScreen() {
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

  const { project, category, task } = useCreateTask();

  return (
    <ThemedView style={twrnc`flex-1 bg-white`}>
      <ThemedView style={twrnc`flex-1`}>
        <ScrollView>
          <ThemedView style={twrnc`p-4 gap-y-4`}>
            <InputText
              label="Name"
              value={formik.values.name}
              onChangeText={(value) => formik.setFieldValue("name", value)}
              placeholder="Enter task name"
              error={formik.touched.name && formik.errors.name}
            />
            <InputText
              isTextArea
              label="Description"
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
                project?.data.map((item) => ({
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
              data={category?.data.map((item) => ({ label: item.name, value: item.id })) ?? []}
            />
          </ThemedView>
        </ScrollView>
      </ThemedView>
      <ThemedView style={twrnc`p-4`}>
        <Button variant="background" label="Submit" onPress={() => formik.handleSubmit()} />
      </ThemedView>
    </ThemedView>
  );
}
