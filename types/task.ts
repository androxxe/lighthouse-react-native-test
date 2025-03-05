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

export interface TaskUpdateBroadcastInterface {
  data: TaskInterface;
}

export interface TaskCreateBroadcastInterface {
  data: TaskInterface;
}

export interface TaskDeleteBroadcastInterface {
  data: {
    id: string;
  };
}

export interface TaskInterface {
  id: string;
  name: string;
  description: string;
  due_date: string;
  priority: Priority;
  status: Status;
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

export interface TaskTinybaseTableInterface {
  id: string;
  name: string;
  description: string;
  due_date: string;
  priority: Priority;
  status: Status;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_name: string;
  user_email: string;
  project_id: string;
  project_name: string;
  total_comment: number;
  is_sync: boolean;
  is_create: boolean;
}

export interface TaskCategoriesTableInterface {
  id: string;
  task_id: string;
  name: string;
}
