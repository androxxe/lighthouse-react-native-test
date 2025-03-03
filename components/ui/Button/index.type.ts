import { ViewStyle } from "react-native";
import { FontWeightType, TextVariantType } from "../ThemedText/index.type";
import React from "react";

export type ButtonSizeType = "extra-small" | "small" | "regular";
export type ButtonVariantType = "background" | "secondary" | "icon";

export interface ButtonIconInterface {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconColor?: string;
  size?: string;
}
export interface ButtonIconProps extends ButtonIconInterface {
  children: React.ReactNode;
}

export interface ButtonBaseProps {
  backgroundColor?: string;
  borderWidth?: number;
  size?: ButtonSizeType;
  borderColor?: string;
  width?: number | string;
  height?: number;
  onPress: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  isLoading?: boolean;
  variant: ButtonVariantType;
}

export interface ButtonVariantInterface extends Omit<ButtonIconInterface, "size">, Omit<ButtonBaseProps, "variant"> {
  color?: string;
  label?: string;
  fontWeight?: FontWeightType;
  fontSize?: TextVariantType;
  fontColor?: string;
  iconSize?: string;
  icon?: React.ReactNode;
  textClassName?: string;
}

export interface ButtonInterface extends ButtonVariantInterface {
  variant: ButtonVariantType;
}
