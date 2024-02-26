import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import AppColors from "../../utills/AppColors";
import styles from "./styles";
import { useTranslation } from "react-i18next";

const Button = ({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  loaderColor = AppColors.white,
  activeOpacity = 0.7,
  containerStyle = {},
  textStyle = {},
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={activeOpacity}
      style={[styles.container, containerStyle]}
    >
      {isLoading ? (
        <ActivityIndicator color={loaderColor} size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{t(title)}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
