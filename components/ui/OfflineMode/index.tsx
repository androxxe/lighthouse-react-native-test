import { ThemedView } from "@/components/ThemedView";
import { useNetInfo } from "@react-native-community/netinfo";
import { ThemedText } from "../ThemedText";
import twrnc from "twrnc";

export const OfflineMode = () => {
  const { isConnected } = useNetInfo();

  if (isConnected || isConnected === null) return null;

  return (
    <ThemedView style={twrnc`bg-red-500 py-3 flex items-center justify-center`}>
      <ThemedText variant="medium" color="white">
        Anda dalam mode offline
      </ThemedText>
    </ThemedView>
  );
};
