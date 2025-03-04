import React from "react";
import { create } from "zustand";
import { createContext, useContext } from "react";
import * as yup from "yup";
import { taskCreateSchema } from "@/yup-schemas/task-create";

interface BottomSheetCreateTaskProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  defaultValue: undefined | (yup.InferType<typeof taskCreateSchema> & { task_id: string });
  setDefaultValue: (value: undefined | (yup.InferType<typeof taskCreateSchema> & { task_id: string })) => void;
}

const useBottomSheetCreateTaskStore = create<BottomSheetCreateTaskProps>((set) => ({
  isVisible: false,
  setIsVisible: (visible: boolean) => set({ isVisible: visible }),
  defaultValue: undefined,
  setDefaultValue: (defaultValue: undefined | (yup.InferType<typeof taskCreateSchema> & { task_id: string })) =>
    set({
      defaultValue,
    }),
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
