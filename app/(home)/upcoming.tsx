import { ButtonCreateTask } from "@/components/ButtonCreateTask";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ListTask } from "@/components/ListTask";
import { Button } from "@/components/ui/Button";
import { InputCheckboxData } from "@/components/ui/InputCheckbox/index.type";
import { Status } from "@/enums/status";
import { usePatchTask } from "@/hooks/endpoints/usePatchTask";
import { useTinybaseTaskList } from "@/hooks/tinybase/useTinybaseTaskList";
import { useNetInfo } from "@react-native-community/netinfo";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import twrnc from "twrnc";

export default function UpcomingScreen() {
  const [checked, setChecked] = useState<string[]>([]);

  const { isConnected } = useNetInfo();

  const { data } = useTinybaseTaskList();

  const { mutate: patchTask } = usePatchTask({
    onSuccess: () => {
      Toast.show({
        text1: "Task done",
        type: "success",
      });
      setChecked([]);
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data?.message,
        type: "error",
      });
    },
  });

  const onCheckboxChange = useCallback(
    (task_id: string, value: InputCheckboxData[]) => {
      const isChecked = checked.includes(task_id);
      if (value.length > 0) {
        setChecked((prev) => (isChecked ? prev.filter((item) => item !== task_id) : [...prev, task_id]));
      } else if (isChecked) {
        setChecked((prev) => prev.filter((item) => item !== task_id));
      }
    },
    [checked],
  );

  const list = useMemo(() => data.filter((item) => dayjs(item.due_date).isAfter(dayjs(), "day")), [data]);

  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <Header title="Upcoming" />
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <ListTask
            task={item}
            checked={!!checked.find((data) => data === item.id)}
            onCheckboxChange={(data) => onCheckboxChange(item.id, data)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState />}
      />
      <View style={twrnc`flex flex-row p-4 justify-between gap-x-2 absolute bottom-0 right-0 w-full`}>
        {checked.length > 0 ? (
          <Button
            label="Mark as Done"
            containerStyle={twrnc`flex-1`}
            variant="secondary"
            onPress={() => {
              if (!isConnected) {
                return Toast.show({
                  text1: "Hanya dapat diakses jika online",
                  text2: "Anda tidak terhubung ke internet",
                  type: "error",
                });
              }
              checked.map((item) => patchTask({ task_id: item, status: Status.Completed }));
            }}
          />
        ) : (
          <View />
        )}
        <ButtonCreateTask />
      </View>
    </SafeAreaView>
  );
}
