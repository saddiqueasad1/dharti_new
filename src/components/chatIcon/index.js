import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Dialog from "react-native-dialog";
import ScreenNames from "../../routes/routes";
import { height, width } from "../../utills/Dimension";
import styles from "./styles";
import { onValue, remove } from "firebase/database";
import { get, getDatabase, ref, set } from "firebase/database";
import { selectUserMeta, setChatRooms } from "../../redux/slices/user";
import { useDispatch, useSelector } from "react-redux";
import AppColors from "../../utills/AppColors";
import { selectNewChat, setNewChat } from "../../redux/slices/config";
// import * as Notifications from "expo-notifications";
import GlobalMethods from "../../utills/Methods";
import { selectCurrentLanguage } from "../../redux/slices/language";
export default function ChatIcon({ data }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useSelector(selectUserMeta);
  const language = useSelector(selectCurrentLanguage);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState();
  const [newMsg, setNewMsg] = useState();
  const [userDetail, setUserDetail] = useState();
  const [latestMsg, setLatestMsg] = useState();
  const [lastNot, setLastNot] = useState(new Date());
  const [not, setNot] = useState(0);

  useEffect(() => {
    setSelectedItem(!data?.product || !data?.user);
    setUserDetail(data);
    if (!(data?.product && data?.user)) {
      // deleteChatroom(data?.roomId);
    }
    // setLatestMsg(data?.lastmsg);
  }, [data]);
  const database = getDatabase();

  const deleteChatroom = async (chatroomId) => {
    try {
      // await remove(ref(database, `chatrooms/${chatroomId}/messages`));
      // await remove(ref(database, `chatrooms/${chatroomId}/lastRead`));
      // await remove(ref(database, `chatrooms/${chatroomId}`));
      // await setRooms(chatroomId, data?.user?._id);
      await setRooms(chatroomId, user?._id);
    } catch (error) {
      console.error("Error deleting chatroom:", error.message);
      // Handle errors as needed
    }
  };
  // async function schedulePushNotification(title, body) {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: title,
  //       body: body,
  //     },
  //     trigger: null,
  //   });
  // }
  const setRooms = async (roomId, id) => {
    try {
      const userRef = ref(database, `users/${id}/rooms`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const currentRooms = snapshot.val() || [];

        // Filter out the room to be removed
        const updatedRooms = currentRooms.filter((room) => room !== roomId);

        // Update the user's data with the updated rooms array
        await set(userRef, updatedRooms);
      }
    } catch (error) {}
  };

  const handlePress = useCallback(() => {
    if (data?.roomId == userDetail?.roomId) {
      setNewMsg(false);
      navigation.navigate(ScreenNames.CHAT, {
        usr: data?.user,
        userRoom: data?.roomId,
        userItem: data?.product,
      });
    }
  });

  const handleSnapshot = useCallback(async (snapshot) => {
    let lastmsg = {};
    const lastReadRef = ref(
      database,
      `chatrooms/${userDetail?.roomId}/lastRead/${user?._id}`
    );
    const snapsho = await get(lastReadRef);
    let lastReadTimestamp = await snapsho.val();
    const messageData = snapshot.val();
    if (messageData) {
      const messageList = Object.values(messageData);
      lastmsg = messageList[messageList.length - 1];
    }
    setLatestMsg(lastmsg);
    setNewMsg(lastReadTimestamp < lastmsg?.timestamp);
    if (lastReadTimestamp < lastmsg?.timestamp) {
      if (
        lastmsg.senderId != user?._id &&
        lastmsg?.timestamp < lastNot &&
        not == 0
      ) {
        setLastNot(lastmsg?.timestamp);
        setNot(not + 1);
        // await schedulePushNotification(
        //   userDetail?.user?.firstName,
        //   lastmsg.text
        // );
      }
      dispatch(setNewChat(lastReadTimestamp < lastmsg?.timestamp));
    }
    // Handle the updated data here
  });

  useEffect(() => {
    if (data?.roomId == userDetail?.roomId) {
      const dataRef = ref(database, `chatrooms/${userDetail?.roomId}/messages`);
      setNot(0);
      onValue(dataRef, handleSnapshot);
    }
  }, [userDetail]);

  return (
    <Fragment>
      <TouchableOpacity
        style={styles.main}
        onLongPress={() => setVisible(true)}
        onPress={handlePress}
      >
        <View
          style={[
            styles.imageview,
            selectedItem && { borderColor: "lightgrey" },
          ]}
        >
          <Image
            resizeMode="cover"
            style={[styles.image]}
            source={{
              uri:
                userDetail?.user?.image ||
                "https://res.cloudinary.com/dlkuyfwzu/image/upload/v1704430891/Simple_avatar_qrmt3r.png",
            }}
            onLoad={() => setImageLoading(false)}
          />
          {imageLoading && (
            <View
              style={{
                width: height(8),
                height: height(8),
                borderRadius: height(10),
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color={AppColors.primary} />
            </View>
          )}
          {selectedItem && (
            <View
              style={{
                width: height(8),
                height: height(8),
                borderRadius: height(10),
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                position: "absolute",
              }}
            />
          )}
        </View>
        <View style={styles.detail}>
          <Text
            numberOfLines={1}
            style={[
              {
                fontWeight: "bold",
                fontSize: height(1.8),
                paddingTop: height(1),
                color: AppColors.black,
              },
              selectedItem && { color: "lightgrey" },
            ]}
          >
            {userDetail?.user
              ? `${userDetail?.user?.firstName} ${userDetail?.user?.lastName}`
              : "Eidcarosse user"}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              {
                paddingTop: height(1),
                fontSize: height(1.5),
                color: AppColors.black,
              },
              newMsg && { fontWeight: "bold", fontSize: height(1.3) },
              selectedItem && { color: "lightgrey" },
            ]}
          >
            {latestMsg?.text}
            {/* {data?.lastmsg?.text} */}
            {latestMsg?.images && (
              <Ionicons
                name="image"
                size={height(2)}
                color={newMsg ? AppColors.black : "grey"}
              />
            )}
          </Text>
          <Text />
        </View>
        <View style={styles.icons}>
          <Text
            numberOfLines={1}
            style={[
              {
                fontWeight: "bold",
                fontSize: height(1.2),
                color: AppColors.black,
              },
              selectedItem && { color: "lightgrey" },
            ]}
          >
            {latestMsg?.timestamp &&
              `${new Date(latestMsg?.timestamp).getDate()}/${
                new Date(latestMsg?.timestamp).getMonth() + 1
              }/${new Date(latestMsg?.timestamp).getFullYear()}`}
          </Text>
          {newMsg && (
            <View
              style={{
                backgroundColor: AppColors.primary,
                height: height(1.5),
                width: height(1.5),
                borderRadius: height(1),
                marginTop: height(1.2),
              }}
            />
          )}
        </View>
      </TouchableOpacity>
      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title> {t("Delete Chat")}</Dialog.Title>
          <Dialog.Description>
            <Text style={{ fontSize: height(1.5), color: AppColors.black, }}>
              {t("Do you want to delete the chat")}
            </Text>
          </Dialog.Description>
          <Dialog.Button
            label={t("myad.cancel")}
            onPress={() => {
              setVisible(false);
            }}
          />
          <Dialog.Button
            color={"red"}
            label={t("myad.delete")}
            onPress={() => {
              deleteChatroom(data?.roomId);
              setVisible(false);
            }}
          />
        </Dialog.Container>
      </View>
    </Fragment>
  );
}
