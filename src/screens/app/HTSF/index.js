import React from "react";
import { Image, Text, View } from "react-native";
import Icons from "../../../asset/images";
import { Head, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import styles from "./styles";
import { useTranslation } from "react-i18next";

export default function HTSF({ navigation, route }) {
  const { t } = useTranslation();
  const data = [
    {
      image: Icons.htsf1,
      id: 1,
      title: "HTSF.title1",
      detail: "HTSF.detail1",
    },
    {
      image: Icons.htsf2,
      id: 2,
      title: "HTSF.title2",
      detail: "HTSF.detail2",
    },
    {
      image: Icons.htsf3,
      id: 3,
      title: "HTSF.title3",
      detail: "HTSF.detail3",
    },
  ];
  const FastSell = ({ data }) => {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={data?.image} />
        <Text style={styles.title}>{t(data?.title)}</Text>
        <Text style={styles.description}>{t(data?.detail)}</Text>
      </View>
    );
  };
  return (
    <ScreenWrapper
    showStatusBar={false}
      headerUnScrollable={() => (
        <Head headtitle={"HTSF.htsf"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        {data.map((item, index) => (
          <FastSell key={index} data={item} />
        ))}
      </View>
    </ScreenWrapper>
  );
}
