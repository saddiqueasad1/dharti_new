import { get, getDatabase, onValue, push, ref, set } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Actions,
  Bubble,
  Day,
  GiftedChat,
  MessageText,
  Send,
  Time,
} from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import { AdView, DropDownMenu } from "../../../components";
import {
  selectChatRooms,
  selectUserMeta,
  setChatRooms,
} from "../../../redux/slices/user";
import { height, width } from "../../../utills/Dimension";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import Modal from "react-native-modal";
import { Button, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
function ChatView({ route }) {
  const { t } = useTranslation();
  const database = getDatabase();
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState();
  const [roomID, setRoomID] = useState(route?.params.userRoom);
  const [items, setItems] = useState();
  const [selectedItem, setSelectedItem] = useState(route?.params.userItem);
  const [online, setOnline] = useState();
  const [image, setImage] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const usrData = route.params?.usr;
  const user = useSelector(selectUserMeta);
  const data = useSelector(selectChatRooms);
  let f = async () => {
    if (roomID) {
      const lastReadRef = ref(
        database,
        `chatrooms/${roomID}/lastRead/${user?._id}`
      );
      await set(lastReadRef, Date.now());
    }
  };
  useEffect(() => {
    f();
  }, []);
  useEffect(() => {
    myfuntion();
  }, [roomID]);
  useEffect(() => {
    if (!(route?.params?.userRoom == null)) {
      setRoomID(route?.params?.userRoom);
    } else {
      setRoomID(
        `${user?._id}_${route.params.usr?._id}_${route.params?.userItem._id}`
      );
    }
    setReceiver(route.params?.usr);
  }, []);
  useEffect(() => {
    const userStatusRef = ref(
      database,
      `users/${route.params.usr?._id}/online`
    );
    onValue(userStatusRef, (snapshot) => {
      const status = snapshot.val();
      setOnline(status);
    });
  }, [user?._id]);

  useEffect(() => {
    if (!selectedItem) {
      Alert.alert(t("flashmsg.alert"), t("flashmsg.Ad deleted"), [
        { text: "OK", onPress: () => {} },
      ]);
    }
  }, []);
  const myfuntion = async () => {
    if (roomID) {
      const messagesRef = ref(
        database,
        `chatrooms/${
          route?.params?.userRoom != null ? route?.params?.userRoom : roomID
        }/messages`
      );
      onValue(messagesRef, (snapshot) => {
        const messageData = snapshot.val();
        if (messageData) {
          // Convert the message data to an array and sort it in descending order
          const messageList = Object.values(messageData)
            .map((message) => {
              if (message.images) {
                return {
                  _id: message.timestamp, // Use a unique identifier for each message
                  image: message.images,
                  createdAt: new Date(message.timestamp),
                  user: {
                    _id: message.senderId, // Use the sender's user ID here
                  },
                };
              } else {
                return {
                  _id: message.timestamp, // Use a unique identifier for each message
                  text: message.text,
                  createdAt: new Date(message.timestamp),
                  user: {
                    _id: message.senderId, // Use the sender's user ID here
                  },
                };
              }
            })
            .reverse(); // Reverse the order to display the newest messages at the bottom
          setMessages(messageList);
        }
      });

      const lastReadRef = ref(
        database,
        `chatrooms/${roomID}/lastRead/${user?._id}`
      );
      await set(lastReadRef, Date.now());
    }
  };
  const renderBubble = (props) => {
    // Customize the style of the message bubble
    return (
      <Bubble
        key={props.index}
        {...props}
        wrapperStyle={{
          backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center",
          right: {
            backgroundColor: "#FAD0D0",
            marginVertical: width(1), // Change the background color for sent messages
          },
          left: {
            backgroundColor: "lightgray",
            marginVertical: width(1), // Change the background color for received messages
          },
        }}
      />
    );
  };
  const renderMessageText = (props) => {
    return (
      <MessageText
        {...props}
        textStyle={{
          right: {
            color: "black",
            // Change the text color for sent messages
          },
          left: {
            color: "black", // Change the text color for received messages
          },
        }}
      />
    );
  };
  const renderAvatar = (props) => {
    return (
      <View {...props}>
        <Image
          source={{ uri: receiver?.image }}
          style={{
            width: height(5),
            height: height(5),
            borderRadius: width(10),
          }}
        />
      </View>
    );
  };

  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeFormat="HH:mm"
        timeTextStyle={{
          right: {
            color: "black", // Change the text color for sent message times
          },
          left: {
            color: "black", // Change the text color for received message times
          },
        }}
      />
    );
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={{
        position: "absolute",
        right: height(7),
        ...Platform.select({
          ios: {
            bottom: height(0),
          },
          android: {
            bottom: height(0),
          },
        }),
        zIndex: 9999,
        width: height(4),
        height: height(4),
      }}
      onPressActionButton={() => {
        selectedItem && setImgModal(true);
      }}
      icon={() => (
        <Ionicons name="camera" size={height(4)} color={AppColors.primary} />
      )}
    />
  );

  const renderSend = (props) => (
    <Send
      disabled={!selectedItem}
      {...props}
      containerStyle={{ paddingRight: width(2) }}
    >
      <View style={{ marginRight: width(3), marginBottom: height(1.2),paddingLeft:height(7) }}>
        <Ionicons name="send" color={AppColors.primary} size={height(3)} />
      </View>
    </Send>
  );
  const renderMessageImage = (props) => {
    if (props.currentMessage.image) {
      return (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {props.currentMessage.image &&
            props.currentMessage.image.map((item, index) => {
              return (
                <View
                  style={{
                    width: width(47),
                    height: width(47),
                    borderRadius: width(2),
                    padding: width(1),
                  }}
                >
                  <Image
                    key={index}
                    source={{
                      uri: item,
                    }}
                    style={{
                      flex: 1,
                      borderRadius: width(2),
                      backgroundColor: "white",
                    }}
                    resizeMode="contain"
                  />
                </View>
              );
            })}
        </View>
      );
    }
    return null;
  };

  const openCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: .5,
      })
        .then((a) => {
          const selectedImages = a?.assets.map((imageUri) => {
            if (image?.length < 5) {
              return Platform.OS === "android"
                ? imageUri.uri
                : imageUri.uri.replace("file://", "");
            }
          });

          setImage([...image, ...selectedImages]);
          setImageModal(true);
        })
        .catch((e) => console.log("my log", e));
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const openGallery = async () => {
    setTimeout(async () => {
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: true,
        selectionLimit: 1,
        quality: .5,
      })
        .then((a) => {
          const selectedImages = a?.assets.map((imageUri) => {
            if (image?.length < 5) {
              return Platform.OS === "android"
                ? imageUri.uri
                : imageUri.uri.replace("file://", "");
            }
          });

          setImage([...image, ...selectedImages]);
          setImageModal(true);
        })
        .catch((e) => console.log("my log", e));
    }, 1000);
  };

  function openPicker(type = 0) {
    setImgModal(false);
    setTimeout(type == 0 ? openCamera : openGallery, 1000);
  }

  const setRooms = async (roomId, id) => {
    const dataRef = ref(database, `users/${id}`);
    lst = [`${roomId}`];
    await get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const roomsFromData = data.rooms;
          const newRooms = roomsFromData.filter((room) => !lst.includes(room));
          lst = lst.concat(newRooms);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error getting data:", error);
      });

    const userRef = ref(database, `users/${id}`);

    const updateData = {
      online: false,
      rooms: lst, // Update the 'rooms' field with the 'lst' object
    };

    set(userRef, updateData)
      .then(() => {
        dispatch(setChatRooms(roomID));

        console.log("Update successful");
      })
      .catch((error) => {
        console.error("Update failed", error);
      });
  };

  //Simple message acurate code

  const onSend = useCallback(async (messages = []) => {
    console.log("Sending");
    const newMessage = messages[0];

    if (user?._id == route.params.usr?._id) {
      //flash msg
    } else {
      if (
        (route.params?.userRoom == null ||
          route.params?.userRoom == undefined) &&
        roomID == null
      ) {
        let roomNew = `${user?._id}_${route.params.usr?._id}_${route.params?.userItem?._id}`;
        setRoomID(roomNew);
        const newMessageRef = push(
          ref(database, `chatrooms/${roomNew}/messages`)
        );

        set(newMessageRef, {
          text: newMessage.text,
          timestamp: Date.now(),
          senderId: user?._id, // Set the sender's user ID here
        });
        const lastReadRef = ref(
          database,
          `chatrooms/${roomNew}/lastRead/${user?._id}`
        );
        await set(lastReadRef, Date.now());

        // const lastRead = ref(
        //   database,
        //   `chatrooms/${roomNew}/lastRead/${route.params.usr?._id}`
        // );
        // await set(lastRead, Date.now());

        await setRooms(roomNew, route.params.usr?._id);
        await setRooms(roomNew, user?._id);
      } else {
        const newMessageRef = push(
          ref(database, `chatrooms/${roomID}/messages`)
        );

        set(newMessageRef, {
          text: newMessage.text,
          timestamp: Date.now(),
          senderId: user?._id, // Set the sender's user ID here
        });
        const lastReadRef = ref(
          database,
          `chatrooms/${roomID}/lastRead/${user?._id}`
        );
        await set(lastReadRef, Date.now());
        await setRooms(roomID, route.params.usr?._id);
        await setRooms(roomID, user?._id);
      }
    }
  });
  async function getBlobFromFile(imageUri) {
    return (await fetch(imageUri)).blob();
  }
  const saveImages = async () => {
    const imageUrls = [];
    if (
      (route.params?.userRoom == null || route.params?.userRoom == undefined) &&
      roomID == null
    ) {
      let roomNew = `${user?._id}_${route.params.usr?._id}_${route.params?.userItem?._id}`;
      setRoomID(roomNew);
    }
    const storage = getStorage();
    const newMessageRef = push(ref(database, `chatrooms/${roomID}/messages`));

    for (const imageUri of image) {
      const split = imageUri.split("/");
      const name = split.pop();
      const imageRef = storageRef(
        storage,
        `chatrooms/${roomID}/images/${name}`
      );

      const metadata = {
        contentType: "image/jpeg",
      };

      // // Get the blob from the image URI
      try {
        const imageBlob = await getBlobFromFile(imageUri);

        const uploadTask = await uploadBytes(
          imageRef,
          imageBlob,
          metadata
        ).catch((err) => {
          console.log("Error uploading images:", err);
        });
        const snapshot = await uploadTask;

        if (snapshot) {
          const downloadUrl = await getDownloadURL(imageRef);
          if (downloadUrl) {
            imageUrls.push(downloadUrl);
          }
        }
      } catch (error) {
        console.log("Error uploading images:", error);
      }
    }

    if (imageUrls.length > 0) {
      set(newMessageRef, {
        images: imageUrls,
        timestamp: Date.now(),
        senderId: user?._id,
      });
      await setRooms(roomID, route.params.usr?._id);
      await setRooms(roomID, user?._id);
    }

    setImageModal(false);
    setImage([]);
  };
  const handleBack = () => {
    navigation.goBack();
  };

  const closeModal = () => {
    setImageModal(false);
    setImage([]);
  };
  const renderDay = (props) => <Day {...props} dateFormat={"DD/MM/ YYYY"} />;
  return (
    <ScreenWrapper
      showStatusBar={false}
      statusBarColor={AppColors.white}
      barStyle="dark-content"
    >
      <View style={styles.container}>
        <View style={styles.account_View}>
          <TouchableOpacity style={styles.icon_Style} onPress={handleBack}>
            <MaterialIcons name="arrow-back-ios" size={height(3)} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{ uri: usrData?.image }}
              style={styles.image_Style}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.account_Text}>{usrData?.firstName}</Text>
            {/* {online ? (
              <View style={styles.online_View}>
                <View style={styles.online_Indicator}></View>
                <Text style={styles.online_Text}>Online</Text>
              </View>
            ) : (
              <View style={styles.online_View}>
                <View
                  style={{ ...styles.online_Indicator, backgroundColor: "red" }}
                ></View>
                <Text style={styles.online_Text}>Offline</Text>
              </View>
            )} */}
          </View>
        </View>
        {selectedItem && (
          <View>
            <AdView detail={selectedItem} />
          </View>
        )}

        <GiftedChat
          onSend={onSend}
          renderSend={renderSend}
          // messages={messages}
          messages={messages.map((message) => ({
            ...message,
            _id: message._id.toString(), // Ensure that _id is a string
          }))}
          placeholder={t("chat.placeholder")}
          user={{
            _id: user?._id,
          }}
          renderAvatar={renderAvatar}
          renderDay={renderDay}
          renderActions={renderActions}
          renderMessageImage={renderMessageImage}
          renderMessageText={renderMessageText}
          renderTime={renderTime}
          renderBubble={renderBubble}
          textInputProps={{ editable: selectedItem && usrData ? true : false }}
        />

        <View>
          <Modal
            visible={imageModal}
            animationIn="fadeInUpBig"
            animationInTiming={500}
            backdropColor="black"
            transparent={true}
            hasBackdrop={true}
          >
            <View style={styles.modalContainer}>
              {/* <Button title="Close" onPress={closeModal} /> */}
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  margin: width(5),
                  width: width(90),
                  alignItems: "flex-end",
                }}
              >
                <MaterialIcons name="close" size={height(4)} color="white" />
              </TouchableOpacity>
              {image &&
                image.map((img, index) => {
                  return (
                    <Image
                      key={index}
                      source={{
                        uri: img,
                        width: width(90),
                        height: height(70),
                        alignSelf: "center",
                      }}
                      resizeMode="contain"
                    />
                  );
                })}

              <Button
                containerStyle={{ marginTop: height(3) }}
                title="Send"
                onPress={saveImages}
              />
            </View>
          </Modal>
        </View>
        <DropDownMenu
          isVisible={imgModal}
          firstBtnText={t("addPost.takephoto")}
          secondBtnText={t("addPost.choosefromgallery")}
          onPressFirstBtn={() => {
            openPicker(0);
          }}
          onPressSecondBtn={() => {
            openPicker(1);
          }}
          onClose={() => setImgModal(false)}
        />
      </View>
    </ScreenWrapper>
  );
}

export default ChatView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: height(1),
  },
  account_View: {
    width: width(90),
    height: width(13),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: height(1),
    marginBottom: height(1),
  },
  icon_Style: {
    fontSize: 20,
    width: width(10),
    flexDirection: "row",
    alignItems: "center",
  },
  image_Style: {
    width: width(13),
    height: width(13),
    borderRadius: width(20),
    borderWidth: width(0.3),
    borderColor: AppColors.primary,
  },
  account_Text: {
    marginLeft: width(5),
    fontSize: 20,
    fontWeight: "600",
    color: AppColors.black,
  },
  online_View: {
    marginLeft: width(5),
    flexDirection: "row",
    alignItems: "center",
  },
  online_Text: {
    fontSize: 12,
    paddingLeft: 5,
  },
  online_Indicator: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "green",
  },
  item_View: {
    width: width(95),
    marginLeft: width(2),
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  ad_Btn: {
    width: width(20),
    height: height(4),
    backgroundColor: "#13E890",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  title_Text: {
    fontSize: 18,
    fontWeight: "600",
  },
  price_Text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#13E890",
  },

  modalContainer: {
    alignSelf: "center",
    width: width(100),
    height: height(100),
    backgroundColor: "black",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
