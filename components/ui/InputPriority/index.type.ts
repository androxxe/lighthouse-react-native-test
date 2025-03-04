import { ViewStyle } from "react-native";

export interface InputPriorityInterface {
  placeholder?: string;
  isDisabled?: boolean;
  error?: string | false | undefined;
  label?: string;
  containerStyle?: ViewStyle;
  onSheetChanges?: (index: number) => void;
  isRequired?: boolean;
  value: string | number;
  onChange: (data: InputPriorityData) => void;
}

export interface InputPriorityData {
  label: string | number;
  value: string | number | boolean;
}
