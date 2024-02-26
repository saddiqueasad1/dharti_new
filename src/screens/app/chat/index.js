import { get, getDatabase, off, onValue, ref } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getDataofAdByID } from "../../../backend/api";
import { getUserByID } from "../../../backend/auth";
import { ChatIcon, ScreenWrapper } from "../../../components";
import Header from "../../../components/header";
import { selectNewChat, setNewChat } from "../../../redux/slices/config";
import {
  selectChatRedux,
  selectChatRooms,
  selectUserMeta,
  setChatRedux,
  setChatRooms,
} from "../../../redux/slices/user";
import AppColors from "../../../utills/AppColors";
import { height } from "../../../utills/Dimension";
import styles from "./styles";
export default function ChatList({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const db = getDatabase();
  const user = useSelector(selectUserMeta);
  const newone = useSelector(selectNewChat);
  const allRooms = useSelector(selectChatRooms);
  const Chat = useSelector(selectChatRedux);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchRooms(user?._id);
    }, [])
  );
  // async function schedulePushNotification() {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "Eidcarosse",
  //       body: "New message",
  //     },
  //     trigger: { seconds: 1 },
  //   });
  // }
  const fetchRooms = async (userId) => {
    try {
      let roomRef = ref(db, `users/${userId}/rooms`);

      const handleRoomUpdate = (snapshot) => {
        const room = snapshot.val() || [];
        dispatch(setChatRooms(room));
      };
      onValue(roomRef, handleRoomUpdate);
      return () => {
        if (roomRef) {
          off(roomRef, handleRoomUpdate);
        }
      };
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const fetchData = useCallback(async (data) => {
    const search =
      user._id === data.split("_")[0] ? data.split("_")[1] : data.split("_")[0];
    const fetchedUser = await getUserByID(search);
    return fetchedUser;
  });
  const myFunction = useCallback(async (data) => {
    let lastmsg = {};
    const lastReadRef = await ref(
      db,
      `chatrooms/${data}/lastRead/${user?._id}`
    );

    // Assuming you're using Firebase Realtime Database
    const snapshot = await get(lastReadRef);
    const lastReadTimestamp = await snapshot.val();
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
  const promisFuntion = useCallback(async () => {
    try {
      setLoading(true);
      const promises = allRooms.map(async (element) => {
        let u = await fetchData(element);
        let l = await myFunction(element);
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
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  });
  useEffect(() => {
    if (allRooms) promisFuntion();
  }, [allRooms]);

  return (
    <ScreenWrapper
      headerUnScrollable={() => <Header navigation={navigation} title="Chats" />}
      refreshing={loading}
      onRefresh={promisFuntion}
      scrollEnabled
    >
      {/* {loading && (
        <View>
          <ActivityIndicator color={AppColors.primary} size={"large"} />
        </View>
      )} */}

      <View style={styles.mainViewContainer}>
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={Chat}
          renderItem={({ item }) => (
            <ChatIcon data={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={() => (
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: height(2),
                  paddingTop: height(40),
                  color: AppColors.black,
                }}
              >
                {t("commmon.nochatMsg")}
              </Text>
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}
