import React, { useState, useRef, useContext, useEffect } from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import Icons from "../../../asset/images";
import { Button, Head, Input, ScreenWrapper } from "../../../components";
import PhoneInput from "react-native-phone-number-input";
import { useSelector } from "react-redux";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";
import AppButton from "../../../components/AppButton";
import { selectAppState } from "../../../redux/slices/appConfig/index";
import { ApiManager } from "../../../backend/ApiManager";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { getApp } from "firebase/app";

export default function OtpVerification({ navigation, route }) {
  const { width: screenWidth } = Dimensions.get("window");
  const appConfig = useSelector(selectAppState);
  const { appSettings, config, ios, user, auth_token } = appConfig;
  const [number, setNumber] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");
  const [oTPSent, setOTPSent] = useState(false);
  const [oTP, setOTP] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [counter, setCounter] = useState(false);
  const [countValue, setCount] = useState(null);
  const auth = getAuth();
  const app = getApp();
  const recaptchaVerifier = useRef(null);
  const offsetX = useRef(new Animated.Value(0)).current;
  const phoneInput = useRef(null);
  const [verificationId, setVerificationId] = useState();

  useEffect(() => {
    auth.useDeviceLanguage();
  }, [appSettings, config, ios, user, auth_token]);

  const handleOTPChange = (text) => {
    setOTP(text);
  };

  const firebaseOTPRequest = async () => {
    try {
      console.log("()=> firebaseOTPRequest");
      signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier.current)
        .then((confirmationResult) => {
          console.log("confirmationResult.");
          console.log(confirmationResult.verificationId);
          setVerificationId(confirmationResult.verificationId);
          Animated.timing(offsetX, {
            toValue: -screenWidth,
            duration: 1000,
            useNativeDriver: false,
          }).start();
          setOTPSent(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestOTP = async () => {
    setOtpLoading(true);
    try {
      const requestData = {
        phone: formattedNumber,
        gateway: "firebase",
      };
      const res = await ApiManager.post("verification/send-otp", requestData);
      if (res.status === "success") {
        firebaseOTPRequest();
      } else {
        alert(res?.data?.message || res?.data?.data?.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendRequest = () => {
    setOtpLoading(false);
    Animated.timing(offsetX, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    setOTPSent(false);
    if (countValue > 0) {
      clearInterval(counter);
      setCount(null);
      setCounter(false);
    }
    setOTP("");
  };

  const handleOtpVerificationRequest = () => {
    console.log("()=> ()=> ");
    setVerifying(true);
    firebaseOTPVerification();
  };

  const firebaseOTPVerification = async () => {
    console.log("()=> firebaseOTPVerification");
    try {
      const credential = PhoneAuthProvider.credential(verificationId, oTP);
      await signInWithCredential(auth, credential)
        .then((res) => {
          console.log("res of ()=> firebaseOTPVerification");
          // {"_redirectEventId": undefined, "apiKey": "AIzaSyBfTQ7IigRYXnp0DExoeutidqdN2xfljM0", "appName": "[DEFAULT]", "createdAt": "1709215100260", "displayName": undefined, "email": undefined, "emailVerified": false, "isAnonymous": false, "lastLoginAt": "1709215100261", "phoneNumber": "+923115182891", "photoURL": undefined, "providerData": [[Object]], "stsTokenManager": {"accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiYjg3ZGNhM2JjYjY5ZDcyYjZjYmExYjU5YjMzY2M1MjI5N2NhOGQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZGhhcnRpLWE3MmJkIiwiYXVkIjoiZGhhcnRpLWE3MmJkIiwiYXV0aF90aW1lIjoxNzA5MjE1MTAwLCJ1c2VyX2lkIjoiVHlIWFhpNHFxRVhvbUY2ajYwMGZESUd3UHBqMSIsInN1YiI6IlR5SFhYaTRxcUVYb21GNmo2MDBmRElHd1BwajEiLCJpYXQiOjE3MDkyMTUxMDAsImV4cCI6MTcwOTIxODcwMCwicGhvbmVfbnVtYmVyIjoiKzkyMzExNTE4Mjg5MSIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzkyMzExNTE4Mjg5MSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.ikdmvWhBhf6mqn-elafWPLxysHMleLVGI__I4wtrc1kL9mJ2vWuJysknWA3YQOhEjD6LhCkulJWEJvNHAogqsDAvuP_1mg-7YpxoCQgwRZTPrE0BuAAcV9x2au-C0cKyv3YLU3K_Bl8j5qWbIDkS-8Deuj2cUU4A7TH5HyH9R6_PORVCWHQscX2qpOtAkR3NkVL2iAfU8hbR9JKIvAa1w6Ci6aA125bMrprXJGjN9yjouknkDJrjtOHGFKgUDm4McReGv3fJwaqAlUtIqJyZzVRgoHedn2ZEZNAGJlMpHcbNaa8OanQwpjKPGFlIdl2GOdxoap2WfOqZsLMvk40MSw", "expirationTime": 1709218700412, "refreshToken": "AMf-vBwj_5RwgPkPFYtPI68eIlsWg8DnhstKpRIHgny240VwoGqnptOv81i2ep4DfKCeyUhRKiGZh3tCl_3N9mikCWBY2-HLcUlidY1_Dk6EtT9CmQfBFaIIL0HQIQd2tH1MDG7Hb3-o7JSYjJfzj8BMepkA_rQBT2OIjrtYcSnWtXPgWTOV3jGoD62sei1W8nKWcKbyV99M"}, "tenantId": undefined, "uid": "TyHXXi4qqEXomF6j600fDIGwPpj1"}
          console.log(res.user);
          finishFirebaseOTPVerification(res.user.uid);
        })
        .catch((err) => alert(err.message))
        .finally(() => setVerifying(false));
    } catch (err) {
      alert(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const finishFirebaseOTPVerification = (uid) => {
    console.log("res of ()=> finishFirebaseOTPVerification");
    if (user) setAuthToken(auth_token);
    ApiManager.post("verification/store-firebase-verified-otp", {
      phone: formattedNumber,
      code: oTP,
      uid: uid,
    })
      .then((res) => {
        console.log("res of ()=> finishFirebaseOTPVerification");
        console.log(res);

        // if (res?.ok) {
        setOTP("");
        Alert.alert(
          "Verification Successful",
          "Phone number is successfully verified.",
          [
            {
              text: "Complete Sign Up",
              onPress: () => handleCleanUp(),
            },
          ]
        );
        // }
      })
      .catch((err) => {
        Alert.alert(
          "Verification Failed",
          err?.message
            ? "Error verifying OTP" + ", " + err.message
            : "Error verifying OTP",
          [
            {
              text: "ok",
              onPress: () => handleResendRequest(),
            },
          ]
        );
      })
      .finally(() => {
        if (user) removeAuthToken();
      });
  };

  const handleCleanUp = () => {
    clearInterval(counter);
    setCount(null);
    setCounter(false);
    setOTPSent(false);
    setNumber("");
    setFormattedNumber("");
    // navigation.navigate(routes.signUpScreen, {
    //   verified: true,
    //   phone: formattedNumber,
    // });
    navigation.navigate(ScreenNames.SIGNUP, {
      verified: true,
      phone: formattedNumber,
    });
    Animated.timing(offsetX, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ScreenWrapper
      statusBarColor={AppColors.primary}
      barStyle="light-content"
      scrollEnabled
      headerUnScrollable={() => <Head navigation={navigation} />}
    >
      <View style={styles.mainViewContainer}>
        <ImageBackground source={Icons.bglogo} style={styles.bg}>
          <View style={styles.imageiner}>
            <Text style={styles.logintext}>Otp Verification</Text>
          </View>
        </ImageBackground>
        <View style={{ height: height(70), paddingTop: width(10) }}>
          <View style={styles.container}>
            <Animated.View
              style={{
                width: screenWidth * 2,
                flexDirection: "row",
                marginLeft: offsetX,
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginHorizontal: "1.5%",
                }}
              >
                <View style={{ paddingBottom: 30, alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: AppColors.black,
                    }}
                  >
                    Enter Phone Number
                  </Text>
                </View>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={route?.params?.phone || ""}
                  defaultCode={"PK"}
                  layout="first"
                  onChangeText={(text) => {
                    setNumber(text);
                  }}
                  onChangeFormattedText={(text) => {
                    setFormattedNumber(text);
                  }}
                  withDarkTheme
                  withShadow
                  // autoFocus={ios}
                  disabled={oTPSent || otpLoading}
                  placeholder={"Phone Number"}
                  containerStyle={{
                    width: "100%",
                    borderRadius: 6,
                  }}
                  textContainerStyle={{
                    overflow: "hidden",
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                  }}
                />
                <View
                  style={{
                    alignItems: "center",
                    marginVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    disabled={otpLoading || number.length < 5}
                    onPress={handleRequestOTP}
                    style={{
                      width: "50%",
                      minHeight: 32,
                      elevation: 15,
                      shadowColor: AppColors.border_light,
                      shadowOpacity: 0.9,
                      shadowOffset: { height: 0, with: 0 },
                      shadowRadius: 5,
                      padding: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        otpLoading || number.length < 5
                          ? AppColors.button.disabled
                          : AppColors.button.active,
                      borderRadius: 6,
                    }}
                  >
                    {otpLoading ? (
                      <View style={styles.view}>
                        <ActivityIndicator
                          size="small"
                          color={AppColors.white}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          fontSize: 16,
                          color: AppColors.white,
                          fontWeight: "bold",
                        }}
                      >
                        Send OTP
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: "1.5%",
                }}
              >
                <View style={{ paddingBottom: 30, alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: AppColors.black,
                    }}
                  >
                    Enter OTP
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "center",
                  }}
                >
                  <View style={styles.view}>
                    <TextInput
                      style={{
                        height: 35,
                        width: screenWidth * 0.5,
                        backgroundColor: AppColors.white,
                        borderWidth: 1,
                        borderColor: AppColors.greybackground,
                        marginRight: 5,
                        borderRadius: 3,
                        elevation: 15,
                        paddingHorizontal: 10,
                      }}
                      value={oTP}
                      onChangeText={handleOTPChange}
                      keyboardType="phone-pad"
                      // editable={
                      //   config?.verification?.gateway === "firebase"
                      //     ? !!verificationId
                      //     : true
                      // }
                    />
                  </View>
                  <TouchableWithoutFeedback
                    onPress={handleOtpVerificationRequest}
                    // disabled={
                    //   config?.verification?.gateway === "firebase"
                    //     ? !verificationId
                    //     : false
                    // }
                  >
                    <View
                      style={{
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: AppColors.border_light,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 3,
                        elevation: 15,
                        backgroundColor: AppColors.white,
                        minWidth: screenWidth * 0.2,
                      }}
                    >
                      {verifying ? (
                        <View style={styles.view}>
                          <ActivityIndicator
                            size={"small"}
                            color={AppColors.primary}
                          />
                        </View>
                      ) : (
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: AppColors.primary,
                          }}
                        >
                          Verify
                        </Text>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={{ alignItems: "center", marginVertical: 20 }}>
                  <AppButton
                    title={
                      countValue
                        ? "Resend Otp" + " (" + countValue + ")"
                        : "Resend Otp"
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
                    onPress={handleResendRequest}
                  />
                </View>
              </View>
            </Animated.View>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={app.options}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
