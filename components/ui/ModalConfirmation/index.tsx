import { Modal, View } from "react-native";
import { Button } from "../Button";
import { ThemedText } from "../ThemedText/index";
import { useModalConfirmationStore } from "@/hooks/states/useModalConfirmationStore";
import twrnc from "twrnc";

export const ModalConfirmation = () => {
  const {
    modalConfirmation: { message, onConfirm, onCancel, isVisible, title, cancelText, confirmText },
  } = useModalConfirmationStore();

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={twrnc`w-full absolute h-full bg-slate-800 opacity-50`} />
      <View
        style={twrnc`w-[75%] bg-white p-4 rounded-xl self-center flex items-center justify-center flex-col my-auto`}
      >
        <View style={twrnc`flex flex-col items-center justify-center`}>
          {title && (
            <View style={twrnc`my-3`}>
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
        <View style={twrnc`relative gap-y-3 w-full`}>
          <View>
            <Button
              label={confirmText ? confirmText : "Yakin"}
              variant="background"
              onPress={onConfirm}
              fontSize="medium"
              containerStyle={twrnc`w-full`}
            />
          </View>
          <View>
            <Button
              label={cancelText ? cancelText : "Batal"}
              variant="secondary"
              onPress={onCancel}
              fontSize="medium"
              containerStyle={twrnc`w-full`}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
