import { Priority } from "@/enums/priority";
import { Status } from "@/enums/status";

export interface TaskListBroadcastInterface {
  data: TaskInterface[];
  meta: {
    has_more: boolean;
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}
export interface TaskInterface {
  id: string;
  name: string;
  description: string;
  due_date: string;
  priority: Priority;
  status?: Status;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
  } | null;
  task_categories: {
    id: string;
    name: string;
  }[];
  total_comment: number;
}
