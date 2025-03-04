import { cn } from "@/utils";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { InputErrorMessage } from "../InputErrorMessage";
import { ThemedText } from "../ThemedText";
import { InputPriorityData, InputPriorityInterface } from "./index.type";
import { ThemedView } from "@/components/ThemedView";
import twrnc from "twrnc";
import { useBackHandlerBottomSheet } from "@/hooks/useBackHandlerBottomSheet";
import { Priority, PriorityColorMapper } from "@/enums/priority";

const SelectList = memo((props: { value: InputPriorityData; onPress: () => void }) => {
  const { value, onPress } = props;

  return (
    <ThemedView style={twrnc`my-1`}>
      <TouchableOpacity onPress={onPress} style={[twrnc`px-2 py-3 rounded-xl border mb-1 border-slate-300`]}>
        <ThemedText
          fontWeight={"bold"}
          variant={"medium"}
          textAlign="center"
          color={PriorityColorMapper[value.value as Priority]}
        >
          {value.label}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
});

SelectList.displayName = "SelectList";

const data = Object.values(Priority).map((item) => ({ label: item, value: item }));

export const InputPriority = (props: InputPriorityInterface) => {
  const {
    value,
    placeholder,
    onChange,
    isDisabled = false,
    error,
    label,
    containerStyle,
    onSheetChanges,
    isRequired = false,
  } = props;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  const { onChange: onChangeBottomSheet } = useBackHandlerBottomSheet(bottomSheetModalRef);

  const selectedValue = useMemo(() => data.find((item) => String(item.value) === String(value)), [value]);

  return (
    <View style={[twrnc`relative`, containerStyle]}>
      {label && (
        <View style={twrnc`flex flex-row items-start`}>
          <ThemedText variant="medium" style={twrnc`mb-1.5`}>
            {label}
          </ThemedText>
          {isRequired && (
            <ThemedText variant="small" fontWeight="bold" color="red-500">
              *
            </ThemedText>
          )}
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          twrnc`${cn(
            "border-slate-300 py-1 flex flex-row text-sm border",
            error ? "border-red-500" : "",
            isDisabled ? "bg-slate-200" : "bg-white rounded-lg",
            isDisabled ? "text-slate-400" : "text-slate-700",
          )}`,
        ]}
        onPress={openModal}
        disabled={isDisabled}
      >
        <ThemedView style={twrnc`h-9 flex items-start w-full flex-1 justify-center`}>
          <ThemedText
            variant="medium"
            fontWeight={selectedValue ? "bold" : "regular"}
            style={[twrnc`px-3`]}
            color={selectedValue ? PriorityColorMapper[selectedValue.value as Priority] : "slate-400"}
          >
            {selectedValue ? (selectedValue.label as string) : placeholder}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
      {error && <InputErrorMessage error={error} />}
      <BottomSheetModal
        key={`bottom-sheet-select-${label}`}
        ref={bottomSheetModalRef}
        onChange={(index) => {
          onChangeBottomSheet(index);
          onSheetChanges && onSheetChanges(index);
        }}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={true}
      >
        <BottomSheetView style={twrnc`flex-1`}>
          <View style={twrnc`p-4`}>
            <View style={twrnc`flex flex-row items-center justify-between`}>
              <ThemedText fontWeight="bold" variant="large">
                {label}
              </ThemedText>
            </View>
          </View>
          <ScrollView>
            <View style={[twrnc`px-4 pb-4`]}>
              {data.map((item, index) => (
                <SelectList
                  value={item}
                  key={index}
                  onPress={() => {
                    onChange(item);
                    bottomSheetModalRef.current?.close();
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
