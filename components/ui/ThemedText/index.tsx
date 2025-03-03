import { Text, type TextProps } from "react-native";

import {
  FontFamilyType,
  FontWeightType,
  TextAlignType,
  TextFontSizeType,
  TextTransformType,
  TextVariantType,
} from "./index.type";
import { getFontSizeByScale } from "@/utils";
import twrnc from "twrnc";

export interface ThemedTextProps extends TextProps {
  color?: string;
  variant: TextVariantType;
  fontWeight?: FontWeightType;
  textAlign?: TextAlignType;
  textTransform?: TextTransformType;
}

export const fontFamilyMapper: Record<FontWeightType, FontFamilyType> = {
  bold: "SpaceMonoBold",
  regular: "SpaceMonoRegular",
};

export const fontSizeMapper: Record<TextVariantType, TextFontSizeType> = {
  "ultra-large": 24,
  "extra-larger": 20,
  "extra-large": 18,
  large: 16,
  medium: 14,
  small: 12,
  "extra-small": 10,
};

export function ThemedText(props: ThemedTextProps) {
  const {
    variant = "medium",
    fontWeight = "regular",
    textAlign,
    className,
    color = "slate-900",
    style,
    ...rest
  } = props;

  return (
    <Text
      {...rest}
      allowFontScaling={false}
      className={className}
      style={[
        {
          fontFamily: fontFamilyMapper[fontWeight],
          fontSize: getFontSizeByScale(fontSizeMapper[variant]),
          textAlign: textAlign || "left",
          textTransform: props.textTransform || "none",
          color: twrnc.color(color),
        },
        ...(style ? [style] : [{}]),
      ]}
    />
  );
}
