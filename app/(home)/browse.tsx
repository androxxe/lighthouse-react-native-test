import { ButtonCreateTask } from "@/components/ButtonCreateTask";
import { Header } from "@/components/Header";
import { ListTask } from "@/components/ListTask";
import { ThemedView } from "@/components/ThemedView";
import { BadgeStatus } from "@/components/ui/BadgeStatus";
import { Button } from "@/components/ui/Button";
import { InputCheckboxData } from "@/components/ui/InputCheckbox/index.type";
import { Status } from "@/enums/status";
import { usePatchTask } from "@/hooks/endpoints/usePatchTask";
import { useTinybaseTaskList } from "@/hooks/tinybase/useTinybaseTaskList";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import twrnc from "twrnc";

export default function BrowseScreen() {
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

  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <Header title="Browse" />
      <View style={twrnc`flex-row justify-end items-center p-2 bg-white gap-x-2`}>
        <BadgeStatus status={Status.Completed} />
        <Button
          label="Filter"
          variant="icon"
          size="small"
          borderColor={twrnc.color("orange-500")}
          borderWidth={2}
          icon={<FontAwesome name="sort-alpha-asc" size={18} color={twrnc.color("orange-500")} />}
          onPress={() => Alert.alert("Under Dev")}
        />
        <Button
          label="Filter"
          variant="icon"
          size="small"
          borderColor={twrnc.color("purple-500")}
          borderWidth={2}
          icon={<Feather name="filter" size={20} color={twrnc.color("purple-500")} />}
          onPress={() => Alert.alert("Under Dev")}
        />
      </View>
      <ScrollView>
        <ThemedView style={twrnc`gap-y-4`}>
          {data
            .filter((data) => data.status === Status.Completed)
            .map((task, index) => (
              <ListTask
                task={task}
                key={index}
                checked={!!checked.find((item) => item === task.id)}
                onCheckboxChange={(data) => onCheckboxChange(task.id, data)}
                enableDelete
              />
            ))}
        </ThemedView>
      </ScrollView>
      <View style={twrnc`flex flex-row p-4 justify-between gap-x-2`}>
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
