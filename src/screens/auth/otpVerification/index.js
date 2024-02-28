import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ImageBackground
} from "react-native";
import AppButton from "../../../components/AppButton";
import AppColors from "../../../utills/AppColors";
import { Button, Head, Input, ScreenWrapper } from "../../../components";
import styles from "./styles";
import Icons from "../../../asset/images";
import { useTranslation } from "react-i18next";



const OTPVerificationScreen = ({ route, navigation }) => {
  const [countValue, setCount] = useState(null);
  const { t } = useTranslation();
  return (
    <ScreenWrapper
      statusBarColor={AppColors.primary}
      barStyle="light-content"
      scrollEnabled
      headerUnScrollable={() => (
        <Head navigation={navigation} headtitle={"OTP Verification"} />
      )}
      // headerUnScrollable={() => <Head navigation={navigation} />}
    >
      <View style={styles.mainViewContainer}>
      <ImageBackground source={Icons.bglogo} style={styles.bg}>
          <View style={styles.imageiner}>
            <Text style={styles.logintext}>Otp Verification</Text>
          </View>
        </ImageBackground>
        <Text>ok</Text>
        <AppButton
          title={
            countValue ? "Resend Otp" + " (" + countValue + ")" : "Resend Otp"
          }
          style={{
            width: "50%",
            elevation: 10,
            shadowColor: AppColors.black,
            shadowOpacity: 0.4,
            shadowOffset: { height: 2, with: 0 },
            shadowRadius: 20,
            elevation: 15,
          }}
          disabled={countValue > 0}
          // loading={countValue > 0}
          // onPress={handleResendRequest}
        />
      </View>
    </ScreenWrapper>
  );
};

export default OTPVerificationScreen;
