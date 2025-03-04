import { Priority, PriorityColorMapper } from "@/enums/priority";
import twrnc from "twrnc";
import { ThemedText } from "../ThemedText";
import { View } from "react-native";

export const BadgePriority = ({ priority }: { priority: Priority }) => {
  return (
    <View style={twrnc`rounded-md bg-${PriorityColorMapper[priority]} px-1 py-0.5 flex items-center justify-center`}>
      <ThemedText variant="small" fontWeight="bold" color="white">
        {priority}
      </ThemedText>
    </View>
  );
};
