import { Feather } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ui/ThemedText";
import twrnc from "twrnc";
import { TouchableOpacity } from "react-native";
import { InputCheckbox } from "./ui/InputCheckbox";

export const ListTask = () => {
  return (
    <TouchableOpacity style={twrnc`bg-white px-4 py-2 flex flex-row items-center`} activeOpacity={0.8}>
      <ThemedView style={twrnc`w-`}>
        <InputCheckbox variant="regular" value={[]} data={[{ label: "", value: 1 }]} onChange={() => undefined} />
      </ThemedView>
      <ThemedView style={twrnc`flex-1`}>
        <ThemedText variant="large" fontWeight="bold">
          Do a weekly review of my tasks
        </ThemedText>
        <ThemedText variant="medium">Do a weekly review of my tasks Do a weekly review of my tasks</ThemedText>
        <ThemedView style={twrnc`flex-row items-center gap-x-2 mt-1`}>
          <Feather name="calendar" color={twrnc.color("purple-500")} size={16} />
          <ThemedText variant="small" fontWeight="bold">
            20 Februari
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};
