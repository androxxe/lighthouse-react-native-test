import { Alert } from "react-native";

export * from "./size-by-scale";
export * from "./tailwind-merge";
export * from "./font-size";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const alertNetworkOffline = () =>
  Alert.alert("Anda tidak terhubung ke internet", "Proses ini hanya dapat dilakukan jika terhubung.");
