import { ModalConfirmationProps } from "@/components/ui/ModalConfirmation/index.type";
import { create } from "zustand";

interface UseModalConfirmationStoreProps {
  modalConfirmation: ModalConfirmationProps;
  showModalConfirmation: (props: Omit<ModalConfirmationProps, "isVisible">) => void;
  closeModalConfirmation: () => void;
}

const initialState: ModalConfirmationProps = {
  isVisible: false,
  title: "",
  message: "",
  onConfirm: () => undefined,
  onCancel: () => undefined,
  confirmText: "Confirm",
  cancelText: "Cancel",
};

export const useModalConfirmationStore = create<UseModalConfirmationStoreProps>()((set) => ({
  modalConfirmation: initialState,
  showModalConfirmation: (modalConfirmation: Omit<ModalConfirmationProps, "isVisible">) =>
    set({
      modalConfirmation: {
        ...modalConfirmation,
        isVisible: true,
      },
    }),
  closeModalConfirmation: () => set({ modalConfirmation: initialState }),
}));
