import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Network from "expo-network";
import { getDatabase, off, onValue, ref, get } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getDataofAdByID, getDataofHomePage } from "../backend/api";
import { getOwneAd, getUserByID, loginApi } from "../backend/auth";
import { getCategory } from "../backend/common";
import { Loader } from "../components";
// import * as Notifications from "expo-notifications";
import {
  setAppLoader,
  setCategoryList,
  setNewChat,
  setShowViber,
  setShowWhatsapp,
  setTopAds,
} from "../redux/slices/config";
import { setLanguage } from "../redux/slices/language";
import {
  setAdsFav,
  setChatRedux,
  setChatRooms,
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
  DetailScreen,
  EditProfile,
  FAQScreen,
  HTSFScreen,
  ListData,
  MyListingScreen,
  OtherProfileScreen,
  PasswordScreens,
  PrivacyPolicyScreen,
  PrivacySafety,
  ProfileScreen,
  RepairSreen,
  SearchScreen,
  SellUsScreen,
  TNCScreen,
  WishScreen,
} from "../screens/app";
import {
  CPFscreen,
  ForgetPasswordScreen,
  LoginScreen,
  SignUpScreen,
  verifyScreen,
} from "../screens/auth";
import i18n from "../translation";
import {
  getAuthAllData,
  getAuthData,
  getDatav,
  getDataw,
  getlangData,
  setAuthData,
} from "../utills/Methods";
import MyDrawer from "./drawr";
import ScreenNames from "./routes";

const Stack = createNativeStackNavigator();

export default function Routes() {
  const db = getDatabase();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(true);
  const [user, setUser] = useState();
  const [countMsg, setCountMsg] = useState(0);
  useEffect(() => {
    if (countMsg > 0) {
      dispatch(setNewChat(true));
    } else {
      dispatch(setNewChat(false));
    }
  }, [countMsg]);
  useEffect(() => {
    dispatch(setAppLoader(true));
    getNetwork();
    languageset();
  }, []);
  useEffect(() => {
    if (isConnected) {
      getuser();
      getData();
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
  const getNetwork = async () => {
    let a = await Network.getNetworkStateAsync();
    setIsConnected(a);
  };
  const getuser = async () => {
    try {
      let data = await getAuthData();
      if (data) {
        dispatch(setIsLoggedIn(true));
        login(data);
      }
      const w = await getDataw();
      const v = await getDatav();
      if (w) {
        dispatch(setShowWhatsapp(w == 1 ? true : false));
      }
      if (v) dispatch(setShowViber(v == 1 ? true : false));
    } catch (error) {
      dispatch(setAppLoader(false));
    }
  };
  const login = async (data) => {
    try {
      const response = await loginApi(data);
      if (response?.data) {
        await fetchRoomsData(response?.data?.userDetails?._id);
        const userAd = await getOwneAd(response?.data?.userDetails?._id);
        setUser(response?.data?.userDetails);
        dispatch(setUserMeta(response?.data?.userDetails));
        dispatch(setToken(response?.data?.token));
        dispatch(setUserAds(userAd));
        dispatch(setAdsFav(response?.data?.userDetails?.favAdIds));
      } else if (response?.data?.success == false && isConnected) {
        dispatch(setIsLoggedIn(false));
        dispatch(setUserMeta(null));
        dispatch(setUserAds(null));
        dispatch(setAdsFav([]));
        await setAuthData(null),
          Alert.alert(t("flashmsg.alert"), t("flashmsg.reloginMsg"), [
            { text: "OK", onPress: () => {} },
          ]);
      } else if (response?.success == false) {
        dispatch(setIsLoggedIn(false));
        dispatch(setUserMeta(null));
        dispatch(setUserAds(null));
        dispatch(setAdsFav([]));
        await setAuthData(null),
          Alert.alert(t("flashmsg.alert"), t("flashmsg.reloginMsg"), [
            { text: "OK", onPress: () => {} },
          ]);
      } else {
        let userData = await getAuthAllData();
        if (userData) {
          dispatch(setIsLoggedIn(true));
          dispatch(setUserMeta(userData));

          await fetchRoomsData(userData?._id);
          const userAd = await getOwneAd(userData?._id);
          setUser(userData);
          dispatch(setUserAds(userAd));
          dispatch(setAdsFav(userData?.favAdIds));
        }
        // Alert.alert(t("flashmsg.alert"), t("Check the Internet connection"), [
        //   { text: "OK", onPress: () => {} },
        // ]);
      }
    } catch (error) {
      dispatch(setAppLoader(false));
    }
  };

  const fetchData = useCallback(async (data, id) => {
    const search =
      id === data.split("_")[0] ? data.split("_")[1] : data.split("_")[0];
    const fetchedUser = await getUserByID(search);
    return fetchedUser;
  });
  const myFunction = useCallback(async (data, id) => {
    let lastmsg = {};
    const lastReadRef = await ref(db, `chatrooms/${data}/lastRead/${id}`);

    // Assuming you're using Firebase Realtime Database
    const snapshot = await get(lastReadRef);
    let lastReadTimestamp = await snapshot.val();
    const messagesRef = ref(db, `chatrooms/${data}/messages`);
    onValue(messagesRef, (snapshot) => {
      const messageData = snapshot.val();

      if (messageData) {
        const messageList = Object.values(messageData);
        lastmsg = messageList[messageList.length - 1];
      }
    });
    return { lastmsg, readd: lastReadTimestamp < lastmsg?.timestamp };
  });

  const getItems = useCallback(async (data) => {
    const response = await getDataofAdByID(data.split("_")[2]);
    return response;
  });

  async function getCategorylist() {
    const d = await getCategory();
    if (d) dispatch(setCategoryList(d));
  }
  const fetchRoomsData = useCallback(async (userId) => {
    try {
      roomRef = ref(db, `users/${userId}/rooms`);

      const handleRoomUpdate = async (snapshot) => {
        const room = snapshot.val() || [];
        dispatch(setChatRooms(room));
        if (userId) {
          await promisFuntion(room, userId);
        }
      };

      onValue(roomRef, handleRoomUpdate);

      // Clean up the listener when the component is unmounted or the user logs out
      return () => {
        if (roomRef) {
          off(roomRef, handleRoomUpdate);
        }
      };
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  });

  // async function schedulePushNotification() {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "Eidcarosse",
  //       body: "New message",
  //     },
  //     trigger: { seconds: 0.2 },
  //   });
  // }

  const promisFuntion = async (allRooms, id) => {
    try {
      const promises = allRooms.map(async (element) => {
        let u = await fetchData(element, id);
        let l = await myFunction(element, id);
        let i = await getItems(element);
        return {
          roomId: element,
          user: u,
          lastmsg: l?.lastmsg,
          product: i,
          read: l?.readd,
        };
      });

      const newData = await Promise.all(promises);
      if (newData.find((item) => item?.read == true)) {
        // await schedulePushNotification();
        dispatch(setNewChat(true));
      } else {
        dispatch(setNewChat(false));
      }
      dispatch(setChatRedux(newData));
      dispatch(setAppLoader(false));
    } catch (e) {
      dispatch(setAppLoader(false));
    }
  };
  const languageset = async () => {
    let lang = await getlangData();
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };
  return (
    <NavigationContainer>
      <Loader />
      <Stack.Navigator screenOptions={{ header: () => false }}>
        <Stack.Screen name={"drawr"} component={MyDrawer} />
        <Stack.Screen name={ScreenNames.LOGIN} component={LoginScreen} />
        <Stack.Screen
          name={ScreenNames.FORGET}
          component={ForgetPasswordScreen}
        />
        <Stack.Screen name={ScreenNames.VERIFY} component={verifyScreen} />
        <Stack.Screen name={ScreenNames.SIGNUP} component={SignUpScreen} />
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
        <Stack.Screen name={ScreenNames.SNTU} component={SellUsScreen} />
        <Stack.Screen name={ScreenNames.REPAIR} component={RepairSreen} />
        <Stack.Screen name={ScreenNames.SETTING} component={AppSetting} />
        <Stack.Screen name={ScreenNames.PANDS} component={PrivacySafety} />

        <Stack.Screen name={ScreenNames.CPF} component={CPFscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
