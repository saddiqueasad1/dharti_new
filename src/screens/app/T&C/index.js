import React from "react";
import { Image, Text, View } from "react-native";
import Icons from "../../../asset/images";
import { Head, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import styles from "./styles";
import { useTranslation } from "react-i18next";

export default function TnC({ navigation, route }) {
  const { t } = useTranslation();
  const data = [
    {
      paraTitle: "",
      paraData: "terms.paraData1",
    },
    {
      paraTitle: "terms.paraTitle2",
      paraData: "terms.paraData2",
    },
    {
      paraTitle: "terms.paraTitle3",
      paraData: "terms.paraData3",
    },
    {
      paraTitle: "terms.paraTitle4",
      paraData: "terms.paraData4",
    },
    {
      paraTitle: "terms.paraTitle5",
      paraData: "terms.paraData5",
    },
    {
      paraTitle: "terms.paraTitle6",
      paraData: "terms.paraData6",
    },
    {
      paraTitle: "terms.paraTitle7",
      paraData: "terms.paraData7",
    },
    {
      paraTitle: "terms.paraTitle8",
      paraData: "terms.paraData8",
    },
    {
      paraTitle: "terms.paraTitle9",
      paraData: "terms.paraData9",
    },
    {
      paraTitle: "terms.paraTitle10",
      paraData: "terms.paraData10",
    },
    {
      paraTitle: "terms.paraTitle11",
      paraData: "terms.paraData11",
    },
    // {
    //   paraTitle: "terms.paraTitle12",
    //   paraData: "terms.paraData12",
    // },
    // {
    //   paraTitle: "terms.paraTitle13",
    //   paraData: "terms.paraData13",
    // },
    {
      paraTitle: "terms.paraTitle14",
      paraData: "terms.paraData14",
    },
    {
      paraTitle: "terms.paraTitle15",
      paraData: "terms.paraData15",
    },
    {
      paraTitle: "terms.paraTitle16",
      paraData: "terms.paraData16",
    },
    {
      paraTitle: "terms.paraTitle17",
      paraData: "terms.paraData17",
    },
  ];
  const AboutPara = ({ data }) => {
    return (
      <View style={styles.container}>
        {data?.paraTitle && (
          <Text style={styles.title}>{t(data?.paraTitle)}</Text>
        )}
        <Text style={styles.description}>{t(data?.paraData)}</Text>
      </View>
    );
  };
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"terms.tandc"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={styles.imageview}>
          <Image source={Icons.tnc} style={styles.image} />
        </View>
        {data.map((item, index) => (
          <AboutPara key={index} data={item} />
        ))}
      </View>
    </ScreenWrapper>
  );
}
