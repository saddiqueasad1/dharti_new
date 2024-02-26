import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import AppColors from "../../utills/AppColors";

import { FontAwesome } from "@expo/vector-icons";
import { height, width } from "../../utills/Dimension";
import { useTranslation } from "react-i18next";

export default DropDownDetail = ({
  title,
  detail,
  size = 2,
  textAlign,
  color = AppColors.black,
  textStyles,
  textProps,
  inertextStyles,
  inertextProps,
  onPress = undefined,
}) => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    text: {
      fontSize: height(size),
      textAlign: textAlign,
      fontWeight: "bold",
      color: show ? AppColors.primary : "black",
      width: width(80),
    },
  });
  return (
    <View
      style={{
        backgroundColor: AppColors.white,
        width: width(90),
        paddingVertical: width(2),
        paddingHorizontal: width(3),
        borderRadius: width(1),
        ...Platform.select({
          ios: {
            shadowColor: "rgba(0, 0, 0, 0.2)",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.4,
            shadowRadius: 1,
          },
          android: {
            elevation: 1,
          },
        }),
        marginVertical: height(.5),
      }}
    >
      <Pressable
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => setShow(!show)}
      >
        <Text
          style={[styles.text, textStyles]}
          {...textProps}
          numberOfLines={show ? 2 : 1}
        >
          {t(title)}
        </Text>
        <FontAwesome
          name={show ? "chevron-up" : "chevron-down"}
          size={height(2)}
          color={show ? AppColors.primary : "black"}
        />
      </Pressable>
      {show && (
        <Text
          style={{ fontSize: height(1.8), paddingVertical: width(3), color: AppColors.black, }}
          {...inertextProps}
        >
          {t(detail)}
        </Text>
      )}
    </View>
  );
};
