import { ButtonCreateTask } from "@/components/ButtonCreateTask";
import { Header } from "@/components/Header";
import { ListTask } from "@/components/ListTask";
import { ThemedView } from "@/components/ThemedView";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { BaseSocketIOInterface } from "@/types/base-socketio";
import { TaskInterface, TaskListBroadcastInterface } from "@/types/task";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { io } from "socket.io-client";
import twrnc from "twrnc";

export default function HomeScreen() {
  const [taskList, setTaskList] = useState<TaskInterface[]>([]);

  useEffect(() => {
    const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      extraHeaders: {
        Authorization: `Bearer ${useUserStore.getState().token}`,
      },
    });

    socket.emit("task", {
      page: 1,
      per_page: 1000,
    });

    socket.on("task-list", (event: BaseSocketIOInterface<TaskListBroadcastInterface>) => {
      setTaskList(event?.data?.data ?? []);
    });

    socket.on("exception", (data: BaseSocketIOInterface<unknown>) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: data.message,
        type: "error",
      });
    });
  }, []);

  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <Header title="Today" />
      <ScrollView>
        <ThemedView style={twrnc`gap-y-4`}>
          {taskList.map((task, index) => (
            <ListTask task={task} key={index} />
          ))}
        </ThemedView>
      </ScrollView>
      <ButtonCreateTask />
    </SafeAreaView>
  );
}
