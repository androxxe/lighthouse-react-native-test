import { ButtonCreateTask } from "@/components/ButtonCreateTask";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ListTask } from "@/components/ListTask";
import { MarkAsDone } from "@/components/MarkAsDone";
import { InputCheckboxData } from "@/components/ui/InputCheckbox/index.type";
import { useTinybaseTaskList } from "@/hooks/tinybase/useTinybaseTaskList";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import twrnc from "twrnc";

export default function HomeScreen() {
  const [checked, setChecked] = useState<string[]>([]);

  const { data } = useTinybaseTaskList();

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

  const list = useMemo(() => data.filter((item) => dayjs(item.due_date).isSame(dayjs(), "day")), [data]);

  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <Header title="Today" />
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
        <MarkAsDone onSuccess={() => setChecked([])} list={list} checked={checked} />
        <ButtonCreateTask />
      </View>
    </SafeAreaView>
  );
}
