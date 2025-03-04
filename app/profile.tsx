import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { useModalConfirmationStore } from "@/hooks/states/useModalConfirmationStore";
import { useUserStore } from "@/stores/useUserStore";
import { widthByScale } from "@/utils";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import twrnc from "twrnc";

export default function ProfileScreen() {
  const { user, reset } = useUserStore();

  const { showModalConfirmation, closeModalConfirmation } = useModalConfirmationStore();

  const onLogout = () => {
    showModalConfirmation({
      title: "Logout",
      message: "Apakah anda yakin ingin logout?",
      onConfirm: () => {
        reset();
        router.replace("/");
        closeModalConfirmation();
      },
      onCancel: closeModalConfirmation,
    });
  };

  return (
    <SafeAreaView style={twrnc`flex-1 bg-white px-8 pb-8`}>
      <ThemedView style={twrnc`flex-col items-center justify-start py-12 flex-1 gap-y-4`}>
        <View
          style={twrnc`border border-slate-300 items-center justify-center rounded-full h-[${widthByScale(24)}px] w-[${widthByScale(24)}px]`}
        >
          <Feather name="user" size={widthByScale(12)} color={twrnc.color("purple-500")} />
        </View>
        <ThemedText variant="large">{user?.name}</ThemedText>
      </ThemedView>
      <Button variant="secondary" label="Logout" onPress={onLogout} containerStyle={twrnc`w-full`} />
    </SafeAreaView>
  );
}
