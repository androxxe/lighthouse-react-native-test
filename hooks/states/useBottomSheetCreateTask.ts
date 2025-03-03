import { create } from "zustand";

interface UseBottomSheetCreateTaskProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export const useBottomSheetCreateTask = create<UseBottomSheetCreateTaskProps>()((set) => ({
  isVisible: false,
  setIsVisible: (isVisible: boolean) => set({ isVisible }),
}));
