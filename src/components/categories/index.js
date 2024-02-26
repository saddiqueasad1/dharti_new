import React, { Children, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { width } from "../../utills/Dimension";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import AppColors from "../../utills/AppColors";

export default function CategoryIcon({
  children,
  title,
  image,
  cardStyle,
  imageStyle,
  textStyle,
  onPress,
}) {
  const { t } = useTranslation();
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const buttonColor = isPressed ? AppColors.primary : AppColors.white;
  const textcolor = isPressed ? AppColors.white : AppColors.black;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.main, { backgroundColor: buttonColor }, cardStyle]}
      onPress={onPress}
    >
      <View>
        <Image
          tintColor={textcolor}
          style={[styles.image, imageStyle]}
          source={{ uri: image }}
        />
      </View>
      <Text style={[styles.text, textStyle, { color: textcolor }]}>
        {t(`category.${title}`)}
      </Text>
      {children}
    </TouchableOpacity>
  );
}
