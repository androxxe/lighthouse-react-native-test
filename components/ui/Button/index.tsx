import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import {
  ButtonBaseProps,
  ButtonIconProps,
  ButtonInterface,
  ButtonSizeType,
  ButtonVariantInterface,
  ButtonVariantType,
} from "./index.type";
import { cn, widthByScale } from "@/utils";
import { ThemedText } from "@/components/ui/ThemedText";
import twrnc from "twrnc";

const buttonSizeMapper: Record<ButtonSizeType, string> = {
  "extra-small": "py-1 px-1",
  small: "py-2 px-4",
  regular: "py-3 px-6",
};

const ButtonIconBase = ({ leftIcon, rightIcon, children }: ButtonIconProps) => {
  return (
    <>
      {leftIcon && <View style={twrnc`mr-1`}>{leftIcon}</View>}
      <View style={{ marginHorizontal: leftIcon || rightIcon ? 4 : 0 }}>{children}</View>
      {rightIcon && <View style={twrnc`ml-1`}>{rightIcon}</View>}
    </>
  );
};

const ButtonBase = (props: ButtonBaseProps) => {
  const {
    backgroundColor,
    borderWidth,
    size = "regular",
    borderColor,
    width,
    height,
    children,
    onPress,
    disabled = false,
    containerStyle,
    isLoading,
    variant,
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={{
        borderWidth: borderWidth ?? 0,
        borderColor: borderColor ?? twrnc.color("slate-300"),
        backgroundColor: backgroundColor,
        ...(height ? { height: Number(height) } : {}),
        ...(width ? { width: Number(width) } : {}),
        ...twrnc`${cn(
          "flex items-center justify-center flex-row",
          size === "small" ? "rounded-lg" : size === "extra-small" ? "rounded-xl" : "rounded-xl",
          !height || !width ? buttonSizeMapper[size] : "",
        )}`,
        ...containerStyle,
      }}
    >
      {isLoading && (
        <ActivityIndicator
          size={widthByScale(6)}
          color={variant === "background" ? twrnc.color("white") : borderColor}
          style={twrnc`mr-2`}
        />
      )}
      {variant === "icon" && isLoading ? null : children}
    </TouchableOpacity>
  );
};

const ButtonBackground = (props: ButtonVariantInterface) => {
  const {
    onPress,
    color = "purple-500",
    fontWeight,
    fontSize,
    label,
    iconSize,
    leftIcon,
    rightIcon,
    iconColor,
    disabled = false,
    height,
    size,
    width,
    containerStyle,
    textClassName,
    isLoading,
  } = props;

  return (
    <ButtonBase
      size={size}
      onPress={disabled ? () => undefined : onPress}
      disabled={disabled}
      backgroundColor={twrnc.color(color)}
      height={height}
      width={width}
      containerStyle={twrnc`${cn(containerStyle, disabled ? "opacity-50" : "")}`}
      isLoading={isLoading}
      variant={"background"}
    >
      <ButtonIconBase leftIcon={leftIcon} rightIcon={rightIcon} iconColor={iconColor} size={iconSize}>
        <ThemedText
          fontWeight={fontWeight || "bold"}
          variant={fontSize ? fontSize : size === "small" ? "small" : size === "extra-small" ? "extra-small" : "medium"}
          style={twrnc`${textClassName ?? ""}`}
          color={"white"}
        >
          {label}
        </ThemedText>
      </ButtonIconBase>
    </ButtonBase>
  );
};

const ButtonSecondary = (props: ButtonVariantInterface) => {
  const {
    onPress,
    color = "purple-700",
    fontWeight,
    fontSize,
    label,
    iconSize,
    leftIcon,
    rightIcon,
    iconColor,
    disabled = false,
    height,
    size,
    width,
    containerStyle,
    textClassName,
    isLoading,
  } = props;

  return (
    <ButtonBase
      size={size}
      onPress={disabled ? () => undefined : onPress}
      disabled={disabled}
      backgroundColor={twrnc.color("transparent")}
      height={height}
      width={width}
      borderWidth={1.5}
      borderColor={twrnc.color("purple-700")}
      containerStyle={containerStyle}
      isLoading={isLoading}
      variant="secondary"
    >
      <ButtonIconBase leftIcon={leftIcon} rightIcon={rightIcon} iconColor={iconColor} size={iconSize}>
        <ThemedText
          fontWeight={fontWeight || "bold"}
          variant={fontSize ? fontSize : size === "small" ? "small" : size === "extra-small" ? "extra-small" : "medium"}
          style={twrnc`${cn(textClassName, disabled ? "opacity-50" : "")}`}
          color={color}
        >
          {label}
        </ThemedText>
      </ButtonIconBase>
    </ButtonBase>
  );
};

const ButtonIcon = (props: ButtonVariantInterface) => {
  const {
    onPress,
    color = "purple-500",
    icon,
    backgroundColor,
    borderColor,
    disabled = false,
    height,
    size,
    width,
    containerStyle,
    isLoading,
  } = props;

  return (
    <ButtonBase
      size={size}
      onPress={disabled ? () => undefined : onPress}
      disabled={disabled}
      backgroundColor={backgroundColor || twrnc.color("transparent")}
      height={height}
      width={width}
      borderWidth={1}
      borderColor={borderColor || color}
      containerStyle={containerStyle}
      isLoading={isLoading}
      variant="icon"
    >
      {icon}
    </ButtonBase>
  );
};

// TODO: FIX THIS TYPE
export const Button = (props: ButtonInterface) => {
  const buttonVariantMapper: Record<ButtonVariantType, React.ReactNode> = {
    background: <ButtonBackground {...props} />,
    secondary: <ButtonSecondary {...props} />,
    icon: <ButtonIcon {...props} />,
  };

  return buttonVariantMapper[props.variant];
};
