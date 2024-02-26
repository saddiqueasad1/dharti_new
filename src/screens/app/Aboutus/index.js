import React from "react";
import { Text, View } from "react-native";
import { Head, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";
import { useTranslation } from "react-i18next";
export default function AboutUs({ navigation, route }) {
  const { t } = useTranslation();
  const data = [
    {
      paraTitle: "",
      paraDetail: "aboutUs.paraDetail1",
      paraType: "para",
    },
    {
      paraTitle: "aboutUs.paraTitle2",
      paraDetail: ["aboutUs.paraDetail2by1", "aboutUs.paraDetail2by2"],
      paraType: "bullets",
    },
    {
      paraTitle: "aboutUs.paraTitle3",
      paraDetail: [
        "aboutUs.paraDetail3by3",
        "aboutUs.paraDetail3by2",
        "aboutUs.paraDetail3by3",
      ],
      paraType: "bullets",
    },

    {
      paraTitle: "",
      paraDetail: "aboutUs.paraDetail4",
      paraType: "para",
    },
  ];
  const AboutPara = ({ data }) => {
    return (
      <View style={styles.container}>
        {data?.paraTitle && (
          <Text style={styles.title}>{t(data?.paraTitle)}</Text>
        )}
        {data?.paraType == "para" && (
          <Text style={styles.description}>{t(data?.paraDetail)}</Text>
        )}
        {data?.paraType == "bullets" &&
          data.paraDetail.map((item) => (
            <View
              style={{
                justifyContent: "flex-start",
                flexDirection: "row",
                alignSelf: "flex-starts",
              }}
            >
              <View style={styles.dot} />
              <Text style={{ margin: width(1), width: width(80),fontSize:height(1.8) }}>
                {t(item)}
              </Text>
            </View>
          ))}
      </View>
    );
  };
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"aboutUs.aboutus"} navigation={navigation} />
      )}
  
      scrollEnabled
      showStatusBar={false}
    >
      <View style={styles.mainViewContainer}>
        {/* <View style={styles.imageview}>
        <Image source={Icons.tnc} style={styles.image} />
        </View> */}
        {data.map((item, index) => (
          <AboutPara key={index} data={item} />
        ))}
      </View>
    </ScreenWrapper>
  );
}
