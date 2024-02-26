import React from "react";
import { Text, TouchableOpacity } from "react-native";

import styles from "./styles";
import { useTranslation } from "react-i18next";
import AppColors from "../../utills/AppColors";

const IconButton = ({
  title,
  onPress,
  disabled = false,
  icon,
  iconright,
  activeOpacity = 0.7,
  containerStyle = {},
  textStyle = {},
  onPressRightIcon,
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[
        styles.container,
        containerStyle,
        disabled && { backgroundColor: "grey" },
      ]}
    >
      {icon}
      <Text style={[styles.text, textStyle]}>{t(title)}</Text>
      <TouchableOpacity onPress={onPressRightIcon}>
        {iconright}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default IconButton;
