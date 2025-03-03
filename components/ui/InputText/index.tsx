import { ThemedText, fontFamilyMapper, fontSizeMapper } from "@/components/ui/ThemedText/index";
import React, { useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { cn, getFontSizeByScale, widthByScale } from "@/utils";
import { InputTextInterface, InputTextVariantType, InputTypeSizeType } from "./index.type";
import { InputErrorMessage } from "../InputErrorMessage";
import Feather from "@expo/vector-icons/Feather";
import twrnc from "twrnc";

// TODO: Fix this
const sizeMapper: Record<InputTypeSizeType, string> = {
  regular: "py-2 px-3",
  small: "py-1 px-3",
};

const InputTextBase = (props: InputTextInterface) => {
  const { value, error, label, containerStyle, counter, children, isRequired } = props;

  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  return (
    <View style={[twrnc`relative`, containerStyle]}>
      <View style={twrnc`flex flex-row items-center justify-between`}>
        {label && (
          <View style={twrnc`flex flex-row items-center mb-1.5`}>
            <ThemedText variant="medium">{label}</ThemedText>
            {isRequired && (
              <ThemedText variant="small" fontWeight="bold" color="danger">
                *
              </ThemedText>
            )}
          </View>
        )}
        {counter && (
          <ThemedText variant="small" style={twrnc`mb-1`}>
            {value.length}/{counter.max}
          </ThemedText>
        )}
      </View>
      {children}
      {error && <InputErrorMessage error={error} />}
    </View>
  );
};

const InputTextRegular = (props: InputTextInterface) => {
  const {
    onBlur,
    isNumerical,
    isTextArea,
    onChangeText,
    maxLength,
    numberOfLines = 10,
    isDisabled = false,
    error,
    isSecureTextEntry,
    onDelete,
    maxHeightTextArea,
    isFocus: isFocusProp,
    autoCorrect = false,
    counter,
    fontSize,
    size = "regular",
    ...restProps
  } = props;

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isHidePassword, setIsHidePassword] = useState<boolean>(false);

  useEffect(() => {
    if (isSecureTextEntry) {
      setIsHidePassword(true);
    }
  }, [isSecureTextEntry]);

  useEffect(() => {
    if (isFocusProp !== undefined) setIsFocus(isFocusProp);
  }, [isFocusProp]);

  return (
    <InputTextBase {...props}>
      <View
        style={twrnc`${cn(
          "flex flex-row text-sm border rounded-lg",
          error ? "border-red-500" : isFocus ? "border-blue-500" : "border-gray-400",
          isDisabled ? "text-gray-400 bg-gray-200" : "bg-white text-gray-700",
          "p-0",
        )}`}
      >
        {props.prefixIcon && (
          <TouchableOpacity style={twrnc`pl-3 flex items-center justify-center`}>{props.prefixIcon}</TouchableOpacity>
        )}
        <TextInput
          maxLength={maxLength || counter?.max}
          onChangeText={(newText) => {
            onChangeText && onChangeText(isNumerical ? newText.replace(/[^0-9]/g, "") : newText);
          }}
          onBlur={(e) => {
            onBlur && onBlur(e);
            setIsFocus(false);
          }}
          multiline={isTextArea}
          numberOfLines={isTextArea ? numberOfLines : 1}
          textAlignVertical={isTextArea ? "top" : "center"}
          placeholderTextColor={twrnc.color("slate-400")}
          allowFontScaling={false}
          autoCorrect={autoCorrect}
          underlineColorAndroid="transparent"
          editable={!isDisabled}
          secureTextEntry={isSecureTextEntry ? isHidePassword : false}
          onFocus={() => {
            setIsFocus(true);
          }}
          style={{
            maxHeight: isTextArea ? (maxHeightTextArea ?? 200) : undefined,
            fontFamily: fontFamilyMapper["regular"],
            fontSize: getFontSizeByScale(fontSizeMapper[fontSize ?? "medium"]),
            ...twrnc`${cn("flex-1 text-gray-700 my-0.5", sizeMapper[size])}`,
          }}
          {...restProps}
        />
        {onDelete && props.value !== "" && (
          <TouchableOpacity style={twrnc`pr-3 flex items-center justify-center"`} onPress={onDelete}>
            <Feather name="x" color={twrnc.color("slate-300")} size={widthByScale(4)} />
          </TouchableOpacity>
        )}
        {props.suffixIcon && (
          <TouchableOpacity style={twrnc`pr-3 flex items-center justify-center"`}>{props.suffixIcon}</TouchableOpacity>
        )}
        {isSecureTextEntry && (
          <TouchableOpacity
            style={twrnc`pr-3 flex items-center justify-center`}
            onPress={() => setIsHidePassword(!isHidePassword)}
          >
            <Feather
              name={isHidePassword ? "eye" : "eye-off"}
              color={isFocus ? twrnc.color("purple-500") : twrnc.color("slate-300")}
              size={widthByScale(4)}
            />
          </TouchableOpacity>
        )}
      </View>
    </InputTextBase>
  );
};

export const InputText = (props: InputTextInterface) => {
  const { variant = "regular" } = props;

  const inputTextMapper: Record<InputTextVariantType, React.ReactNode> = {
    regular: <InputTextRegular {...props} />,
  };

  return inputTextMapper[variant];
};
