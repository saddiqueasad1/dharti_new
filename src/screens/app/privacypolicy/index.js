import React from "react";
import { Image, Text, View } from "react-native";
import Icons from "../../../asset/images";
import { Head, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import styles from "./styles";
import { useTranslation } from "react-i18next";

export default function PP({ navigation, route }) {
  const { t } = useTranslation();
  const data = [
    {
      paraTitle: "",
      paraDetail: "privacy.paraDetail1",
    },
    {
      paraTitle: "privacy.paraTitle2",
      paraDetail: "privacy.paraDetail2",
    },
    {
      paraTitle: "privacy.paraTitle3",
      paraDetail: "privacy.paraDetail3",
    },
    {
      paraTitle: "privacy.paraTitle4",
      paraDetail: "privacy.paraDetail4",
    },
    {
      paraTitle: "privacy.paraTitle5",
      paraDetail: "privacy.paraDetail5",
    },
    {
      paraTitle: "privacy.paraTitle6",
      paraDetail: "privacy.paraDetail6",
    },
    {
      paraTitle: "privacy.paraTitle7",
      paraDetail: "privacy.paraDetail7",
    },
    {
      paraTitle: "privacy.paraTitle8",
      paraDetail: "privacy.paraDetail8",
    },
    {
      paraTitle: "privacy.paraTitle9",
      paraDetail: "privacy.paraDetail9",
    },
    {
      paraTitle: "privacy.paraTitle10",
      paraDetail: "privacy.paraDetail10",
    },
  ];
  const PPPara = ({ data }) => {
    return (
      <View style={styles.container}>
        {data?.paraTitle && (
          <Text style={styles.title}>{t(data?.paraTitle)}</Text>
        )}
        <Text style={styles.description}>{t(data?.paraDetail)}</Text>
      </View>
    );
  };
  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => (
        <Head headtitle={"privacy.privacy"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={styles.imageview}>
          <Image source={Icons.pp} style={styles.image} />
        </View>
        {data.map((item, index) => (
          <PPPara key={index} data={item} />
        ))}
      </View>
    </ScreenWrapper>
  );
}
