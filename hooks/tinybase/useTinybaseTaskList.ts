import { useTable, useSetRowCallback } from "tinybase/ui-react";
import { TaskCategoriesTableInterface, TaskInterface, TaskTinybaseTableInterface } from "@/types/task";
import { Priority } from "@/enums/priority";
import { Status } from "@/enums/status";
import { useMemo } from "react";

export const TASK_TABLE = "tasks";

export const TASK_TABLE_SCHEMAS: Record<string, keyof TaskTinybaseTableInterface> = {
  id: "id",
  name: "name",
  description: "description",
  due_date: "due_date",
  priority: "priority",
  status: "status",
  created_at: "created_at",
  updated_at: "updated_at",
  user_id: "user_id",
  user_name: "user_name",
  user_email: "user_email",
  project_id: "project_id",
  project_name: "project_name",
  total_comment: "total_comment",
  is_sync: "is_sync",
  is_create: "is_create",
  task_categories: "task_categories",
};

export const TASK_CATEGORIES_SCHEMAS: Record<string, keyof TaskCategoriesTableInterface> = {
  id: "id",
  task_id: "task_id",
  name: "name",
};

interface UseTinybaseTaskListResponse {
  data: TaskInterface[];
  addRowNotSync: (data: TaskInterface) => void;
  updateRowNotSync: (data: TaskInterface) => void;
}

interface TaskInterfaceWithSync extends TaskInterface {
  is_sync: boolean;
  is_create: boolean;
}

export const useTinybaseTaskList = (): UseTinybaseTaskListResponse => {
  // TODO: Improvement pagination
  const rawData = useTable(TASK_TABLE);

  const addRowNotSync = useSetRowCallback<TaskInterface>(
    TASK_TABLE,
    (data) => data.id,
    (data) => {
      return {
        [TASK_TABLE_SCHEMAS.id]: data.id,
        [TASK_TABLE_SCHEMAS.name]: data.name,
        [TASK_TABLE_SCHEMAS.description]: data.description,
        [TASK_TABLE_SCHEMAS.due_date]: data.due_date,
        [TASK_TABLE_SCHEMAS.priority]: data.priority,
        [TASK_TABLE_SCHEMAS.status]: data.status,
        [TASK_TABLE_SCHEMAS.created_at]: data.created_at,
        [TASK_TABLE_SCHEMAS.updated_at]: data.updated_at,
        [TASK_TABLE_SCHEMAS.user_id]: data.user.id,
        [TASK_TABLE_SCHEMAS.user_name]: data.user.name,
        [TASK_TABLE_SCHEMAS.user_email]: data.user.email,
        [TASK_TABLE_SCHEMAS.project_id]: data.project?.id ?? "",
        [TASK_TABLE_SCHEMAS.project_name]: data.project?.name ?? "",
        [TASK_TABLE_SCHEMAS.total_comment]: 0,
        [TASK_TABLE_SCHEMAS.is_sync]: 0,
        [TASK_TABLE_SCHEMAS.is_create]: 1,
        [TASK_TABLE_SCHEMAS.task_categories]: data.task_categories ? JSON.stringify(data?.task_categories) : "",
      };
    },
  );

  const updateRowNotSync = useSetRowCallback<TaskInterface>(
    TASK_TABLE,
    (data) => data.id,
    (data) => {
      return {
        [TASK_TABLE_SCHEMAS.id]: data.id,
        [TASK_TABLE_SCHEMAS.name]: data.name,
        [TASK_TABLE_SCHEMAS.description]: data.description,
        [TASK_TABLE_SCHEMAS.due_date]: data.due_date,
        [TASK_TABLE_SCHEMAS.priority]: data.priority,
        [TASK_TABLE_SCHEMAS.status]: data.status,
        [TASK_TABLE_SCHEMAS.created_at]: data.created_at,
        [TASK_TABLE_SCHEMAS.updated_at]: data.updated_at,
        [TASK_TABLE_SCHEMAS.user_id]: data.user.id,
        [TASK_TABLE_SCHEMAS.user_name]: data.user.name,
        [TASK_TABLE_SCHEMAS.user_email]: data.user.email,
        [TASK_TABLE_SCHEMAS.project_id]: data.project?.id ?? "",
        [TASK_TABLE_SCHEMAS.project_name]: data.project?.name ?? "",
        [TASK_TABLE_SCHEMAS.total_comment]: data.total_comment,
        [TASK_TABLE_SCHEMAS.is_sync]: 0,
        [TASK_TABLE_SCHEMAS.is_create]: 0,
        [TASK_TABLE_SCHEMAS.task_categories]: data.task_categories ? JSON.stringify(data?.task_categories) : "",
      };
    },
  );

  const data: TaskInterfaceWithSync[] = useMemo(
    () =>
      Object.values(rawData).map((item) => ({
        id: String(item.id),
        name: String(item.name),
        description: String(item.description),
        due_date: String(item.due_date),
        priority: item.priority as Priority,
        status: item.status as Status,
        created_at: String(item.created_at),
        updated_at: String(item.updated_at),
        user: {
          id: String(item.user_id),
          name: String(item.user_name),
          email: String(item.user_email),
        },
        project:
          item.project_id && item.project_name
            ? {
                id: String(item.project_id),
                name: String(item.project_name),
              }
            : null,
        task_categories: item.task_categories
          ? (JSON.parse(String(item.task_categories)) as unknown as TaskInterface["task_categories"])
          : [],
        total_comment: Number(item.total_comment),
        is_sync: item.is_sync ? true : false,
        is_create: item.is_create ? true : false,
      })),
    [rawData],
  );

  return {
    data,
    addRowNotSync,
    updateRowNotSync,
  };
};
