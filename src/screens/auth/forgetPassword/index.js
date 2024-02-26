import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import Icons from "../../../asset/images";
import Modal from "react-native-modal";
import { Button, Head, Input, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { verifyCodeAPI, forgetPasswordAPI } from "../../../backend/auth";
import { errorMessage, successMessage } from "../../../utills/Methods";
import ScreenNames from "../../../routes/routes";
//import i18n from "../../../translation";
export default function ForgetPassword({ navigation, route }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [modal, setModel] = useState(false);
  const [token, setToken] = useState("");

  async function forgetpassword() {
    const d = await forgetPasswordAPI(email.trim());
    if (d?.success) {
      setToken(d?.data);
      successMessage(t(`flashmsg.emailsussesssendmsg`), t(`flashmsg.success`));
      setTimeout(() => setModel(true), 600);
    } else errorMessage(d?.message, t(`flashmsg.authentication`));
  }
  async function checkPassword(code) {
    const d = await verifyCodeAPI(code);
    if (d?.success) {
      setModel(false);
      setToken("");
      navigation.navigate(ScreenNames.CPF, { token, email });
    } else {
      setCode("");
      errorMessage(t(`flashmsg.wrongpinerrormsg`), t(`flashmsg.error`));
    }
  }
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head navigation={navigation} headtitle={t("frogeyPassword.title")} />
      )}
      footerUnScrollable={() => (
        <Button
          disabled={token ? true : false}
          containerStyle={styles.button}
          title={"frogeyPassword.button"}
          onPress={() => {
            if (email) {
              forgetpassword();
            } else {
              errorMessage(
                t(`flashmsg.emailrequireerrormsg`),
                t(`flashmsg.error`)
              );
            }
          }}
        />
      )}
    >
      <View style={styles.mainViewContainer}>
        <View>
          <Image
            style={{
              height: height(15),
              width: height(15),
              borderRadius: height(2),
              alignSelf: "center",
              marginVertical: height(5),
            }}
            source={Icons.mainLogo}
            tintColor={AppColors.primary}
          />
          <Input
            value={email}
            setvalue={setEmail}
            title={"login.emailTitle"}
            placeholder={"login.yourEmailAddress"}
          />
        </View>
      </View>
      <Modal isVisible={modal} backdropOpacity={0.5}>
        <View
          style={{
            backgroundColor: AppColors.white,
            height: height(40),
            width: width(90),
            borderRadius: width(5),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CountdownCircleTimer
            isPlaying
            duration={60}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[30, 15, 10, 0]}
            size={100}
          >
            {({ remainingTime }) => {
              if (remainingTime == 0) {
                setModel(false);
                setToken("");
              }
              return (
                <Text style={{ fontSize: height(2.5) }}>{remainingTime}</Text>
              );
            }}
          </CountdownCircleTimer>
          <View style={{ paddingTop: height(4) }}>
            <Input
              value={code}
              setvalue={setCode}
              placeholder={"Enter Code"}
              keyboardType="numeric"
              containerStyle={{
                width: width(60),
                borderWidth: height(0.09),
                borderRadius: height(2),
              }}
            />
            <Button
              containerStyle={{ width: width(60), margin: width(3) }}
              title={"Verify"}
              onPress={() => {
                if (code) {
                  checkPassword(code.trim());
                } else {
                  errorMessage(t(`flashmsg.entercode`), t(`flashmsg.error`));
                }
                //setModel(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
