import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import CheckBox from "react-native-check-box";
import { useDispatch } from "react-redux";
import Icons from "../../../asset/images";
import { signupApi } from "../../../backend/auth";
import {
  Button,
  Head,
  Input,
  NumberInput,
  ScreenWrapper,
} from "../../../components";
import { setAppLoader } from "../../../redux/slices/config";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import { errorMessage, successMessage } from "../../../utills/Methods";
import styles from "./styles";
export default function SignUp({ navigation, route }) {
  const verifiedPhone = route.params.phone;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [check, setCheck] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(verifiedPhone);
  const [whatsapp, SetWhatsapp] = useState("");
  const [viber, setViber] = useState("");

  const [firstNamer, setFirstNamer] = useState("");
  const [lastNamer, setLastNamer] = useState("");
  const [userNamer, setUserNamer] = useState("");
  const [emailr, setEmailr] = useState("");
  const [passwordr, setPasswordr] = useState("");
  const [phoneNumberr, setPhoneNumberr] = useState("");

  const userData = {
    firstName,
    lastName,
    userName,
    email,
    password,
    phoneNumber,
    whatsapp,
    viber,
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  // const isValidPassword = (password) => {
  //   const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=!])(?=.{6,})/;
  //   return passwordRegex.test(password);
  // };
  const isValidPassword = (password) => {
    return password.length >= 8;
  };
  const signup = async (data) => {
    try {
      console.log("..srart...");
      const data_ = {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.firstName + data.lastName,
        email: data.email,
        phone: data.phoneNumber,
        password: data.password,
      };

      dispatch(setAppLoader(true));
      let r = await signupApi(data_);
      if (r?.verification_mail) {
        alert(
          "An email is sent to your mail address with a verification link. Please verify your email address before logging in."
        );
      }
      if (r.code === "400") {
        errorMessage(r?.error_message[0], t(`flashmsg.error`));
      } else {
        successMessage(t(`flashmsg.sussessloginmsg`), t(`flashmsg.success`));
        successMessage("Verified login now", "Success");
        navigation.navigate(ScreenNames.LOGIN);
      }
      dispatch(setAppLoader(false));
    } catch (error) {
      errorMessage('INVALID_USER_DATA', t(`flashmsg.error`));
      dispatch(setAppLoader(false));
    }
  };

  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => (
        <Head navigation={navigation} headtitle={t("signup.signup")} />
      )}
    >
      <View style={{ paddingVertical: height(3) }}>
        <Input
          value={firstName}
          setvalue={setFirstName}
          title={"signup.firstNameTitle"}
          placeholder={"signup.firstNamePlaceholder"}
          require={firstNamer}
        />
        <Input
          value={lastName}
          setvalue={setLastName}
          title={"signup.lastNameTitle"}
          placeholder={"signup.lastNamePlaceholder"}
          require={lastNamer}
        />
        {/* <Input
          value={userName}
          setvalue={setUserName}
          title={"signup.userNameTitle"}
          placeholder={"signup.usernamePlaceholder"}
          require={userNamer}
        /> */}
        <Input
          value={email}
          setvalue={setEmail}
          title={"signup.emailTitle"}
          autoCapitalize={"none"}
          placeholder={"signup.emailPlaceholder"}
          require={emailr}
          keyboardType="email-address"
        />
        <Input
          value={password}
          setvalue={setPassword}
          title={"signup.passwordTitle"}
          placeholder={"signup.passwordPlaceholder"}
          secure={true}
          require={passwordr}
        />
        <Input
          value={phoneNumber}
          setvalue={setPhoneNumber}
          title={"signup.phoneNumberTitle"}
          placeholder={"signup.phoneNumberPlaceholder"}
          require={false}
          editable={false}
        />
        {/* <NumberInput
          value={phoneNumber}
          secure={false}
          showBtn={false}
          setvalue={setPhoneNumber}
          title={"signup.phoneNumberTitle"}
          placeholder={"signup.phoneNumberPlaceholder"}
          require={phoneNumberr}
          keyboardType="phone-pad"
        /> */}
        <View style={styles.checkview}>
          <CheckBox
            checkedImage={
              <MaterialIcons
                name="check-box"
                size={width(4)}
                color={AppColors.primary}
              />
            }
            unCheckedImage={
              <MaterialIcons name="check-box-outline-blank" size={width(4)} />
            }
            style={{ paddingRight: width(2) }}
            onClick={() => {
              setCheck(!check);
            }}
            checkedCheckBoxColor={AppColors.primary}
            isChecked={check}
          />
          <View
            style={{
              flexWrap: "wrap",
              flexDirection: "row",
              width: width(85),
            }}
          >
            <Text style={{ fontSize: height(1.5) }}>
              {t("signup.checkBoxText")}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNames.TNC)}
            >
              <Text style={styles.tandc}>
                {"  "}
                {t("signup.termAndCondition")}
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: height(1.5) }}>
              {t("signup.checkBoxText2")}
            </Text>
          </View>
        </View>
        <Button
          disabled={!check}
          onPress={() => {
            if (!firstName) {
              setFirstNamer("require feild");
            } else if (!lastName) {
              setLastNamer("require feild");
            } else if (!email) {
              setEmailr("require feild");
            } else if (!isValidEmail(email)) {
              setEmailr("Email incorect formate");
            } else if (!password) {
              setPasswordr("require feild");
            } else if (!isValidPassword(password)) {
              setPasswordr(
                "Altest 1 capital ,1 Small and 1 specail and must be 6 character"
              );
            } else if (!phoneNumber) {
              setPhoneNumberr("Phone Number require");
            } else signup(userData);

            if (firstName) {
              setFirstNamer("");
            }
            if (lastName) {
              setLastNamer("");
            }
            if (email && isValidEmail(email)) {
              setEmailr("");
            }
            if (password && isValidPassword(password)) {
              setPasswordr("");
            }
          }}
          containerStyle={check ? styles.button : styles.dbutton}
          title={"signup.signupButton"}
        />

        <View style={{ height: height(5) }} />

        <View style={styles.already}>
          <Text style={{ fontSize: height(1.5) }}>
            {t("signup.alreadyHaveAccount")}
            {"  "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.signin}>{t("signup.signin")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
