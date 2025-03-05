import { useTable, useDelTableCallback, useDelRowCallback, useSetRowCallback, useRowIds } from "tinybase/ui-react";
import { TaskInterface } from "@/types/task";
import { useTaskSocketIO } from "../screens/useTaskSocketIO";
import { Priority } from "@/enums/priority";
import { Status } from "@/enums/status";
import { useCallback, useEffect, useMemo } from "react";
import { usePostTask } from "../endpoints/usePostTask";
import dayjs from "dayjs";
import { usePatchTask } from "../endpoints/usePatchTask";
import { useNetworkState } from "../useNetworkState";
import { TASK_TABLE, TASK_TABLE_SCHEMAS } from "./useTinybaseTaskList";

interface TaskInterfaceWithSync extends TaskInterface {
  is_sync: boolean;
  is_create: boolean;
}

export const useTinybaseTaskSyncronizer = ({ subscribe }: { subscribe: boolean }): null => {
  const { isConnected } = useNetworkState();

  const rowIds = useRowIds(TASK_TABLE);

  useTaskSocketIO({
    subscribe,
    onTaskList: (data) => {
      deleteTable();
      data.data.forEach((project) => addRow(project));
    },
    onTaskCreate: (data) => {
      addRow(data);
    },
    onTaskUpdate: (data) => {
      if (rowIds.includes(data.id)) {
        updateRow(data);
      } else {
        addRow(data);
      }
    },
    onTaskDelete: (data) => {
      deleteRow(data);
    },
  });

  const { mutateAsync: postTask } = usePostTask({});

  const { mutateAsync: patchTask } = usePatchTask({});

  // TODO: Improvement pagination
  const rawData = useTable(TASK_TABLE);

  const addRow = useSetRowCallback<TaskInterface>(
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
        [TASK_TABLE_SCHEMAS.is_sync]: 1,
        [TASK_TABLE_SCHEMAS.is_create]: 1,
        [TASK_TABLE_SCHEMAS.task_categories]: data.task_categories ? JSON.stringify(data?.task_categories) : "",
      };
    },
  );

  const deleteRow = useDelRowCallback<{ id: string }>(TASK_TABLE, (data) => {
    return data.id;
  });

  const updateRow = useSetRowCallback<TaskInterface>(
    TASK_TABLE,
    (data) => {
      return data.id;
    },
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
        [TASK_TABLE_SCHEMAS.is_sync]: 1,
        [TASK_TABLE_SCHEMAS.is_create]: 0,
        [TASK_TABLE_SCHEMAS.task_categories]: data.task_categories ? JSON.stringify(data?.task_categories) : "",
      };
    },
  );

  const deleteTable = useDelTableCallback<string>(TASK_TABLE);

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

  const handleSyncPostTask = useCallback(
    () => {
      data
        .filter((item) => item.is_sync === false && item.is_create === true)
        .map((item) => {
          postTask({
            name: item.name,
            description: item.description,
            priority: item.priority,
            due_date: dayjs(item.due_date).toDate(),
            project_id: item.project?.id,
            category_ids: item.task_categories,
          });

          deleteRow({ id: item.id });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const handleSyncPatchTask = useCallback(() => {
    data
      .filter((item) => item.is_sync === false && item.is_create === false)
      .map((item) => {
        patchTask({
          task_id: item.id,
          name: item.name,
          description: item.description,
          priority: item.priority,
          due_date: dayjs(item.due_date).toDate(),
          project_id: item.project?.id,
          category_ids: item.task_categories,
          status: item.status,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // sync if online
  useEffect(() => {
    if (isConnected) {
      handleSyncPostTask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // sync if online
  useEffect(() => {
    if (isConnected) {
      handleSyncPatchTask();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return null;
};
