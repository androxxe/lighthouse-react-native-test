import twrnc from "twrnc";
import { Button } from "./ui/Button";
import { View } from "react-native";
import { useBottomSheetCreateTaskContext } from "@/hooks/stores/useBottomSheetCreateTaskStore";
import { Feather } from "@expo/vector-icons";

export const ButtonCreateTask = () => {
  const { setIsVisible, setDefaultValue } = useBottomSheetCreateTaskContext();

  return (
    <View style={twrnc`p-4 flex items-end`}>
      <Button
        borderColor={twrnc.color("purple-500")}
        backgroundColor={twrnc.color("purple-500")}
        variant="icon"
        containerStyle={twrnc`w-12 h-12 p-0`}
        icon={<Feather name="plus" size={24} color={twrnc.color("white")} />}
        onPress={() => {
          setIsVisible(true);
          setDefaultValue(undefined);
        }}
      />
    </View>
  );
};
