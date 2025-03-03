import { Header } from "@/components/Header";
import { ListTask } from "@/components/ListTask";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { useBottomSheetCreateTask } from "@/hooks/states/useBottomSheetCreateTask";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import twrnc from "twrnc";

export default function HomeScreen() {
  const { setIsVisible } = useBottomSheetCreateTask();

  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <Header />

      <ScrollView>
        <ThemedView style={twrnc`gap-y-4`}>
          <ListTask />
          <ListTask />
          <ListTask />
          <ListTask />
          <ListTask />
          <ListTask />
          <ListTask />
          <ListTask />
        </ThemedView>
      </ScrollView>
      <ThemedView style={twrnc`p-4 flex items-end`}>
        <Button
          borderColor={twrnc.color("purple-500")}
          backgroundColor={twrnc.color("purple-500")}
          variant="icon"
          containerStyle={twrnc`w-12 h-12 p-0`}
          icon={<Feather name="plus" size={24} color={twrnc.color("white")} />}
          onPress={() => setIsVisible(true)}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
