import React from "react";
import { ViewStyle } from "react-native";
import { CalendarProps } from "react-native-calendars";

export interface InputDatePickerInterface {
  variant: "regular";
  value: Date | undefined;
  onChange: (data: Date) => void;
  placeholder?: string;
  isDisabled?: boolean;
  error?: string | undefined;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onDelete?: (() => void) | null;
  label?: string;
  containerStyle?: ViewStyle;
  onSheetChanges?: (index: number) => void;
  saveButtonLabel?: string;
  displayFormat?: DisplayFormatType;
  calendar?: CalendarProps;
}

export type DisplayFormatType = "DD MMMM YYYY" | "DD/MM/YYYY";
