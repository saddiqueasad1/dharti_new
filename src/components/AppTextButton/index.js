import React from "react";
import {  TouchableOpacity, Text } from "react-native";

// Custom Components
import AppColors from "../../utills/AppColors";
import styles from "./styles";


const AppTextButton = ({ title, style, textStyle, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          { color: disabled ? AppColors.button.disabled : AppColors.button.active },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};



export default AppTextButton;
