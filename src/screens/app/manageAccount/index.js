import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View, Alert } from "react-native";
import styles from "./styles";
import Dialog from "react-native-dialog";
import { useDispatch, useSelector } from "react-redux";
import { Head, IconButton, ScreenWrapper } from "../../../components";
import {
  selectToken,
  selectUserMeta,
  setAdsFav,
  setChatRooms,
  setIsLoggedIn,
  setUserAds,
  setUserMeta,
} from "../../../redux/slices/user";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import {
  errorMessage,
  setAuthData,
  successMessage,
} from "../../../utills/Methods";
import { deleteAccountAPI } from "../../../backend/auth";
import { useTranslation } from "react-i18next";
import { setAppLoader } from "../../../redux/slices/config";
import { ApiManager } from "../../../backend/ApiManager";
export default function ManageAccount({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth_token = useSelector(selectToken);


  const user = useSelector(selectUserMeta);
  const deleteAccount = async (password) => {
    dispatch(setAppLoader(true));
    try {
      const formData = new FormData();
      formData.append("password", password);
      const data = await deleteAccountAPI(user._id, formData);
      if (data?.success) {
        successMessage(
          t("flashmsg.sussessdeleteAccount"),
          t("flashmsg.success")
        );
        dispatch(setIsLoggedIn(false));
        dispatch(setUserMeta(null));
        dispatch(setUserAds(null));
        dispatch(setAdsFav([]));
        dispatch(setChatRooms([]));
        setAuthData(null), navigation.goBack();
      } else {
        errorMessage(t("flashmsg.passwordmsg"), t("flashmsg.error"));
      }
      dispatch(setAppLoader(false));
    } catch (error) {
      console.log("Error:", error);
      dispatch(setAppLoader(false));
    }
  };

  const handleDeleteAccountPrompt = () => {
    Alert.alert(
      "",
      t("accountScreenTexts.deleteAccountPrompt" ),

      [
        {
          text: t("accountScreenTexts.cancelBtnTitle" ),
        },
        {
          text: t("accountScreenTexts.okBtnTitle" ),
          onPress: () => handleDeleteAccountFinalNotice(),
        },
      ]
    );
  };

  const handleDeleteAccountFinalNotice = () => {
    Alert.alert(
      t("accountScreenTexts.deleteAccountMessageTitle" ),
      t("accountScreenTexts.deleteAccountMessage" ),

      [
        {
          text: t("accountScreenTexts.cancelBtnTitle" ),
        },
        {
          text: t("accountScreenTexts.confirmBtnTitle" ),
          onPress: () => handleAccountDeletion(),
        },
      ]
    );
  };

  const handleAccountDeletion = () => {
    dispatch(setAppLoader(true));
    ApiManager.setAuthToken(auth_token);
    ApiManager
      .post("account-delete")
      .then((res) => {
        console.log("res---");
        console.log(res);
        if (res?.user_id) {
          successMessage(
            t("flashmsg.sussessdeleteAccount"),
            t("flashmsg.success")
          );
          dispatch(setIsLoggedIn(false));
          dispatch(setUserMeta(null));
          dispatch(setUserAds(null));
          dispatch(setAdsFav([]));
          dispatch(setChatRooms([]));
          setAuthData(null), navigation.goBack();
        } else {
          errorMessage(t("flashmsg.passwordmsg"), t("flashmsg.error"));
        }
      })
      .catch((err) => alert(err.message))
      .finally( dispatch(setAppLoader(false)));
  };


  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => (
        <Head headtitle={"manageAccount.title"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={{ paddingVertical: height(2) }}>
          <IconButton
            onPress={() => {
              dispatch(setIsLoggedIn(false));
              dispatch(setUserMeta(null));
              dispatch(setUserAds(null));
              dispatch(setAdsFav([]));
              dispatch(setChatRooms([]));
              setAuthData(null), navigation.goBack();
            }}
            title={"manageAccount.logout"}
            containerStyle={styles.logoutcontainer}
            textStyle={{ color: AppColors.primary }}
            icon={
              <Entypo
                name="log-out"
                size={height(2.5)}
                color={AppColors.primary}
              />
            }
          />
          <IconButton
            onPress={() => {
              handleDeleteAccountPrompt()
            }}
            title={"manageAccount.deleteaccount"}
            containerStyle={styles.deletecontainer}
            icon={
              <AntDesign
                name="delete"
                size={height(2.5)}
                color={AppColors.white}
              />
            }
          />
        </View>
        
      </View>
    </ScreenWrapper>
  );
}
