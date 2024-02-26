import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import styles from "./styles";

import { useTranslation } from "react-i18next";
import Icons from "../../../asset/images";
import { getOwneAd } from "../../../backend/auth";
import { CardView, Head, IconButton, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import GlobalMethods from "../../../utills/Methods";
import { useSelector } from "react-redux";
import { selectUserMeta } from "../../../redux/slices/user";
export default function OtherProfile({ navigation, route }) {
  const userdata = route?.params?.user;
  const loginuser = useSelector(selectUserMeta);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const onRefresh = () => {
    myAdsFunction();
  };
  useEffect(() => {
    myAdsFunction();
  }, []);
  const myAdsFunction = async () => {
    setRefreshing(true);
    const userAd = await getOwneAd(userdata?._id, false);
    if (userAd) setData(userAd);
    setRefreshing(false);
  };
  return (
    <ScreenWrapper
      refreshing={refreshing}
      onRefresh={myAdsFunction}
      headerUnScrollable={() => (
        <>
          {/* <Head navigation={navigation} /> */}
          <View style={{ width: width(100), backgroundColor: AppColors.white }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                paddingHorizontal: width(5),
              }}
            >
              <Ionicons
                name="chevron-back"
                size={height(4)}
                color={AppColors.black}
              />
            </Pressable>
            <View style={styles.imageiner}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={styles.avatar}
                  source={{ uri: userdata?.image }}
                />
                <View style={{ paddingLeft: width(5) }}>
                  <Text
                    style={{
                      fontSize: height(2),
                      fontWeight: "bold",
                      color: "rgba(0,0,0,.8)",
                    }}
                  >
                    {userdata?.firstName} {userdata?.lastName}
                  </Text>

                  <Text
                    style={{
                      fontSize: height(1.5),
                      fontWeight: "bold",
                      color: AppColors.primary,
                    }}
                  >
                    {userdata?.userName}
                  </Text>

                  {data && (
                    <Text
                      style={{
                        fontSize: height(1.8),
                        marginTop: height(1),
                        textDecorationLine: "underline",
                        color: "grey",
                      }}
                    >
                      {data?.length + " Published ads"}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.wishlistview}>
                {userdata?.showNumber && (
                  <IconButton
                    onPress={() =>
                      GlobalMethods.onPressCall(userdata?.phoneNumber)
                    }
                    title={"Phone"}
                    containerStyle={styles.wcontainer}
                    textStyle={[styles.wtexticon, { color: "#3257a8" }]}
                    icon={
                      <FontAwesome
                        name="phone"
                        size={height(2)}
                        color={"#3257a8"}
                      />
                    }
                  />
                )}
                {userdata?.showEmail && (
                  <IconButton
                    onPress={() =>
                      GlobalMethods.onPressEmail(
                        userdata?.email,
                        loginuser?.email
                      )
                    }
                    title={"Email"}
                    containerStyle={styles.wcontainer}
                    textStyle={[styles.wtexticon, { color: "#364045" }]}
                    icon={
                      <AntDesign
                        name="mail"
                        size={height(2)}
                        color={"#364045"}
                      />
                    }
                  />
                )}
                {userdata?.whatsappChannel && (
                  <IconButton
                    onPress={() =>
                      GlobalMethods.openWhatsAppChannel(
                        userdata?.whatsappChannel
                      )
                    }
                    title={"Channel"}
                    containerStyle={styles.wcontainer}
                    textStyle={[styles.wtexticon, { color: "#32a852" }]}
                    icon={
                      <FontAwesome
                        name="whatsapp"
                        size={height(2)}
                        color={"#32a852"}
                      />
                    }
                  />
                )}
              </View>
            </View>
          </View>
        </>
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View
          style={{ width: width(100), flex: 3, paddingVertical: height(1) }}
        >
          {!userdata?.showAds &&
            data?.map((item, index) => (
              <View
                key={index}
                style={{ width: width(100), alignItems: "center" }}
              >
                <CardView data={item} />
              </View>
            ))}
          {userdata?.showAds && (
            <Text
              style={{
                alignSelf: "center",
                marginVertical: height(20),
                fontWeight: "bold",
              }}
            >
              {t("otherProfile.op")}
            </Text>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
