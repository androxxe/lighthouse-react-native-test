import { Priority } from "@/enums/priority";
import * as yup from "yup";

export const taskCreateSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  priority: yup.string().oneOf(Object.values(Priority)).required("Priority is required").default(Priority.Low),
  due_date: yup.date().required("Due date is required"),
  project_id: yup.string().optional(),
  project_name: yup.string().optional(),
  category_ids: yup
    .array()
    .of(yup.object().shape({ id: yup.string().required(), name: yup.string().required() }))
    .optional(),
});
