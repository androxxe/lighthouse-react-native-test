import { TouchableOpacity } from "react-native";
import { ThemedView } from "./ThemedView";
import { Feather } from "@expo/vector-icons";
import twrnc from "twrnc";
import { router } from "expo-router";
import { ThemedText } from "./ui/ThemedText";

export const Header = ({ title }: { title: string }) => {
  return (
    <ThemedView style={twrnc`flex-row items-center justify-between p-2`}>
      <ThemedView style={twrnc`px-4`}>
        <ThemedText variant="extra-large" fontWeight="bold">
          {title}
        </ThemedText>
      </ThemedView>
      <TouchableOpacity
        onPress={() => router.navigate("/profile")}
        style={twrnc`w-8 h-8 rounded-full bg-slate-100 items-center justify-center`}
      >
        <Feather name="user" size={20} color={twrnc.color("purple-500")} />
      </TouchableOpacity>
    </ThemedView>
  );
};
