import { Header } from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import twrnc from "twrnc";

export default function HomeScreen() {
  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <Header />
    </SafeAreaView>
  );
}
