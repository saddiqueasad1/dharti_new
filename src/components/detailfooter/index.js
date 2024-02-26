import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { height, width } from "../../utills/Dimension";
import IconButton from "../Iconbutton";
import styles from "./styles";
import AppColors from "../../utills/AppColors";
export default function DetailFooter({
  onPressCall,
  onPressMail,
  onPressChat,
  pNumber,
  eMail,
}) {
  return (
    <View style={styles.container}>
      <IconButton
        disabled={pNumber ? false : true}
        onPress={onPressCall}
        icon={<Ionicons size={height(2)} name="call" color={AppColors.white} />}
        title={"Call"}
      />
      <IconButton
        onPress={onPressMail}
        disabled={eMail ? false : true}
        icon={
          <AntDesign size={height(2)} name="mail" color={AppColors.white} />
        }
        title={"Email"}
      />
      <IconButton
        onPress={onPressChat}
        icon={
          <MaterialCommunityIcons
            size={height(2)}
            name="chat-processing"
            color={AppColors.white}
          />
        }
        title={"Chat"}
      />
    </View>
  );
}
