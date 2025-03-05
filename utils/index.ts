import { Alert } from "react-native";

export * from "./size-by-scale";
export * from "./tailwind-merge";
export * from "./font-size";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const alertNetworkOffline = () =>
  Alert.alert("Anda tidak terhubung ke internet", "Proses ini hanya dapat dilakukan jika terhubung.");

export const randomString = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
