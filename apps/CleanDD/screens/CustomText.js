// CustomText.js
import React from "react";
import { Text } from "react-native";

export default function CustomText({ style, ...props }) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: "Gidugu_400Regular" }, style]}
    />
  );
}
