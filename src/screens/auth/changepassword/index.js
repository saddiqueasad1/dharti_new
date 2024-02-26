import React, { useState } from "react";
import { View } from "react-native";
import styles from "./styles";

import { useDispatch } from "react-redux";
import { Button, Head, Input, ScreenWrapper } from "../../../components";
import { setAppLoader } from "../../../redux/slices/config";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";

import ScreenNames from "../../../routes/routes";
import { errorMessage, successMessage } from "../../../utills/Methods";
import { resetPasswordAPI } from "../../../backend/auth";
import { useTranslation } from "react-i18next";
export default function ChangePassword({ navigation, route }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const email = route?.params?.email;
  const token = route?.params?.token;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isValidPassword = (password) => {
    return password.length >= 8;
  };
  const chngePassword = async () => {
    try {
      dispatch(setAppLoader(true));
      let r = await resetPasswordAPI({
        password: newPassword.trim(),
        email: email,
        token: token,
      });
      if (!r?.success) {
        dispatch(setAppLoader(false));
        errorMessage(r?.message, t(`flashmsg.error`));
      } else if (r) {
        successMessage(t(`flashmsg.passwordchangemsg`), t(`flashmsg.password`));
        dispatch(setAppLoader(false));
        navigation.navigate(ScreenNames.LOGIN);
      } else {
        // errorMessage(t(`flashmsg.profileupdateerrormsg`),t(`flashmsg.password`));
      }
      // dispatch(setAppLoader(false));
    } catch (error) {
      dispatch(setAppLoader(false));
    }
  };
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"changePassword.title"} navigation={navigation} />
      )}
      footerUnScrollable={() => (
        <Button
          containerStyle={styles.button}
          title={"changePassword.savebutton"}
          onPress={() => {
            if (newPassword.trim() !== confirmPassword.trim()) {
              errorMessage(
                t(`flashmsg.confirmerrormsg`),
                t(`flashmsg.password`)
              );
            } else if (!isValidPassword(newPassword.trim())) {
              errorMessage(t("Atlest 8 character"), t(`flashmsg.password`));
            } else if (
              newPassword.trim() == "" ||
              confirmPassword.trim() == ""
            ) {
              errorMessage(t(`flashmsg.emptyfield`), t(`flashmsg.password`));
            } else chngePassword();
          }}
        />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={{ paddingVertical: width(10) }}>
          <Input
            title={"changePassword.newPassword"}
            placeholder={"changePassword.phnewPassword"}
            value={newPassword}
            secure
            setvalue={setNewPassword}
          />

          <Input
            title={"changePassword.confirmpassword"}
            placeholder={"changePassword.phconfirmpassword"}
            value={confirmPassword}
            secure
            setvalue={setConfirmPassword}
          />

          <View style={{ height: height(7) }} />
        </View>
      </View>
    </ScreenWrapper>
  );
}
