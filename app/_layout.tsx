import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import twrnc from "twrnc";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useGetValidateToken } from "@/hooks/endpoints/useGetValidateToken";
import { ModalConfirmation } from "@/components/ui/ModalConfirmation";
import { ModalAlert } from "@/components/ui/ModalAlert";
import { BottomSheetFormTask } from "@/components/BottomSheetFormTask";
import { createMergeableStore } from "tinybase";
import { Provider as TinyBaseProvider, useCreateMergeableStore } from "tinybase/ui-react";
import { BottomSheetFormTaskProvider } from "@/hooks/stores/useBottomSheetFormTaskStore";
import { useCreateClientPersisterAndStart } from "@/hooks/tinybase/persister/useCreateClientPersisterAndStart";
import { OfflineMode } from "@/components/ui/OfflineMode";
import { useNetInfo } from "@react-native-community/netinfo";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SpaceMonoBold: require("../assets/fonts/SpaceMono-Bold.ttf"),
  });

  const { isConnected } = useNetInfo();
  const { token } = useUserStore();

  useEffect(() => {
    if (loaded) {
      if (!token) {
        SplashScreen.hideAsync();
      }

      if (token && !isConnected) {
        SplashScreen.hideAsync().then(() => router.replace("/(home)/today"));
      }
    }
  }, [loaded, token, isConnected]);

  const store = useCreateMergeableStore(createMergeableStore);
  useCreateClientPersisterAndStart(store);

  if (!loaded) {
    return null;
  }

  return (
    <TinyBaseProvider store={store}>
      <BottomSheetFormTaskProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={twrnc`flex-1`}>
            <QueryClientProvider client={queryClient}>
              <BottomSheetModalProvider>
                <AuthProvider>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                  ></Stack>
                  <StatusBar style="auto" />
                </AuthProvider>
                <BottomSheetFormTask />
                <ModalConfirmation />
                <ModalAlert />
                <Toast />
                <OfflineMode />
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </BottomSheetFormTaskProvider>
    </TinyBaseProvider>
  );
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useUserStore();

  const { mutate: validateToken } = useGetValidateToken({
    onSuccess: async () => {
      await SplashScreen.hideAsync();
      router.replace("/(home)/today");
    },
    onError: () => {
      SplashScreen.hideAsync();
    },
  });

  useEffect(() => {
    if (token) {
      validateToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return children;
};
