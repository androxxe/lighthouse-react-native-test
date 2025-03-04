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
import { useUserStore } from "@/stores/useUserStore";
import { useGetValidateToken } from "@/hooks/endpoints/useGetValidateToken";
import { ModalConfirmation } from "@/components/ui/ModalConfirmation";
import { ModalAlert } from "@/components/ui/ModalAlert";
import { BottomSheetCreateTask } from "@/components/BottomSheetCreateTask";
import { createMergeableStore, Store } from "tinybase";
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";
import { Provider, useCreateMergeableStore, useCreatePersister } from "tinybase/ui-react";
import * as SQLite from "expo-sqlite";
import { BottomSheetCreateTaskProvider } from "@/hooks/states/useBottomSheetCreateTaskStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const useAndStartPersister = (store: Store) =>
  useCreatePersister(
    store,
    (store) => createExpoSqlitePersister(store, SQLite.openDatabaseSync("lighthouse-task-test.db")),
    [],
    (persister) =>
      new Promise((resolve) => {
        persister.load().then(() => persister.startAutoSave().then(() => resolve()));
      }),
  );

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SpaceMonoBold: require("../assets/fonts/SpaceMono-Bold.ttf"),
  });

  const { token } = useUserStore();

  useEffect(() => {
    if (loaded) {
      if (!token) {
        SplashScreen.hideAsync();
      }
    }
  }, [loaded, token]);

  const store = useCreateMergeableStore(createMergeableStore);
  useAndStartPersister(store);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <BottomSheetCreateTaskProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={twrnc`flex-1`}>
            <QueryClientProvider client={queryClient}>
              <BottomSheetModalProvider>
                <AuthProvider>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    <Stack.Screen
                      name="task/create"
                      options={{
                        headerShown: true,
                        title: "Create Task",
                      }}
                    />
                  </Stack>
                  <StatusBar style="auto" />
                </AuthProvider>
                <BottomSheetCreateTask />
                <ModalConfirmation />
                <ModalAlert />
                <Toast />
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </BottomSheetCreateTaskProvider>
    </Provider>
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
