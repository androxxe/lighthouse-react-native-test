import React from "react";
import { TextInput, ViewStyle } from "react-native";
import { TextVariantType } from "../ThemedText/index.type";

export type InputTextVariantType = "regular";

export type InputTypeSizeType = "regular" | "small";

export interface InputTextInterface extends React.ComponentProps<typeof TextInput> {
  variant?: InputTextVariantType;
  value: string;
  isRequired?: boolean;
  isNumerical?: boolean;
  isTextArea?: boolean;
  placeholder?: string;
  numberOfLines?: number;
  maxLength?: number;
  isDisabled?: boolean;
  error?: string | undefined | null | false;
  isSecureTextEntry?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  isFocus?: boolean;
  onDelete?: (() => void) | null;
  maxHeightTextArea?: number;
  label?: string;
  containerStyle?: ViewStyle;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  autoCorrect?: boolean;
  fontSize?: TextVariantType;
  // TODO: REMOVE REDUDANCY
  size?: InputTypeSizeType;
  counter?: {
    max?: number;
  };
}
