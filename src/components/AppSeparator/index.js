import React from "react";
import { View, StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";


const AppSeparator = ({ style }) => {
  return <View style={[styles.container, style]} />;
};

const styles = StyleSheet.create({
  container: {
    height: 1,
    width: "95%",
    backgroundColor: AppColors.border_light,
  },
});

export default AppSeparator;
