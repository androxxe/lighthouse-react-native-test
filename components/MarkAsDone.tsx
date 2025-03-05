import { useNetInfo } from "@react-native-community/netinfo";
import { Button } from "./ui/Button/index";
import twrnc from "twrnc";
import { TaskInterface } from "@/types/task";
import dayjs from "dayjs";
import { Priority } from "@/enums/priority";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useTinybaseTaskList } from "@/hooks/tinybase/useTinybaseTaskList";
import { usePatchTask } from "@/hooks/endpoints/usePatchTask";
import Toast from "react-native-toast-message";
import { Status } from "@/enums/status";
import { View } from "react-native";

export const MarkAsDone = ({
  list,
  checked,
  onSuccess,
}: {
  list: TaskInterface[];
  checked: string[];
  onSuccess: () => void;
}) => {
  const { isConnected } = useNetInfo();

  const { updateRowNotSync } = useTinybaseTaskList();

  const { mutate: patchTask } = usePatchTask({
    onSuccess: () => {
      Toast.show({
        text1: "Task done",
        type: "success",
      });
      onSuccess();
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data?.message,
        type: "error",
      });
    },
  });

  if (checked.length === 0) return <View />;

  return (
    <>
      <Button
        label="Mark as Done"
        containerStyle={twrnc`flex-1`}
        variant="secondary"
        onPress={async () => {
          if (!isConnected) {
            await Promise.all(
              checked.map((item) => {
                const values = list.find((find) => find.id === item);
                if (!values) return;

                const payload: TaskInterface = {
                  id: item,
                  name: values.name,
                  description: values.description,
                  priority: values.priority as Priority,
                  due_date: dayjs(values.due_date).toISOString(),
                  project: values.project
                    ? {
                        id: values.project.id,
                        name: values.project.name,
                      }
                    : null,
                  status: Status.Completed,
                  created_at: values.created_at,
                  updated_at: values.updated_at,
                  task_categories: [],
                  user: {
                    id: useUserStore.getState().user?.id ?? "",
                    email: useUserStore.getState().user?.email ?? "",
                    name: useUserStore.getState().user?.name ?? "",
                  },
                  total_comment: 0,
                };

                return updateRowNotSync(payload);
              }),
            );
          }
          checked.map((item) => patchTask({ task_id: item, status: Status.Completed }));
        }}
      />
    </>
  );
};
