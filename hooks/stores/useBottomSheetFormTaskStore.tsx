import React from "react";
import { create } from "zustand";
import { createContext, useContext } from "react";
import * as yup from "yup";
import { taskCreateSchema } from "@/yup-schemas/task-create";

interface BottomSheetFormTaskProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  editValue: undefined | (yup.InferType<typeof taskCreateSchema> & { task_id: string });
  setEditValue: (value: undefined | (yup.InferType<typeof taskCreateSchema> & { task_id: string })) => void;
}

const useBottomSheetFormTaskStore = create<BottomSheetFormTaskProps>((set) => ({
  isVisible: false,
  setIsVisible: (visible: boolean) => set({ isVisible: visible }),
  editValue: undefined,
  setEditValue: (editValue: undefined | (yup.InferType<typeof taskCreateSchema> & { task_id: string })) =>
    set({
      editValue,
    }),
}));

const BottomSheetFormTaskContext = createContext<(() => BottomSheetFormTaskProps) | undefined>(undefined);

export const BottomSheetFormTaskProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BottomSheetFormTaskContext.Provider value={useBottomSheetFormTaskStore}>
      {children}
    </BottomSheetFormTaskContext.Provider>
  );
};

export const useBottomSheetFormTaskContext = () => {
  const context = useContext(BottomSheetFormTaskContext);
  if (!context) {
    throw new Error("useBottomSheetFormTaskContext must be used within a BottomSheetFormTaskProvider");
  }

  return context();
};
