import { AntDesign } from "@expo/vector-icons";
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
} from "react-native";
import { useDispatch } from "react-redux";
import Icons from "../../../asset/images";
import { loginApi } from "../../../backend/auth";
import { Button, Head, Input, ScreenWrapper } from "../../../components";
import { setAppLoader } from "../../../redux/slices/config";
import PhoneInput from "react-native-phone-number-input";
import { useSelector } from "react-redux";
import {
  setAdsFav,
  setIsLoggedIn,
  setToken,
  setUserMeta,
} from "../../../redux/slices/user";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import {
  errorMessage,
  setAuthData,
  successMessage,
} from "../../../utills/Methods";
import styles from "./styles";
import AppButton from "../../../components/AppButton";
import { selectAppState } from "../../../redux/slices/appConfig/index";
import { ApiManager } from "../../../backend/ApiManager";
// import auth from '@react-native-firebase/auth';
export default function OtpVerification({ navigation, route }) {
  const dispatch = useDispatch(); 
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const offsetX = useRef(new Animated.Value(0)).current;
  const phoneInput = useRef(null);

  function onAuthStateChanged(user) {
   console.log("user-----");
   console.log(user);
  }

  useEffect(() => {
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // console.log("appConfig-----str,at", subscriber);
    console.log(appSettings);
    console.log("end---");
    console.log(config);
    console.log(ios);
  }, [appSettings, config, ios, user, auth_token]);

  const isValidEmail = (email) => {
    return email.length > 0;
  };
  const isValidPassword = (password) => {
    return password.length >= 6;
  };
  const userData = {
    username: email.trim(),
    password: password.trim(),
  };

  const handleOTPChange = (text) => {
    setOTP(text);
  };


  const firebaseOTPRequest = async () => {
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.
    try {
      // const phoneProvider = new auth.PhoneAuthProvider(auth);
      // const credential = auth.PhoneAuthProvider.credential(confirm.verificationId, code);
      // const verificationId =
      console.log('()=> firebaseOTPRequest');

      console.log(formattedNumber);
      // await auth()
      //   .verifyPhoneNumber(formattedNumber)
      //   .then((confirmation) => {
      //     // setVerificationId(verificationId);

      //     console.log("confirmation");
      //     console.log(confirmation);
      //     Animated.timing(offsetX, {
      //       toValue: -screenWidth,
      //       duration: 1000,
      //       useNativeDriver: false,
      //     }).start();
      //     setOTPSent(true);
      //   })
      //   .catch((err) =>{ console.log(err); alert(err.message)})
      //   .finally(() => setOtpLoading(false));
      // setVerificationId(verificationId);
    } catch (err) {
      alert(err.message);
    }
  };



  const handleRequestOTP = async () => {
    setOtpLoading(true);
    // console.log(JSON.stringify(appConfig));
    // console.log('ookkk',formattedNumber);
    // console.log(' config?.verification?.gateway', config);
    try {
      const requestData = {
        phone: formattedNumber,
        gateway: "firebase",
        // gateway: config?.verification?.gateway,
      };

      console.log("verification---- aterty");
      // if (config?.verification?.gateway === "firebase") {
        const res = await ApiManager.post("verification/send-otp", requestData);
        console.log("this is res", res);
        if (res.status === "success") {
          
          firebaseOTPRequest();
          // alert(res?.message || res?.data?.data?.error);
          // alert("nice")
        } else {
          alert(res?.data?.message || res?.data?.data?.error);
        }
      // }
      return

      if (config?.verification?.gateway === "twilio") {
        if (user) {
          setAuthToken(auth_token);
        }

        const res = await ApiManager.post("verification/send-otp", requestData);

        if (res?.ok) {
          Animated.timing(offsetX, {
            toValue: -screenWidth,
            duration: 1000,
            useNativeDriver: false,
          }).start();
          setOTPSent(true);
        } else {
          alert(res?.data?.message || res?.data?.data?.error);
        }

        if (user) {
          removeAuthToken();
        }
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
    setVerifying(true);
    if (config?.verification?.gateway === "firebase") firebaseOTPVerification();
    if (config?.verification?.gateway === "twilio") {
      if (user) {
        setAuthToken(auth_token);
      }
      ApiManager
        .post("verification/verify-otp", { phone: formattedNumber, code: oTP })
        .then((res) => {
          if (res?.ok) {
            setOTP("");
            Alert.alert(
              __("oTPScreenText.successTitle", appSettings.lng),
              __("oTPScreenText.successMessage", appSettings.lng),

              [
                {
                  text:
                    route?.params?.source === "profile"
                      ? __("oTPScreenText.okBtnTitle", appSettings.lng)
                      : __("oTPScreenText.signUpBtnTitle", appSettings.lng),
                  onPress: () => handleCleanUp(),
                },
              ]
            );
          } else {
            alert(res?.data?.message || res?.data?.data?.error);
          }
        })
        .then(() => {
          if (user) {
            removeAuthToken();
          }
          setVerifying(false);
        });
    }
  };

  const login = async (data) => {
    try {
      console.log("login----");
      dispatch(setAppLoader(true));
      let res = await loginApi(data);
      if (!res?.success) {
        dispatch(setAppLoader(false));
        errorMessage(res?.message);
      } else if (res?.success) {
        dispatch(setIsLoggedIn(true));
        dispatch(setUserMeta(res?.data?.userDetails));
        dispatch(setToken(res?.data?.token));
        dispatch(setAdsFav(res?.data?.userDetails?.favAdIds));
        setAuthData(data);
        dispatch(setAppLoader(false));
        successMessage("saved");
        navigation.navigate(ScreenNames.BUTTOM);
      } else {
        alert("Somthing wrong in Login"), dispatch(setAppLoader(false));
      }
    } catch (error) {
      errorMessage("Network error");
      console.log(error);
      dispatch(setAppLoader(false));
    }
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
                  // defaultCode={
                  //   config?.verification?.default_country ||
                  //   miscConfig?.defaulTCountryCode ||
                  //   "US"
                  // }
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
                  // countryPickerProps={{
                  //   countryCodes: config?.verification?.country_list
                  //     ? config.verification.country_list
                  //     : miscConfig.countryCodes,
                  // }}
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
            {/* {config?.verification?.gateway === "firebase" &&
              firebaseConfig?.enabled && (
                <FirebaseRecaptchaVerifierModal
                  ref={recaptchaVerifier}
                  firebaseConfig={app.options}
                />
              )}
            {attemptInvisibleVerification && <FirebaseRecaptchaBanner />} */}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
