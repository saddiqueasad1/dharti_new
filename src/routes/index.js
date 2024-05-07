import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getDatabase } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { getDataofHomePage } from "../backend/api";
import { loginApi } from "../backend/auth";
import { getCategory } from "../backend/common";
import { Loader } from "../components";
// import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import mobileAds from "react-native-google-mobile-ads";
import {
  setAppLoader,
  setCategoryList,
  setNewChat,
  setTopAds,
} from "../redux/slices/config";
import { setLanguage } from "../redux/slices/language";
import {
  setAdsFav,
  setIsLoggedIn,
  setToken,
  setUserAds,
  setUserMeta,
} from "../redux/slices/user";
import {
  AboutUsScreen,
  AccountScreen,
  AddPostScreen,
  AppSetting,
  BikeScreen,
  CategoryScreen,
  ChatViewScreen,
  DStoreDetailsScreen,
  DStoreScreen,
  DetailScreen,
  EditListingScreen,
  EditProfile,
  FAQScreen,
  HTSFScreen,
  ListData,
  MyListingScreen,
  MyStoreScreen,
  OtherProfileScreen,
  PasswordScreens,
  PrivacyPolicyScreen,
  PrivacySafety,
  ProfileScreen,
  SearchScreen,
  SelectLocationScreen,
  TNCScreen,
  WishScreen,
} from "../screens/app";
import {
  CPFscreen,
  ForgetPasswordScreen,
  LoginScreen,
  OtpVerificationScreen,
  SignUpScreen,
  verifyScreen,
} from "../screens/auth";
import i18n from "../translation";
import { getAuthData, getlangData, setAuthData } from "../utills/Methods";
import MyDrawer from "./drawr";
import ScreenNames from "./routes";

const prefix = Linking.createURL("/");

const Stack = createNativeStackNavigator();

export default function Routes() {
  const db = getDatabase();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(true);
  const [user, setUser] = useState();
  const [countMsg, setCountMsg] = useState(0);

  // const linking = {
  //   prefixes: [prefix],
  // };

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        DetailScreen: "DetailScreen",
        Login: "Login",
      },
    },
  };

  console.log("useUrl---- : ", linking);

  useEffect(() => {
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log("---adapterStatuses--");
        console.log(adapterStatuses);
        // Initialization complete!
      });
    if (countMsg > 0) {
      dispatch(setNewChat(true));
    } else {
      dispatch(setNewChat(false));
    }
  }, [countMsg]);
  useEffect(() => {
    dispatch(setAppLoader(true));
    languageset();
  }, []);
  useEffect(() => {
    if (isConnected) {
      getuser();
      // getData();
      getCategorylist();
    } else {
      dispatch(setAppLoader(true));
    }
  }, [isConnected]);
  const getData = useCallback(async () => {
    try {
      const data = await getDataofHomePage();

      if (data) {
        dispatch(setTopAds(data));
      } else {
        dispatch(setTopAds([]));
      }
    } catch (error) {
      console.log("Error:", error);
      dispatch(setAppLoader(false));
    }
  });

  const getuser = async () => {
    try {
      let data = await getAuthData();
      if (data) {
        dispatch(setIsLoggedIn(true));
        login(data);
      }
    } catch (error) {
      dispatch(setAppLoader(false));
    }
  };
  const login = async (data) => {
    try {
      const APIData = { username: data.email, password: data.password };

      const response = await loginApi(APIData);
      if (response?.jwt_token) {
        const userDetails = response.user;
        setUser(userDetails);
        dispatch(setUserMeta(userDetails));
        dispatch(setToken(response.jwt_token));
        dispatch(setAdsFav(userDetails.favAdIds));
        dispatch(setIsLoggedIn(true));
      } else if (response?.success === false && isConnected) {
        dispatch(setIsLoggedIn(false));
        dispatch(setUserMeta(null));
        dispatch(setUserAds(null));
        dispatch(setAdsFav([]));
        await setAuthData(null),
          Alert.alert(t("flashmsg.alert"), t("flashmsg.reloginMsg"), [
            { text: "OK", onPress: () => {} },
          ]);
      } else {
      }
    } catch (error) {
      dispatch(setAppLoader(false));
    }
  };

  async function getCategorylist() {
    console.log("()=> getCategorylist");
    const d = await getCategory();
    console.log("res on cat");
      console.log(d);
    if (d) dispatch(setCategoryList(d));
  }

  const languageset = async () => {
    let lang = await getlangData();
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };
  return (
    <NavigationContainer>
      <Loader />
      <Stack.Navigator
        linking={linking}
        screenOptions={{ header: () => false }}
      >
        <Stack.Screen name={"drawr"} component={MyDrawer} />
        <Stack.Screen name={ScreenNames.LOGIN} component={LoginScreen} />
        <Stack.Screen
          name={ScreenNames.FORGET}
          component={ForgetPasswordScreen}
        />
        <Stack.Screen name={ScreenNames.VERIFY} component={verifyScreen} />
        <Stack.Screen name={ScreenNames.SIGNUP} component={SignUpScreen} />
        <Stack.Screen
          name={ScreenNames.OTPVERIFICATIO}
          component={OtpVerificationScreen}
        />
        <Stack.Screen name={ScreenNames.DETAIL} component={DetailScreen} />
        <Stack.Screen name={ScreenNames.LISTDATA} component={ListData} />
        <Stack.Screen name={ScreenNames.CATEGORY} component={CategoryScreen} />
        <Stack.Screen name={ScreenNames.BIKECATEGORY} component={BikeScreen} />
        <Stack.Screen name={ScreenNames.SEARCH} component={SearchScreen} />
        <Stack.Screen name={ScreenNames.PROFILE} component={ProfileScreen} />
        <Stack.Screen
          name={ScreenNames.OTHERPROFILE}
          component={OtherProfileScreen}
        />
        <Stack.Screen name={ScreenNames.EDITPROFILE} component={EditProfile} />
        <Stack.Screen name={ScreenNames.PASSWORD} component={PasswordScreens} />
        <Stack.Screen name={ScreenNames.ACCOUNT} component={AccountScreen} />
        <Stack.Screen name={ScreenNames.WISH} component={WishScreen} />
        <Stack.Screen
          name={ScreenNames.MYLISTING}
          component={MyListingScreen}
        />
        <Stack.Screen name={ScreenNames.ADDPOST} component={AddPostScreen} />
        <Stack.Screen name={ScreenNames.CHAT} component={ChatViewScreen} />
        <Stack.Screen name={ScreenNames.FAQ} component={FAQScreen} />
        <Stack.Screen name={ScreenNames.HTSF} component={HTSFScreen} />
        <Stack.Screen name={ScreenNames.ABOUTUS} component={AboutUsScreen} />
        <Stack.Screen name={ScreenNames.TNC} component={TNCScreen} />
        <Stack.Screen name={ScreenNames.PP} component={PrivacyPolicyScreen} />
        <Stack.Screen name={ScreenNames.REPAIR} component={DStoreScreen} />
        <Stack.Screen
          name={ScreenNames.DStoreDetailsScreen}
          component={DStoreDetailsScreen}
        />
        <Stack.Screen name={ScreenNames.SETTING} component={AppSetting} />
        <Stack.Screen name={ScreenNames.PANDS} component={PrivacySafety} />

        <Stack.Screen name={ScreenNames.CPF} component={CPFscreen} />
        <Stack.Screen name={ScreenNames.MYSTORE} component={MyStoreScreen} />
        <Stack.Screen
          name={ScreenNames.SELECTLOCATION}
          component={SelectLocationScreen}
        />
        <Stack.Screen
          name={ScreenNames.EDITLISTINGSCREEN}
          component={EditListingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
