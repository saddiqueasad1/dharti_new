import React, { Fragment } from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import styles from "./styles";
import { selectUserMeta } from "../../redux/slices/user";
import { useSelector } from "react-redux";
import AppColors from "../../utills/AppColors";
import { decodeString } from "../../utills/helper";

export default function ChatIcon({
  data,
  thumb,
  chatTitle,
  addTitle,
  lastmessage,
  onPress,
  time,
  onLongPress,
  is_read,
  source_id,
  item,
}) {
  const user = useSelector(selectUserMeta);

  return (
    <Fragment>
      <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
        <View
          style={[
            styles.message,
            {
              backgroundColor:
                is_read == 0 && user.id != source_id
                  ? AppColors.bg_primary
                  : AppColors.white,
            },
          ]}
        >
          <View style={styles.chatImageContainer}>
            <Image
              style={styles.chatImage}
              source={
                thumb === null
                  ? chatListItemFallbackImageUrl
                  : {
                      uri: thumb,
                    }
              }
            />
          </View>
          <View
            style={[
              styles.chatDetails,
              {
                marginLeft: 10,
                marginRight: 0,
              },
            ]}
          >
            <View style={[styles.titleRow]}>
              <Text style={styles.chatTitle} numberOfLines={1}>
                {decodeString(chatTitle)}
              </Text>
              <Text style={{ color: AppColors.text_light }}>{time}</Text>
            </View>
            <View
              style={[
                { marginBottom: 2, flexDirection: "row", alignItems: "center" },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.addTitle]} numberOfLines={1}>
                  {decodeString(addTitle)}
                </Text>
              </View>
              {is_read == 0 && user.id != source_id && (
                <View
                  style={{
                    backgroundColor: AppColors.green,
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 5,
                    marginRight: 0,
                    marginLeft: 5,
                  }}
                >
                  <Text style={{ fontSize: 12, color: AppColors.white }}>
                    {item.unread_count}
                  </Text>
                </View>
              )}
            </View>
            <Text numberOfLines={1} style={[{ color: AppColors.text_gray }]}>
              {decodeString(lastmessage)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Fragment>
  );
}
