import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getOwneAd } from "../../../backend/auth";
import { MyListingView, ScreenWrapper } from "../../../components";
import Header from "../../../components/header";
import {
  selectUserAds,
  selectUserMeta,
  setUserAds,
} from "../../../redux/slices/user";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";
export default function MyStoreScreen({ navigation, route }) {
  
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"manageAccount.title"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={{ width: width(100), alignItems: "center" }}>
         <Text>helllo....</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}
