import React from "react";
import { Image, Linking, Text, View } from "react-native";
import Icons from "../../../asset/images";
import { Button, Head, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import styles from "./styles";
import { useTranslation } from "react-i18next";

export default function Repair({ navigation, route }) {
  const { t } = useTranslation();
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"RN.rn"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={styles.imageview}>
          <Image source={Icons.repairnow} style={styles.image} />
        </View>
        <View style={styles.container}>
          <Text style={styles.description}>{t("RN.data")}</Text>
        </View>
        <Button
          containerStyle={styles.button}
          title={"RN.rn"}
          onPress={() => Linking.openURL("https://eidcarosse.ch/repair-now")}
        />
      </View>
    </ScreenWrapper>
  );
}
