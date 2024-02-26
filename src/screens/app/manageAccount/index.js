import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View } from "react-native";
import styles from "./styles";
import Dialog from "react-native-dialog";
import { useDispatch, useSelector } from "react-redux";
import { Head, IconButton, ScreenWrapper } from "../../../components";
import {
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
export default function ManageAccount({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState("");

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
              setVisible(true);
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
        <View>
          <Dialog.Container visible={visible}>
            <Dialog.Title>
              <Text style={{ fontSize: height(2), color: "red" }}>
                {t("manageAccount.deleteaccount")}
              </Text>
            </Dialog.Title>
            <Dialog.Description>
              <Text style={{ fontSize: height(1.5) }}>
                {t("manageAccount.deleteconfirmmsg")}
              </Text>
            </Dialog.Description>
            <Dialog.Description>
              <Text style={{ fontSize: height(1.5), fontWeight: "bold" }}>
                {t("manageAccount.enterpassword")}
              </Text>
            </Dialog.Description>
            <Dialog.Input
              secureTextEntry={true}
              style={{ fontSize: height(1.5), color: "black" }}
              value={code}
              onChangeText={setCode}
            />
            <Dialog.Button
              label={t("myad.cancel")}
              onPress={() => setVisible(false)}
            />
            <Dialog.Button
              color={"red"}
              label={t("myad.delete")}
              onPress={() => {
                setVisible(false);
                if (code) deleteAccount(code);
                else
                  errorMessage(t("flashmsg.requiremsg"), t("flashmsg.error"));
                setCode("");
              }}
            />
          </Dialog.Container>
        </View>
      </View>
    </ScreenWrapper>
  );
}
