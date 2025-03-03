import { View } from "react-native";
import { ThemedText } from "../ThemedText";

export const InputErrorMessage = ({ error }: { error: string }) => {
  return (
    <View>
      <ThemedText variant="small" color="red-600">
        {error}
      </ThemedText>
    </View>
  );
};
