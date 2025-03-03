import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefObject, useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";

export const useBackHandlerBottomSheet = (bottomSheetRef: RefObject<BottomSheetModal>, backAction?: () => boolean) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);

  const onChange = (index: number) => {
    setIsOpen(index === -1 ? false : true);
    setIndex(index);
  };

  const defaultBackAction = useCallback((): boolean => {
    if (isOpen) {
      bottomSheetRef.current?.close();
    }

    return isOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction ? backAction : defaultBackAction);

    return () => {
      backHandler.remove();
    };
  }, [isOpen, backAction, defaultBackAction]);

  return {
    isOpen,
    onChange,
    index,
  };
};
