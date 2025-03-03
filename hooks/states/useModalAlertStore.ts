import { ModalAlertProps } from "@/components/ui/ModalAlert/index.type";
import { create } from "zustand";

interface UseModalAlertStoreProps {
  modalAlert: ModalAlertProps;
  showModalAlert: (props: Omit<ModalAlertProps, "isVisible">) => void;
  closeModalAlert: () => void;
}

const initialState: ModalAlertProps = {
  variant: "info",
  isVisible: false,
  title: "",
  message: "",
  onPress: () => undefined,
  buttonText: "Cancel",
};

export const useModalAlertStore = create<UseModalAlertStoreProps>()((set) => ({
  modalAlert: initialState,
  showModalAlert: (modalAlert: Omit<ModalAlertProps, "isVisible">) =>
    set({
      modalAlert: {
        ...modalAlert,
        isVisible: true,
      },
    }),
  closeModalAlert: () => set({ modalAlert: initialState }),
}));
