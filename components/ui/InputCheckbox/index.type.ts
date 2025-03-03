import React from "react";
import { ViewStyle } from "react-native";

export type InputCheckboxVariantType = "regular";

export interface InputCheckboxRegularInterface {
  variant: "regular";
  value: (string | number)[] | undefined;
  isRequired?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  error?: string | undefined | null | false;
  onChange: (data: InputCheckboxData[]) => void;
  label?: string;
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
  data: InputCheckboxData[];
}

export type InputCheckboxInterface = InputCheckboxRegularInterface;

export interface InputCheckboxData {
  label: string | number;
  value: string | number;
}
