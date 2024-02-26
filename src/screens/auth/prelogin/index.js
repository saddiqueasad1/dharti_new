import React from "react";
import { Image, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import Icons from "../../../asset/images";
import { Button, Header, ScreenWrapper } from "../../../components";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";
import { useTranslation } from "react-i18next";
export default function PreLogin({ navigation, route }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => <Header navigation={navigation} />}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <Image source={Icons.accountbg} style={styles.image} />
        <Text style={styles.text}>{t("prelogin.mustLogin")}</Text>
        <Button
          title={"prelogin.loginSignupButton"}
          containerStyle={styles.containerStyle}
          onPress={() => {
            navigation.navigate(ScreenNames.LOGIN);
          }}
        />
      </View>
    </ScreenWrapper>
  );
}
