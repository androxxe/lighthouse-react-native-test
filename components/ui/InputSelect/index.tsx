import { cn, widthByScale } from "@/utils";
import { AntDesign, Feather } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import Fuse from "fuse.js";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import colors from "tailwindcss/colors";
import { InputErrorMessage } from "../InputErrorMessage";
import { InputText } from "../InputText";
import { ThemedText } from "../ThemedText";
import { InputSelectData, InputSelectInterface, InputSelectVariantType } from "./index.type";
import { ThemedView } from "@/components/ThemedView";
import twrnc from "twrnc";
import { useBackHandlerBottomSheet } from "@/hooks/useBackHandlerBottomSheet";
import { Button } from "../Button";

const fuseOptions = {
  includeScore: true,
  keys: ["label"],
  threshold: 0.4,
};

// eslint-disable-next-line react/display-name
const SelectList = memo(
  (props: {
    variant: InputSelectVariantType;
    value: InputSelectData;
    isSelected: boolean;
    onPress: () => void;
    onPressRemove?: (data: InputSelectData) => void;
    onPressUpdate?: (data: InputSelectData) => void;
  }) => {
    const { value, onPress, isSelected, onPressRemove, onPressUpdate } = props;

    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const [label, setLabel] = useState<string>(String(value.label));

    return (
      <ThemedView style={twrnc`my-1`}>
        {isEditMode && onPressUpdate ? (
          <InputText
            value={label}
            variant="regular"
            onSubmitEditing={(data) => {
              onPressUpdate({
                label: data.nativeEvent.text,
                value: value.value,
              });
              setIsEditMode(false);
            }}
            onChangeText={(data) => setLabel(data)}
            autoFocus
            suffixIcon={
              <TouchableOpacity onPress={() => setIsEditMode(false)}>
                <Feather name="x" size={18} color={twrnc.color("purple-800")} />
              </TouchableOpacity>
            }
          />
        ) : (
          <TouchableOpacity
            onPress={onPress}
            style={[
              {
                borderColor: isSelected ? twrnc.color("purple-500") : twrnc.color("slate-300"),
              },
              twrnc`px-4 py-3 rounded-xl border mb-1 flex-row items-center flex justify-between`,
            ]}
          >
            <ThemedText
              fontWeight={"regular"}
              variant={"medium"}
              textAlign="center"
              color={isSelected ? "purple-500" : undefined}
            >
              {value.label}
            </ThemedText>
            <View style={twrnc`flex-row items-center gap-x-1`}>
              <TouchableOpacity
                style={twrnc`flex-row items-center gap-x-2 border rounded-md px-2 py-1 border-purple-400`}
                onPress={() => setIsEditMode(true)}
              >
                <Feather name="edit" size={14} color={twrnc.color("purple-800")} />
              </TouchableOpacity>
              {onPressRemove && (
                <TouchableOpacity
                  style={twrnc`flex-row items-center gap-x-2 border rounded-md px-2 py-1 border-red-400`}
                  onPress={() =>
                    Alert.alert("Hapus", "Apakah anda yakin ingin menghapus?", [
                      {
                        text: "Ya",
                        onPress: () => {
                          onPressRemove(value);
                        },
                      },
                      { text: "Tidak", style: "cancel" },
                    ])
                  }
                >
                  <Feather name="trash" size={14} color={twrnc.color("red-800")} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  },
);

export const InputSelect = (props: InputSelectInterface) => {
  const {
    value,
    isMultiple,
    placeholder,
    onChange,
    onDeleteSelection,
    isDisabled = false,
    error,
    prefixIcon,
    suffixIcon,
    onDelete,
    label,
    containerStyle,
    data,
    onSheetChanges,
    searchPlaceholder = "Cari atau buat baru..",
    variant = "regular",
    isRequired = false,
    onPressAdd,
    onPressUpdate,
    onPressRemove,
  } = props;

  const [search, setSearch] = useState<string>("");
  const [dataFiltered, setDataFiltered] = useState<InputSelectData[]>(data);
  const [selectedValues, setSelectedValues] = useState<InputSelectData[]>([]);

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

  const fuse = useMemo(() => new Fuse(data, fuseOptions), [data]);

  useEffect(() => {
    if (search) {
      const result = fuse.search(search);
      setDataFiltered(result.map((item) => item.item));
    } else {
      setDataFiltered(data);
    }
  }, [search, data, fuse]);

  const selectedValue = useMemo(
    () => (!isMultiple ? data.find((item) => String(item.value) === String(value)) : undefined),
    [data, isMultiple, value],
  );

  useEffect(() => {
    if (value && isMultiple) {
      setSelectedValues(data.filter((item) => (value as string[]).includes(String(item.value))));
    }
  }, [value, data, isMultiple]);

  return (
    <View style={[twrnc`relative`, containerStyle]}>
      {label && (
        <View style={twrnc`flex flex-row items-center`}>
          <ThemedText variant="medium" style={twrnc`mb-1.5`}>
            {label}
          </ThemedText>
          {isRequired && (
            <ThemedText variant="small" fontWeight="bold" color="danger">
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
        {prefixIcon && (
          <TouchableOpacity style={twrnc`flex items-center justify-center pl-3`}>{prefixIcon}</TouchableOpacity>
        )}
        {isMultiple ? (
          <View
            style={[twrnc`flex-1 flex flex-row flex-wrap`, selectedValues.length > 0 ? twrnc`py-1` : twrnc`py-2.5`]}
          >
            {selectedValues && selectedValues.length > 0 ? (
              selectedValues?.map((item, index) => (
                <ThemedView
                  key={index}
                  style={[twrnc`ml-2 flex flex-row items-center border border-slate-300 rounded-lg px-2 py-1 mb-1`]}
                >
                  <ThemedText variant="small" style={twrnc`mr-2`} numberOfLines={2} ellipsizeMode="tail">
                    {(item.label as string) ?? "-"}
                  </ThemedText>
                  <TouchableOpacity onPress={() => onDeleteSelection?.(item)}>
                    <Feather name="x" size={widthByScale(4)} color={twrnc.color("red-500")} />
                  </TouchableOpacity>
                </ThemedView>
              ))
            ) : (
              <ThemedText
                variant="medium"
                fontWeight="regular"
                style={twrnc`px-3 flex-1 self-center justify-center items-center`}
                color={"slate-400"}
              >
                {placeholder}
              </ThemedText>
            )}
          </View>
        ) : (
          <ThemedView style={twrnc`h-9 flex items-start w-full flex-1 justify-center`}>
            <ThemedText
              variant="medium"
              fontWeight="regular"
              style={[twrnc`px-3`]}
              color={selectedValue ? undefined : "slate-400"}
            >
              {selectedValue ? (selectedValue.label as string) : placeholder}
            </ThemedText>
          </ThemedView>
        )}

        {onDelete && value !== "" && (
          <TouchableOpacity style={twrnc`flex items-center justify-center pr-3`} onPress={onDelete}>
            <AntDesign name="close" color={colors.slate[400]} size={widthByScale(5)} />
          </TouchableOpacity>
        )}
        {suffixIcon ? (
          <TouchableOpacity onPress={openModal} style={twrnc`flex items-center justify-center pr-3`}>
            {suffixIcon}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openModal} style={twrnc`flex items-center justify-center pr-3`}>
            <Feather name="chevron-down" size={widthByScale(5)} />
          </TouchableOpacity>
        )}
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
        enablePanDownToClose={!isMultiple}
      >
        <BottomSheetView style={twrnc`flex-1`}>
          <View style={twrnc`p-4`}>
            <View style={twrnc`flex flex-row items-center justify-between`}>
              <ThemedText fontWeight="bold" variant="large" style={twrnc`flex-1`}>
                {label}
              </ThemedText>
            </View>
            <InputText
              containerStyle={twrnc`mt-4`}
              placeholder={searchPlaceholder}
              onChangeText={(search) => setSearch(search)}
              suffixIcon={
                <View style={twrnc`flex-1 items-center flex-row gap-x-2`}>
                  {dataFiltered.length > 0 ? (
                    <Feather name="search" size={16} color={twrnc.color("slate-300")} />
                  ) : onPressAdd ? (
                    <Button
                      rightIcon={<Feather name="plus" size={16} color={twrnc.color("white")} />}
                      variant="background"
                      size="small"
                      label="Tambah"
                      onPress={() => onPressAdd(search)}
                    />
                  ) : null}
                </View>
              }
            />
          </View>
          <ScrollView>
            <View style={[twrnc`px-4`, !isMultiple && twrnc`pb-4`]}>
              {dataFiltered.map((item, index) => (
                <SelectList
                  value={item}
                  key={index}
                  variant={variant}
                  onPressUpdate={onPressUpdate}
                  onPressRemove={onPressRemove}
                  isSelected={selectedValues?.some((selected) => selected.value === item.value) || false}
                  onPress={() => {
                    if (!isMultiple) {
                      onChange(item);
                      bottomSheetModalRef.current?.close();
                    } else {
                      const newSelectedValues = selectedValues.some((selected) => selected.value === item.value)
                        ? selectedValues.filter((selected) => selected.value !== item.value)
                        : [...selectedValues, item];

                      setSelectedValues(newSelectedValues);
                    }
                  }}
                />
              ))}
            </View>
          </ScrollView>
          {isMultiple && dataFiltered.length > 0 ? (
            <ThemedView style={twrnc`p-4`}>
              <Button
                variant="secondary"
                label="Simpan"
                onPress={() => {
                  onChange(selectedValues ?? []);
                  bottomSheetModalRef.current?.close();
                }}
              />
            </ThemedView>
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
