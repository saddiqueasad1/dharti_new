import React from "react";
import { View } from "react-native";
import { Head, ScreenWrapper } from "../../../components";
import Dropdowndetail from "../../../components/Dropdowndetail";
import AppColors from "../../../utills/AppColors";
import styles from "./styles";

export default function FAQ({ navigation, route }) {
  const faq = [
    {
      title: "FAQ.q1",
      detail:"FAQ.a1"
    },
    {
      title: "FAQ.q2",
      detail:"FAQ.a2"
    },
    {
      title: "FAQ.q3",
      detail:"FAQ.a3"
    },
    // {
    //   title: "FAQ.q4",
    //   detail:"FAQ.a4"
    // },
    {
      title: "FAQ.q5",
      detail:"FAQ.a5"
    },
    {
      title: "FAQ.q6",
      detail:"FAQ.a6"
    }, 
    // {
    //   title: "FAQ.q7",
    //   detail:"FAQ.a7"
    // },
  ];
  return (
    <ScreenWrapper
    showStatusBar={false}
      headerUnScrollable={() => (
        <Head headtitle={"FAQ.title"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        {faq.map((item) => (
          <Dropdowndetail title={item.title} detail={item.detail} />
        ))}
      </View>
    </ScreenWrapper>
  );
}
