import { cleanEnv, str } from "envalid";

cleanEnv(process.env, {
  EXPO_PUBLIC_APP_NAME: str(),
  EXPO_PUBLIC_API_URL: str(),
  EXPO_PUBLIC_SOCKET_URL: str(),
});
