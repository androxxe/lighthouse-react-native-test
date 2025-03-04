import twrnc from "twrnc";
import { ThemedText } from "../ThemedText";
import { View } from "react-native";
import { Status, StatusColorMapper } from "@/enums/status";

export const BadgeStatus = ({ status }: { status: Status }) => {
  return (
    <View
      style={twrnc`rounded-md bg-white border border-${StatusColorMapper[status]} px-1 py-0.5 flex items-center justify-center`}
    >
      <ThemedText variant="small" fontWeight="bold" color={StatusColorMapper[status]}>
        {status}
      </ThemedText>
    </View>
  );
};
