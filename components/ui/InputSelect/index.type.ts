import React from "react";
import { ViewStyle } from "react-native";

export type InputSelectVariantType = "regular";

export interface InputSelectBaseInterface {
  variant: InputSelectVariantType;
  onDeleteSelection?: (data: InputSelectData) => void;
  data: InputSelectData[];
  placeholder?: string;
  isDisabled?: boolean;
  error?: string | false | undefined;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onDelete?: (() => void) | null;
  label?: string;
  containerStyle?: ViewStyle;
  onSheetChanges?: (index: number) => void;
  searchPlaceholder?: string;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  isSearchable?: boolean;
  isRequired?: boolean;
}
export type InputSelectInterface = InputSelectSingleInterface | InputSelectMultipleInterface;

export interface InputSelectSingleInterface extends InputSelectBaseInterface {
  variant: InputSelectVariantType;
  value: string | number;
  isMultiple?: false;
  onChange: (data: InputSelectData) => void;
}

export interface InputSelectMultipleInterface extends InputSelectBaseInterface {
  variant: InputSelectVariantType;
  value: string[];
  isMultiple: true;
  onChange: (data: InputSelectData[]) => void;
}

export interface InputSelectData {
  label: string | number;
  value: string | number | boolean;
}
