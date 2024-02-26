import {
  Entypo,
  Fontisto,
  Ionicons,
  MaterialIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import React from "react";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";

import { useDispatch, useSelector } from "react-redux";
import Icons from "../../../asset/images";
import { Header, IconButton, ScreenWrapper } from "../../../components";
import {
  selectFavAds,
  selectUserAds,
  selectUserMeta,
} from "../../../redux/slices/user";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import { useTranslation } from "react-i18next";
export default function Profile({ navigation, route }) {
  const { t } = useTranslation();
  const userdata = useSelector(selectUserMeta);
  const userAds = useSelector(selectUserAds);
  const userFav = useSelector(selectFavAds);
  return (
    <ScreenWrapper
      barStyle="light-content"
      statusBarColor={AppColors.primary}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View
          style={{
            backgroundColor: AppColors.primary,
            width: width(100),
            height: height(10),
            borderBottomLeftRadius: height(3),
            borderBottomRightRadius: height(3),
          }}
        />
        <View style={styles.imageiner}>
          <Image style={styles.avatar} source={{ uri: userdata?.image }} />
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginTop: height(3),
            }}
          >
            <Text
              style={{
                fontSize: height(2.5),
                fontWeight: "600",
                color: AppColors.black,
                marginTop: height(4),
              }}
            >
              {userdata?.firstName} {userdata?.lastName}
            </Text>

            {/* <Text style={styles.ptext}>{userdata?.userName}</Text> */}
            <Text style={[styles.ptext, { color: AppColors.primary }]}>
              {userdata?.email}
            </Text>
            <Text style={styles.ptext}>{userdata?.phoneNumber}</Text>
          </View>

          <View style={styles.wishlistview}>
            <Pressable
              onPress={() => {
                navigation.navigate(ScreenNames.WISH);
              }}
              style={styles.wcontainer}
            >
              <AntDesign
                name="star"
                color={AppColors.primary}
                size={height(2.5)}
              />
              <View style={{ marginHorizontal: height(2) }}>
                <Text style={styles.wtexticon}>{userFav?.length || 0}</Text>
                <Text style={styles.wtext}> {t("profile.wish")}</Text>
              </View>
            </Pressable>
            <View style={styles.verticalLine} />
            <Pressable
              onPress={() => {
                navigation.navigate(ScreenNames.MYADS);
              }}
              style={styles.wcontainer}
            >
              <FontAwesome
                name="bullhorn"
                color={AppColors.primary}
                size={height(2.5)}
              />
              <View style={{ marginHorizontal: height(2) }}>
                <Text style={styles.wtexticon}>
                  {" "}
                  {userAds?.length >= 0
                    ? userAds?.length
                    : userdata?.adIds?.length}
                </Text>
                <Text style={styles.wtext}> {t("profile.listing")}</Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={{ padding: height(2) }}>
          <IconButton
            onPress={() => {
              navigation.navigate(ScreenNames.EDITPROFILE);
            }}
            title={"profile.personalInformation"}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            icon={
              <Entypo name="user" color={AppColors.primary} size={height(2)} />
            }
            iconright={<Ionicons name="chevron-forward" size={height(2)} />}
          />
          <IconButton
            onPress={() => {
              navigation.navigate(ScreenNames.PASSWORD);
            }}
            title={"profile.password"}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            icon={
              <Entypo name="key" color={AppColors.primary} size={height(2)} />
            }
            iconright={<Ionicons name="chevron-forward" size={height(2)} />}
          />
          <IconButton
            title={"profile.privacy"}
            onPress={() => {
              navigation.navigate(ScreenNames.PANDS);
            }}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            icon={
              <Entypo
                name="shield"
                color={AppColors.primary}
                size={height(2)}
              />
            }
            iconright={<Ionicons name="chevron-forward" size={height(2)} />}
          />
          <IconButton
            onPress={() => {
              navigation.navigate(ScreenNames.SETTING);
            }}
            title={"profile.appSetting"}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            icon={
              <Fontisto
                name="player-settings"
                color={AppColors.primary}
                size={height(2)}
              />
            }
            iconright={<Ionicons name="chevron-forward" size={height(2)} />}
          />
          <IconButton
            onPress={() => {
              navigation.navigate(ScreenNames.ACCOUNT);
            }}
            title={"profile.manageAccount"}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            icon={
              <MaterialIcons
                name="account-tree"
                color={AppColors.primary}
                size={height(2)}
              />
            }
            iconright={<Ionicons name="chevron-forward" size={height(2)} />}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
