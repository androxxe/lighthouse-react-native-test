import { BaseVariant } from "@/types/base-variant";

export interface ModalAlertProps {
  variant: ModalAlertVariantType;
  isVisible: boolean;
  title?: string;
  message: string;
  onPress: () => void;
  buttonText?: string;
}

export type ModalAlertVariantType = BaseVariant;
