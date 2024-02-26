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
export default function MyListing({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useSelector(selectUserAds);
  const userdata = useSelector(selectUserMeta);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    myAdsFunction();
  };
  useFocusEffect(
    React.useCallback(() => {
      myAdsFunction();
    }, [])
  );
  const myAdsFunction = async () => {
    setRefreshing(true);
    const userAd = await getOwneAd(userdata?._id);
    dispatch(setUserAds(userAd));
    setRefreshing(false);
  };
  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => (
        <Header navigation={navigation} title={t("myad.title")} />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={{ width: width(100), alignItems: "center" }}>
          {data?.length === 0 ? (
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: height(1.5),
                  paddingTop: height(40),
                }}
              >
                {t("commmon.nothingtoshow")}
              </Text>
            </View>
          ) : (
            data?.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate(ScreenNames.DETAIL, item);
                }}
                key={index}
                style={{ width: width(100), alignItems: "center" }}
              >
                <MyListingView data={item} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
