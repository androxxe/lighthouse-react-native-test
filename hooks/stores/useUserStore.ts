import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SecureStorage } from "@/middlewares/secure-storage";

export interface UserInterface {
  id: string;
  name: string;
  email: string;
}

type UseUserStoreProps = {
  user: UserInterface | undefined;
  setUser: (user: UserInterface) => void;
  token: string | undefined;
  setToken: (token: string) => void;
  reset: () => void;
};

export const useUserStore = create<UseUserStoreProps>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user: UserInterface) => set({ user }),
      token: undefined,
      setToken: (token: string) => set({ token }),
      reset: () => set({ user: undefined, token: undefined }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => SecureStorage),
    },
  ),
);
