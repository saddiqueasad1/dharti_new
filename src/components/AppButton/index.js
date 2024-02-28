import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import AppColors from "../../utills/AppColors";
import styles from "./styles";


const AppButton = ({ title, style, textStyle, onPress, disabled, loading }) => {
  const rtlText =  {
    writingDirection: "rtl",
  };
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      onPress={onPress}
      style={[
        disabled || loading ? styles.buttonDisabled : styles.button,
        style,
      ]}
    >
      {!loading && (
        <Text style={[styles.text, textStyle, rtlText]} numberOfLines={1}>
          {title}
        </Text>
      )}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={AppColors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};
export default AppButton;
