import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { height, width } from "../../utills/Dimension";
import styles from "./styles";
import AppColors from "../../utills/AppColors";
import { useTranslation } from "react-i18next";
export default function Header({ navigation, headtitle, children }) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.menuicon}>
        <Ionicons name="chevron-back" size={height(4)} color={AppColors.black} />
      </Pressable>
      <View style={styles.headview}>
        {children ? (
          children
        ) : (
          <Text style={styles.headtext}>{t(headtitle)}</Text>
        )}
      </View>
      <View />
    </View>
  );
}
