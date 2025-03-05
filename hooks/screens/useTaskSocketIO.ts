import {
  TaskCreateBroadcastInterface,
  TaskDeleteBroadcastInterface,
  TaskInterface,
  TaskListBroadcastInterface,
  TaskUpdateBroadcastInterface,
} from "@/types/task";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { BaseSocketIOInterface } from "@/types/base-socketio";
import Toast from "react-native-toast-message";
import { io } from "socket.io-client";
import { SOCKET_EVENT } from "@/constants/socket-event";
import { config } from "@/config";

export interface UseTaskSocketIOProps {
  subscribe?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  onTaskList?: (data: TaskListBroadcastInterface) => void;
  onTaskCreate?: (data: TaskCreateBroadcastInterface) => void;
  onTaskUpdate?: (data: TaskUpdateBroadcastInterface) => void;
  onTaskDelete?: (data: TaskDeleteBroadcastInterface) => void;
}

export const useTaskSocketIO = (props?: UseTaskSocketIOProps) => {
  const {
    subscribe = false,
    onConnect,
    onDisconnect,
    onTaskList,
    onError,
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
  } = props ?? {};
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);

  useEffect(() => {
    if (subscribe) {
      const socket = io(config.SOCKET_URL, {
        extraHeaders: {
          Authorization: `Bearer ${useUserStore.getState().token}`,
        },
      });

      socket.on("connect", () => {
        onConnect?.();
        setIsLoading(true);
      });

      socket.on("disconnect", () => {
        onDisconnect?.();
      });

      socket.emit(SOCKET_EVENT.TASK_EMIT, {
        page: 1,
        per_page: 1000,
      });

      socket.on(SOCKET_EVENT.TASK_LIST, (event: BaseSocketIOInterface<TaskListBroadcastInterface>) => {
        setTasks(event?.data?.data ?? []);
        setIsLoading(false);
        onTaskList?.(event?.data);
      });

      socket.on(SOCKET_EVENT.TASK_LIST_CREATE, (event: BaseSocketIOInterface<TaskCreateBroadcastInterface>) => {
        onTaskCreate?.(event?.data);
      });

      socket.on(SOCKET_EVENT.TASK_LIST_UPDATE, (event: BaseSocketIOInterface<TaskUpdateBroadcastInterface>) => {
        onTaskUpdate?.(event?.data);
      });

      socket.on(SOCKET_EVENT.TASK_LIST_DELETE, (event: BaseSocketIOInterface<TaskDeleteBroadcastInterface>) => {
        onTaskDelete?.(event?.data);
      });

      socket.on(SOCKET_EVENT.EXCEPTION, (data: BaseSocketIOInterface<unknown>) => {
        Toast.show({
          text1: "Terjadi kesalahan",
          text2: data.message,
          type: "error",
        });
        onError?.(data.message);
      });

      return () => {
        socket.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tasks,
    isLoading,
  };
};
