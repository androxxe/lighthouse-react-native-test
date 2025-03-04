import { Feather } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ui/ThemedText";
import twrnc from "twrnc";
import { TouchableOpacity } from "react-native";
import { InputCheckbox } from "./ui/InputCheckbox";
import { TaskInterface } from "@/types/task";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { BadgePriority } from "./ui/BadgePriority";
import { useBottomSheetFormTaskContext } from "@/hooks/stores/useBottomSheetFormTaskStore";
import { InputCheckboxData } from "./ui/InputCheckbox/index.type";
import { BadgeStatus } from "./ui/BadgeStatus";

export const ListTask = ({
  task,
  checked,
  onCheckboxChange,
}: {
  task: TaskInterface;
  checked: boolean;
  onCheckboxChange: (value: InputCheckboxData[]) => void;
}) => {
  const { setIsVisible, setEditValue } = useBottomSheetFormTaskContext();

  return (
    <TouchableOpacity style={twrnc`bg-white px-4 py-2 flex flex-row items-center`} activeOpacity={0.8}>
      <ThemedView>
        <InputCheckbox
          variant="regular"
          value={checked ? [task.id] : []}
          data={[{ label: "", value: task.id }]}
          onChange={onCheckboxChange}
        />
      </ThemedView>
      <ThemedView style={twrnc`flex-1`}>
        <ThemedText variant="large" fontWeight="bold">
          {task.name}
        </ThemedText>
        <ThemedText variant="medium">{task.description}</ThemedText>
        <ThemedView style={twrnc`flex-row items-center gap-x-2 mt-1`}>
          <Feather name="calendar" color={twrnc.color("purple-500")} size={16} />
          {task.due_date && (
            <ThemedText variant="small" fontWeight="bold">
              {dayjs(task.due_date).locale("id").format("DD MMM YYYY")}
            </ThemedText>
          )}
          {task.priority && <BadgePriority priority={task.priority} />}
          <BadgeStatus status={task.status} />
        </ThemedView>
      </ThemedView>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(true);
          setEditValue({
            task_id: task.id,
            name: task.name,
            description: task.description,
            priority: task.priority,
            due_date: dayjs(task.due_date).toDate(),
            project_id: task.project?.id,
            category_ids: task.task_categories.map((item) => item.id),
          });
        }}
      >
        <Feather name="edit" color={twrnc.color("purple-500")} size={16} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
