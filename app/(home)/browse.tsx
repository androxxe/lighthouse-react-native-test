import { ButtonCreateTask } from "@/components/ButtonCreateTask";
import { Header } from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import twrnc from "twrnc";

export default function BrowseScreen() {
  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <Header title="Browse" />
      <ButtonCreateTask />
    </SafeAreaView>
  );
}
