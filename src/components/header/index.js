import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { height } from "../../utills/Dimension";
import styles from "./styles";
import AppColors from "../../utills/AppColors";
import { useNavigation } from '@react-navigation/native';

export default function Header({ title }) {
  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Image
          source={require("../../../assets/icon1.png")}
          style={styles.image}
          resizeMode="cover"
        />
        {!title && <Text style={styles.title}>{"Dharti"}</Text>}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <TouchableOpacity
        activeOpacity={0.4}
        style={styles.menuicon}
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <Ionicons name="menu" size={height(3.5)} color={AppColors.black} />
      </TouchableOpacity>
      <View />
    </View>
  );
}
