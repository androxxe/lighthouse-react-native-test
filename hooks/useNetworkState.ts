import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export const useNetworkState = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(false);

  const isConnectedDebounced = useDebounce(isConnected, 750);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return unsubscribe;
  }, []);

  return {
    isConnected: isConnectedDebounced,
  };
};
