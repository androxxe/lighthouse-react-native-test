import { Feather } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ui/ThemedText";
import twrnc from "twrnc";
import { useWindowDimensions } from "react-native";

export const EmptyState = () => {
  const { height } = useWindowDimensions();

  return (
    <ThemedView style={[{ height }, twrnc`py-12 flex-row items-center justify-center flex-col gap-y-6`]}>
      <Feather name="x-circle" size={64} color={twrnc.color("orange-500")} />
      <ThemedText variant="large">Tidak ada data</ThemedText>
    </ThemedView>
  );
};
