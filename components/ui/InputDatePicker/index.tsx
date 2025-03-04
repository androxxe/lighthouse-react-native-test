import React, { useRef, useState, useCallback, RefObject, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";
import { cn, widthByScale } from "@/utils";
import { InputDatePickerInterface } from "./index.type";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { AntDesign, Feather } from "@expo/vector-icons";
import { fontFamilyMapper, ThemedText } from "../ThemedText";
import { InputErrorMessage } from "../InputErrorMessage";
import { Calendar, DateData } from "react-native-calendars";
import dayjs from "dayjs";
import { Button } from "../Button";
import { useBackHandler } from "@/hooks/useBackHandler";
import twrnc from "twrnc";
import { useBackHandlerBottomSheet } from "@/hooks/useBackHandlerBottomSheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

const InputDatePickerBase = (props: InputDatePickerInterface & { sheetRef: RefObject<BottomSheetModal> }) => {
  const {
    value,
    label,
    onSheetChanges,
    onChange,
    saveButtonLabel = "Pilih Tanggal",
    calendar,
    sheetRef: bottomSheetModalRef,
  } = props;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [openedMonthCalendar, setOpenedMonthCalendar] = useState<Date>(value ?? dayjs().toDate());

  const { isOpen, onChange: onChangeSheet } = useBackHandlerBottomSheet(bottomSheetModalRef);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  useBackHandler(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.close();

      return true;
    }

    return false;
  });

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      onChange={(index) => {
        onChangeSheet(index);
        onSheetChanges && onSheetChanges(index);
      }}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={twrnc`flex-1`}>
        <View style={twrnc`p-4 flex flex-row items-center justify-between`}>
          <ThemedText fontWeight="bold" variant="large">
            {label}
          </ThemedText>
          <View style={twrnc`flex flex-row items-center`}>
            <TouchableOpacity
              onPress={() => {
                setOpenedMonthCalendar(dayjs(openedMonthCalendar).subtract(1, "year").toDate());
              }}
            >
              <Feather name="chevron-left" size={widthByScale(6)} color={twrnc.color("purple-500")} />
            </TouchableOpacity>
            <ThemedText variant="small" style={twrnc`text-slate-500`}>
              {dayjs(openedMonthCalendar).format("YYYY")}
            </ThemedText>
            <TouchableOpacity
              onPress={() => {
                setOpenedMonthCalendar(dayjs(openedMonthCalendar).add(1, "year").toDate());
              }}
            >
              <Feather name="chevron-right" size={widthByScale(6)} color={twrnc.color("purple-500")} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={twrnc`w-full pb-5`}>
          <Calendar
            {...calendar}
            initialDate={dayjs(openedMonthCalendar).format("YYYY-MM-DD")}
            onDayPress={(day: DateData) => {
              setSelectedDate(dayjs(day.dateString).toDate());
            }}
            onMonthChange={(month: DateData) => {
              setOpenedMonthCalendar(dayjs(month.dateString).toDate());
            }}
            markedDates={{
              [dayjs().format("YYYY-MM-DD")]: {
                selected: true,
                selectedColor: twrnc.color("purple-100"),
                selectedTextColor: twrnc.color("purple-500"),
              },
              ...(selectedDate ? { [dayjs(selectedDate).format("YYYY-MM-DD")]: { selected: true } } : undefined),
              ...calendar?.markedDates,
            }}
            theme={{
              selectedDayBackgroundColor: twrnc.color("purple-500"),
              selectedDotColor: twrnc.color("white"),
              dotColor: twrnc.color("orange-300"),
              textDayFontFamily: fontFamilyMapper["regular"],
              textMonthFontFamily: fontFamilyMapper["bold"],
              textDayHeaderFontFamily: fontFamilyMapper["bold"],
              arrowColor: twrnc.color("purple-500"),
              ...calendar?.theme,
            }}
          />
          <View style={twrnc`pt-5 px-5`}>
            <Button
              label={saveButtonLabel}
              variant="background"
              onPress={() => {
                if (!selectedDate) return;

                onChange(selectedDate);
                bottomSheetModalRef.current?.close();
              }}
              fontSize="medium"
              containerStyle={twrnc`w-full`}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const InputDatePickerRegular = (props: InputDatePickerInterface) => {
  const {
    containerStyle,
    value,
    placeholder,
    isDisabled = false,
    error,
    prefixIcon,
    suffixIcon,
    onDelete,
    label,
    displayFormat = "DD/MM/YYYY",
  } = props;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={[twrnc`relative`, containerStyle]}>
      {label && (
        <ThemedText variant="medium" style={twrnc`mb-1.5`}>
          {label}
        </ThemedText>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        style={twrnc`${cn(
          "py-1 flex flex-row text-sm border rounded-lg",
          error ? "border-red-500" : "border-slate-300",
          isDisabled ? "bg-slate-200" : "bg-white",
          isDisabled ? "text-slate-400" : "text-slate-700",
        )}`}
        onPress={openModal}
      >
        {prefixIcon && (
          <TouchableOpacity style={twrnc`pl-3 flex items-center justify-center`}>{prefixIcon}</TouchableOpacity>
        )}
        <ThemedText
          variant="medium"
          fontWeight="regular"
          style={[
            {
              flex: 1,
            },
            twrnc`py-2 px-3 flex-1`,
          ]}
        >
          {value ? (dayjs(value).format(displayFormat) as string) : placeholder}
        </ThemedText>
        {onDelete && value && (
          <TouchableOpacity style={twrnc`pr-3 flex items-center justify-center`} onPress={onDelete}>
            <AntDesign name="close" color={colors.slate[400]} size={widthByScale(4)} />
          </TouchableOpacity>
        )}
        {suffixIcon ? (
          <TouchableOpacity onPress={openModal} style={twrnc`pr-3 flex items-center justify-center`}>
            {suffixIcon}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openModal} style={twrnc`pr-3 flex items-center justify-center`}>
            <Feather
              name="calendar"
              size={widthByScale(4)}
              color={error ? twrnc.color("red-500") : twrnc.color("slate-300")}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {error && <InputErrorMessage error={error} />}
      <InputDatePickerBase {...props} sheetRef={bottomSheetModalRef} />
    </View>
  );
};

export const InputDatePicker = (props: InputDatePickerInterface) => {
  const { variant } = props;

  const inputDatePickerMapper: Record<"regular", React.ReactNode> = {
    regular: <InputDatePickerRegular {...props} />,
  };

  return inputDatePickerMapper[variant];
};
