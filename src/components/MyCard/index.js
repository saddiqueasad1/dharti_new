import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Dialog from "react-native-dialog";
import { Menu, MenuItem } from "react-native-material-menu";
import styles from "./styles";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { deleteAdById, refreshApi, togglePublish } from "../../backend/api";
import { getOwneAd } from "../../backend/auth";
import { setAppLoader } from "../../redux/slices/config";
import { selectCurrentLanguage } from "../../redux/slices/language";
import { selectUserMeta, setUserAds } from "../../redux/slices/user";
import ScreenNames from "../../routes/routes";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";
import GlobalMethods, {
  checkPrice,
  errorMessage,
  formatPrice,
  formatPriceE,
  isNullOrNullOrEmpty,
  successMessage,
} from "../../utills/Methods";

export default function MyCard({ data }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserMeta);
  const language = useSelector(selectCurrentLanguage);
  const userid = userInfo?._id;
  const [visible, setVisible] = useState(false);

  const getData = useCallback(async (id) => {
    let d = await getOwneAd(id);
    if (d) dispatch(setUserAds(d));
    else dispatch(setUserAds([]));
  });
  const [publish, setPublish] = useState(data?.visibility);
  const [isModalVisible, setModalVisible] = useState(false);
  const hideMenu = () => setModalVisible(false);

  const showMenu = () => setModalVisible(true);
  useEffect(() => {
    setPublish(data?.visibility);
  });
  const deleteAd = async (id) => {
    dispatch(setAppLoader(true));
    try {
      const data = await deleteAdById(id);
      await getData(userid);
      dispatch(setAppLoader(false));
    } catch (error) {
      console.log("Error:", error);
      dispatch(setAppLoader(false));
    }
  };
  const refreshAd = async () => {
    dispatch(setAppLoader(true));
    try {
      const d = await refreshApi(data?._id);
      if (d?.success) {
        await getData(userid);
        successMessage(t("flashmsg.Ad Refresh"), t("flashmsg.success"));
      } else {
        errorMessage(t("flashmsg.refreshAdMsg"), t("flashmsg.error"));
      }

      dispatch(setAppLoader(false));
    } catch (error) {
      console.log("Error:", error);
      dispatch(setAppLoader(false));
    }
  };
  const publishAd = async () => {
    let r = await togglePublish(data._id);
    dispatch(setAppLoader(true));
    try {
      await getData(userid);
      dispatch(setAppLoader(false));
    } catch (error) {
      console.log("Error:", error);
      dispatch(setAppLoader(false));
    }
  };
  return (
    <View style={styles.main}>
      <View style={styles.imageview}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: data?.images[0] }}
        />
      </View>
      <View style={styles.detail}>
        <View>
          <Text numberOfLines={1} style={styles.titletext}>
            {data?.title}
          </Text>
          <View style={styles.categoryview}>
            <AntDesign name="clockcircleo" color={"grey"} size={height(2)} />
            <Text numberOfLines={1} style={styles.textcategory}>
              {GlobalMethods.calculateTimeDifference(data?.createdAt, language)}
            </Text>
          </View>

          <View style={styles.categoryview}>
            <AntDesign name="eye" color={"grey"} size={height(2)} />
            <Text numberOfLines={2} style={styles.textcategory}>
              {data?.views}
            </Text>
          </View>
        </View>
        {/* <View>
          <Text numberOfLines={1} style={styles.chf}>
            CHF {data?.price}
          </Text>
          <Text numberOfLines={1} style={styles.eur}>
            EUR {data?.price}
          </Text>
        </View> */}
        {!isNullOrNullOrEmpty(data?.price) && (
          <View style={styles.detailinerview}>
            {checkPrice(data?.price) ? (
              <View style={{ width: width(50) }}>
                <Text numberOfLines={1} style={styles.chf}>
                  CHF {formatPrice(data?.price)}
                </Text>
                <Text numberOfLines={1} style={styles.eur}>
                  EUR {formatPriceE(Math.round(data?.price * 1.06))}
                </Text>
              </View>
            ) : (
              <View style={styles.cfpview}>
                <Text numberOfLines={1} style={styles.cfp}>
                  {t(`addPost.${data?.price}`)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.icons}>
        <TouchableOpacity
          style={{
            backgroundColor: AppColors.grey,
            padding: height(0.8),
            borderRadius: height(0.5),
          }}
          onPress={showMenu}
        >
          <Entypo size={height(2)} name="dots-three-vertical" />
        </TouchableOpacity>
      </View>

      {!data?.visibility && (
        <View
          style={{
            height: height(18),
            borderRadius: width(2),
            width: width(85),
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            position: "absolute",
          }}
        />
      )}
      <Menu visible={isModalVisible} onRequestClose={hideMenu}>
        <MenuItem
          onPress={() => {
            hideMenu();
            navigation.navigate(ScreenNames.ADDPOST, { data: data });
          }}
        >
          <AntDesign name="edit" size={height(2)} />
          <Text style={{ fontSize: height(1.5), color: AppColors.black }}>
            {" "}
            {t("myad.edit")}
          </Text>
        </MenuItem>
        {publish && (
          <MenuItem
            onPress={() => {
              hideMenu();
              refreshAd();
            }}
          >
            <FontAwesome name="refresh" size={height(2)} />
            <Text style={{ fontSize: height(1.5), color: AppColors.black }}>
              {" "}
              {t("myad.refresh")}
            </Text>
          </MenuItem>
        )}

        {publish ? (
          <MenuItem
            onPress={() => {
              hideMenu();
              publishAd();
            }}
          >
            <FontAwesome name="pause" size={height(1.8)} />
            <Text style={{ fontSize: height(1.5), color: AppColors.black }}>
              {" "}
              {"  "} {t("myad.muteButton")}
            </Text>
          </MenuItem>
        ) : (
          <MenuItem
            onPress={() => {
              hideMenu();
              publishAd();
            }}
          >
            <AntDesign name="play" size={height(2)} />
            <Text style={{ fontSize: height(1.5), color: AppColors.black }}>
              {"  "}
              {t("myad.republish")}
            </Text>
          </MenuItem>
        )}
        <MenuItem
          onPress={() => {
            hideMenu(),
              setTimeout(() => {
                setVisible(true);
              }, 600);
          }}
        >
          <AntDesign name="delete" size={height(2)} color={"red"} />
          <Text style={{ color: AppColors.primary, fontSize: height(1.5) }}>
            {"   "}
            {t("myad.delete")}
          </Text>
        </MenuItem>
      </Menu>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: publish ? AppColors.grey : AppColors.primary,
          position: "absolute",
          zIndex: 1,
          padding: width(1),
          right: width(2),
          bottom: height(5),
          borderRadius: width(5),
          marginTop: height(5),
          backgroundColor: publish ? AppColors.green : AppColors.primary,
        }}
        disabled={true}
      >
        <Text
          style={{
            fontSize: height(1.2),
            color: AppColors.white,
            paddingHorizontal: height(0.2),
            fontWeight: publish ? "600" : "bold",
          }}
        >
          {publish ? t("myad.published") : t("myad.mute")}
        </Text>
      </TouchableOpacity>
      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>
            <Text style={{ fontSize: height(2), color: AppColors.primary }}>
              {" "}
              {t("myad.deletetitle")}
            </Text>
          </Dialog.Title>
          <Dialog.Description>
            <Text style={{ fontSize: height(1.5) }}>
              {t("myad.deletealertmsg")}
            </Text>
          </Dialog.Description>
          <Dialog.Button
            label={t("myad.cancel")}
            onPress={() => setVisible(false)}
          />
          <Dialog.Button
            color={"red"}
            label={t("myad.delete")}
            onPress={() => {
              deleteAd(data._id);
              setVisible(false);
            }}
          />
        </Dialog.Container>
      </View>
    </View>
  );
}
