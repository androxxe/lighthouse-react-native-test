import { ThemedText } from "../ThemedText/index";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { widthByScale } from "@/utils";
import { InputCheckboxData, InputCheckboxInterface, InputCheckboxVariantType } from "./index.type";
import { InputErrorMessage } from "../InputErrorMessage";
import { Feather } from "@expo/vector-icons";
import twrnc from "twrnc";

const InputCheckboxBase = (props: InputCheckboxInterface) => {
  const { label, containerStyle, children, isRequired } = props;

  return (
    <View style={[twrnc`relative`, containerStyle]}>
      <View style={twrnc`flex flex-row items-center justify-between`}>
        {label && (
          <View style={twrnc`flex flex-row items-center`}>
            <ThemedText variant="small">{label}</ThemedText>
            {isRequired && (
              <ThemedText variant="small" fontWeight="bold" color="danger">
                *
              </ThemedText>
            )}
          </View>
        )}
      </View>
      {children}
    </View>
  );
};

const InputCheckboxRegular = (props: InputCheckboxInterface) => {
  const { isDisabled = false, error, data, onChange, value } = props;

  const [selectedValue, setSelectedValue] = useState<InputCheckboxData[] | undefined>(undefined);

  const handleChange = useCallback(
    (item: InputCheckboxData) => {
      const _selectedValue = () => {
        if (selectedValue) {
          let newData = [...selectedValue];

          if (newData.find((data) => data.value === item.value)) {
            newData = newData.filter((data) => data.value !== item.value);
          } else {
            newData.push(item);
          }

          return newData;
        }

        return [item];
      };

      setSelectedValue(_selectedValue());
      onChange(_selectedValue());
    },
    [selectedValue, onChange],
  );

  useEffect(() => {
    if (value && value?.length > 0) {
      const filteredData = data.filter((item) => value.includes(item.value));
      setSelectedValue(filteredData);
    }
  }, [value, data]);

  return (
    <InputCheckboxBase {...props}>
      <View style={twrnc`mt-2`}>
        {data.map((item, index) => (
          <TouchableOpacity
            disabled={isDisabled}
            activeOpacity={0.8}
            key={index}
            style={twrnc`flex flex-row items-center gap-x-2`}
            onPress={() => handleChange(item)}
          >
            <View
              style={[
                twrnc`w-4 h-4 rounded-md flex items-center justify-center`,
                {
                  backgroundColor: selectedValue?.find((data) => data.value === item.value)?.value
                    ? twrnc.color("purple-500")
                    : twrnc.color("slate-300"),
                },
              ]}
            >
              {selectedValue?.find((data) => data.value === item.value)?.value && (
                <Feather name="check" size={widthByScale(3.6)} color={twrnc.color("white")} />
              )}
            </View>
            <ThemedText variant="medium" style={twrnc`mb-1`} color={isDisabled ? "gumbo" : undefined}>
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      {error && <InputErrorMessage error={error} />}
    </InputCheckboxBase>
  );
};

export const InputCheckbox = (props: InputCheckboxInterface) => {
  const { variant = "regular" } = props;

  const InputCheckboxMapper: Record<InputCheckboxVariantType, React.ReactNode> = {
    regular: <InputCheckboxRegular {...props} />,
  };

  return InputCheckboxMapper[variant];
};
