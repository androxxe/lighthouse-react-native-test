import { Dimensions, Platform, StatusBar } from "react-native";

export const getFontSizeByScale = (fontSize: number, standardScreenHeight: number = 780) => {
  const { height, width } = Dimensions.get("window");

  const standardLength = width > height ? width : height;
  const offset = width > height ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight || 0;

  const deviceHeight = Platform.OS === "android" ? standardLength - offset : standardLength;

  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;

  return Math.round(heightPercent);
};
