import React from "react";
import { create } from "zustand";
import { createContext, useContext } from "react";

interface BottomSheetCreateTaskProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const useBottomSheetCreateTaskStore = create<BottomSheetCreateTaskProps>((set) => ({
  isVisible: false,
  setIsVisible: (visible: boolean) => set({ isVisible: visible }),
}));

const BottomSheetCreateTaskContext = createContext<(() => BottomSheetCreateTaskProps) | undefined>(undefined);

export const BottomSheetCreateTaskProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BottomSheetCreateTaskContext.Provider value={useBottomSheetCreateTaskStore}>
      {children}
    </BottomSheetCreateTaskContext.Provider>
  );
};

export const useBottomSheetCreateTaskContext = () => {
  const context = useContext(BottomSheetCreateTaskContext);
  if (!context) {
    throw new Error("useBottomSheetCreateTaskContext must be used within a BottomSheetCreateTaskProvider");
  }

  return context();
};
