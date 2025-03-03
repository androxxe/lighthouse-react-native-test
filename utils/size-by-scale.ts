import { Dimensions } from "react-native";

export const widthByScale = (width: number) => (width * Dimensions.get("window").width) / 100;
export const heightByScale = (height: number) => (height * Dimensions.get("window").height) / 100;
