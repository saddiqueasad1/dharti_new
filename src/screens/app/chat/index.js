import React, { useCallback, useState } from "react";
import { FlatList, Text, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ChatIcon, ScreenWrapper } from "../../../components";
import Header from "../../../components/header";
import { setNewChat } from "../../../redux/slices/config";
import {
  selectChatRedux,
  selectToken,
  selectUserMeta,
  setChatRedux,
  setChatRooms,
} from "../../../redux/slices/user";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";
import { ApiManager } from "../../../backend/ApiManager";
import moment from "moment";
import ScreenNames from "../../../routes/routes";

export default function ChatList({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUserMeta);
  const getChat = useSelector(selectChatRedux);
  const [Chat, setChat] = useState(getChat);
  const [loading, setLoading] = useState(false);
  const auth_token = useSelector(selectToken);

  useFocusEffect(
    useCallback(() => {
      fetchRooms(user?._id);
    }, [])
  );

  const fetchRooms = async (userId) => {
    setLoading(true);

    try {
      ApiManager.setAuthToken(auth_token);
      ApiManager.get("my/chat").then((res) => {
        dispatch(setChatRooms(res));
        dispatch(setNewChat(res));
        dispatch(setChatRedux(res));
        setChat(res);
      });
    } catch (error) {
      console.error("Error fetching room data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = (item) => {
    Alert.alert(
      "",
      `${t("chatListScreenTexts.deletePromptMessage")}`,
      [
        {
          text: t("chatListScreenTexts.cancelButtonTitle"),
        },
        {
          text: t("chatListScreenTexts.deleteButtonTitle"),
          onPress: () => handleDeleteConversation(item),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteConversation = (item) => {
    ApiManager.setAuthToken(auth_token);
    ApiManager.delete("my/chat/conversation", { con_id: item.con_id }).then(
      (res) => {
        setChat(Chat.filter((message) => message != item));
      }
    );
  };

  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Header navigation={navigation} title="Chats" />
      )}
      refreshing={loading}
      onRefresh={fetchRooms}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={Chat}
          renderItem={({ item }) => (
            <ChatIcon
              onPress={() =>
                navigation.navigate(ScreenNames.CHAT, {
                  ...item,
                  from: "list",
                })
              }
              thumb={
                item.listing.images.length > 0
                  ? item.listing.images[0].sizes.thumbnail.src
                  : null
              }
              chatTitle={item.display_name}
              addTitle={item.listing.title}
              lastmessage={item.last_message}
              time={moment(item.last_message_created_at).fromNow()}
              onLongPress={() => handleDeleteAlert(item)}
              is_read={item.is_read}
              source_id={item.source_id}
              item={item}
            />
          )}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={() => (
            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                height: height(80),
              }}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={width(60)}
                color={AppColors.bgIcon}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: height(2),
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
