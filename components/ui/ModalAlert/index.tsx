import { Modal, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { Button } from "../Button";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { BaseVariant } from "@/types/base-variant";
import { useModalAlertStore } from "@/hooks/states/useModalAlertStore";
import twrnc from "twrnc";

export const ModalAlert = () => {
  const {
    modalAlert: { message, onPress, isVisible, title, variant, buttonText = "Ok" },
  } = useModalAlertStore();

  const mappingIcons: Record<BaseVariant, React.ReactNode> = {
    success: (
      <View
        style={{
          ...twrnc`w-20 h-20 rounded-full items-center justify-center`,
          backgroundColor: twrnc.color("green-200"),
        }}
      >
        <FontAwesome5 name="check" size={32} color={twrnc.color("green-500")} />
      </View>
    ),
    error: (
      <View style={twrnc`w-20 h-20 rounded-full items-center justify-center`}>
        <View
          style={{
            ...twrnc`absolute top-0 left-0 w-full h-full rounded-full`,
            backgroundColor: twrnc.color("red-500"),
            opacity: 0.15,
          }}
        />
        <FontAwesome5 name="times" size={32} color={twrnc.color("red-500")} />
      </View>
    ),
    warning: (
      <View style={twrnc`w-20 h-20 rounded-full items-center justify-center`}>
        <View
          style={{
            ...twrnc`absolute top-0 left-0 w-full h-full rounded-full`,
            backgroundColor: twrnc.color("orange-500"),
            opacity: 0.15,
          }}
        />
        <FontAwesome5 name="exclamation" size={32} color={twrnc.color("orange-500")} />
      </View>
    ),
    info: (
      <View style={twrnc`w-20 h-20 rounded-full items-center justify-center`}>
        <View
          style={{
            ...twrnc`absolute top-0 left-0 w-full h-full rounded-full`,
            backgroundColor: twrnc.color("purple-500"),
            opacity: 0.15,
          }}
        />
        <FontAwesome5 name="info" size={32} color={twrnc.color("purple-500")} />
      </View>
    ),
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={twrnc`w-full absolute h-full bg-slate-800 opacity-50`} />
      <View
        style={twrnc`w-[75%] bg-white rounded-xl p-4 self-center flex items-center justify-center flex-col my-auto`}
      >
        <View style={twrnc`mb-4 mt-2`}>{mappingIcons[variant]}</View>
        <View>
          {title && (
            <View style={twrnc`mb-3`}>
              <ThemedText textAlign="center" variant="extra-large" fontWeight="bold">
                {title}
              </ThemedText>
            </View>
          )}
          <View style={twrnc`mb-6`}>
            <ThemedText textAlign="center" variant="medium">
              {message}
            </ThemedText>
          </View>
        </View>
        <Button
          label={buttonText}
          variant="background"
          onPress={onPress}
          fontSize="medium"
          containerStyle={twrnc`w-full`}
        />
      </View>
    </Modal>
  );
};
