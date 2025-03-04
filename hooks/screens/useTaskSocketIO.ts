import { TaskInterface, TaskListBroadcastInterface } from "@/types/task";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { BaseSocketIOInterface } from "@/types/base-socketio";
import Toast from "react-native-toast-message";
import { io } from "socket.io-client";

export const useTaskSocketIO = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);

  useEffect(() => {
    const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      extraHeaders: {
        Authorization: `Bearer ${useUserStore.getState().token}`,
      },
    });

    socket.on("connect", () => {
      setIsLoading(true);
    });

    socket.emit("task", {
      page: 1,
      per_page: 1000,
    });

    socket.on("task-list", (event: BaseSocketIOInterface<TaskListBroadcastInterface>) => {
      setTasks(event?.data?.data ?? []);
      setIsLoading(false);
    });

    socket.on("exception", (data: BaseSocketIOInterface<unknown>) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: data.message,
        type: "error",
      });
    });
  }, []);

  return {
    tasks,
    isLoading,
  };
};
