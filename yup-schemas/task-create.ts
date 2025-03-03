import { Priority } from "@/enums/priority";
import * as yup from "yup";

export const taskCreateSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  priority: yup.string().oneOf(Object.values(Priority)).required("Priority is required").default(Priority.Low),
  due_date: yup.date().optional().default(null),
  project_id: yup.string().optional(),
  category_ids: yup.array().of(yup.string()).optional(),
});
