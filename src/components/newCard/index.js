import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Swiper from "react-native-swiper";
import { Pressable, Text, TouchableOpacity, View, Image } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../backend/api";
import { selectCurrentLanguage } from "../../redux/slices/language";
import {
  selectFavAds,
  selectUserMeta,
  setAdsFav,
} from "../../redux/slices/user";
import ScreenNames from "../../routes/routes";
import AppColors from "../../utills/AppColors";
import { WebLink } from "../../utills/Constants";
import { height, width } from "../../utills/Dimension";
import GlobalMethods, {
  checkPrice,
  formatPrice,
  formatPriceE,
  infoMessage,
  shouldRenderField,
} from "../../utills/Methods";
import styles from "./styles";
import { isNullOrNullOrEmpty } from "../../utills/Methods";
const Card = React.memo(({ data, onPresshide, map = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector(selectCurrentLanguage);
  const favAdIds = useSelector(selectFavAds);
  const loginuser = useSelector(selectUserMeta);
  const navigation = useNavigation();
  const [fav, setFav] = useState(false);
  const [img, setimg] = useState(data?.images || []);
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (isInArray(data.listing_id, favAdIds)) {
      setFav(true);
    } else {
      setFav(false);
    }
  });
  useEffect(() => {
    setimg(data?.images);
  }, [data]);

  function isInArray(element, arr) {
    // Check if arr is defined and not null
    if (arr && Array.isArray(arr)) {
      return arr.includes(element);
    }
    return false; // Return false if arr is not defined or not an array
  }
  const onpressfav = async () => {
    if (!loginuser) {
      infoMessage(t(`flashmsg.loginfavorite`), t(`flashmsg.authentication`));
    } else {
      let fav = await toggleFavorite(data.listing_id, loginuser._id);
      if (isInArray(data.listing_id, fav)) {
        setFav(true);
      } else {
        setFav(false);
      }
      dispatch(setAdsFav(fav));
    }
  };

  return (
    <View style={styles.main}>
      <View style={{ borderBottomWidth: width(0.1) }}>
        <Pressable
          style={styles.detail}
          onPress={() => {
            map && onPresshide();
            navigation.navigate(ScreenNames.DETAIL, data);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: width(90),
            }}
          >
            <View style={{ width: width(65) }}>
              <Text numberOfLines={1} style={styles.titletext}>
                {data?.title}
              </Text>
              <View style={styles.categoryview}>
                <MaterialIcons
                  name="category"
                  color={"grey"}
                  size={height(2)}
                />
                <Text numberOfLines={1} style={styles.categorytext}>
                
                  {/* {t(`category.${data?.category}`)} */}
                  {`category`}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: width(20),
                justifyContent: "space-between",
                padding: width(2),
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  GlobalMethods.onPressShare(
                    `${WebLink}${data?._id}`,
                    data?.title,
                    data?.images[0]
                  )
                }
              >
                <Entypo size={height(2.5)} name="share" color={"grey"} />
              </TouchableOpacity>
              {!(data?.userId?._id === loginuser?._id) ? (
                <View>
                  <TouchableOpacity onPress={onpressfav}>
                    <AntDesign
                      size={height(2.5)}
                      color={fav ? AppColors.primary : "grey"}
                      name={fav ? "heart" : "hearto"}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
            </View>
          </View>
        </Pressable>
        <View style={styles.imageview}>
          {/* <Swiper
            style={{ height: height(25) }}
            activeDotColor={AppColors.primary}
            dotColor="white"
            automaticallyAdjustContentInsets={true}
            showsPagination={false}
          >
            {img.map((image, index) => (*/}

          <TouchableOpacity
            style={{
              height: height(3),
              width: height(6),
              backgroundColor: "rgba(255,255,255,.8)",
              position: "absolute",
              zIndex: 1,
              top: height(2),
              right: height(0.5),
              borderRadius: height(1),
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => {
              setModal(true);
            }}
          >
            <Ionicons size={height(2.2)} name="image" color={"grey"} />
            <Text
              style={{
                fontSize: height(1.8),
                color: AppColors.black,
                paddingLeft: height(0.5),
                color: "grey",
                fontWeight: "bold",
              }}
            >
              {img?.length}
            </Text>
          </TouchableOpacity>
          <Pressable
            style={{
              width: width(90),
              height: height(22),
              borderRadius: height(2),
            }}
            onPress={() => {
              map && onPresshide();
              navigation.navigate(ScreenNames.DETAIL, data);
            }}
          >
            <Image
              source={{ uri: data?.images[0]?.src }}
              resizeMode="cover"
              style={{
                width: width(90),
                height: height(22),
                marginTop: height(1),
                borderRadius: height(2),
              }}
            />
          </Pressable>
          {/*    ))}
          </Swiper> */}
        </View>
        <Pressable
          style={styles.detail}
          onPress={() => {
            map && onPresshide();
            navigation.navigate(ScreenNames.DETAIL, data);
          }}
        >
          {!isNullOrNullOrEmpty(data?.raw_price) && (
            <View style={styles.detailinerview}>
              {checkPrice(data?.raw_price) ? (
                <View>
                  <Text numberOfLines={1} style={styles.chf}>
                    PKR {formatPrice(data?.raw_price)}
                  </Text>
                  <Text numberOfLines={1} style={styles.eur}>
                    EUR {formatPriceE(Math.round(data?.raw_price * 1.06))}
                  </Text>
                </View>
              ) : (
                <View style={styles.cfpview}>
                  <Text numberOfLines={1} style={styles.cfp}>
                    {t(`addPost.${data?.raw_price}`)}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              width: width(87),
            }}
          >
            <View style={styles.categoryview}>
              <AntDesign
                name="clockcircleo"
                color={"grey"}
                size={height(1.6)}
              />
              <Text numberOfLines={1} style={styles.categorytext}>
                {GlobalMethods.calculateTimeDifference(
                  data?.date_created.date,
                  language
                )}
              </Text>
            </View>
            <AntDesign name="eye" color={"grey"} size={height(1.5)}>
              {" "}
              {data?.view_count}
            </AntDesign>
            {/* <Text style={{ fontSize: width(3), color: "grey" }}>
            
              {"  Views"}
            </Text> */}
          </View>
        </Pressable>
      </View>

      <View style={styles.icons}>
        <View style={styles.categoryview}>
          <Entypo name="location-pin" color={"grey"} size={height(2)} />
          <Text numberOfLines={2} style={styles.categorytext}>
            {data?.contact.address}
          </Text>
        </View>
        {!(data?.userId?._id === loginuser?._id) ? (
          <View
            style={{
              flexDirection: "row",
              width: width(20),
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              disabled={data?.contact.phone ? false : true}
              onPress={() => {
                if (!loginuser) {
                  infoMessage(
                    t(`flashmsg.loginfavorite`),
                    t(`flashmsg.authentication`)
                  );
                } else {
                  GlobalMethods.onPressCall(data?.userId?.phoneNumber);
                }
              }}
            >
              <Ionicons
                size={height(2.5)}
                name="call"
                color={data?.contact.phone ? "grey" : "lightgrey"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!loginuser) {
                  infoMessage(
                    t(`flashmsg.loginfavorite`),
                    t(`flashmsg.authentication`)
                  );
                } else {
                  map && onPresshide();
                  navigation.navigate(ScreenNames.CHAT, {
                    userRoom: null,
                    usr: data?.author_id,
                    userItem: data,
                  });
                }
              }}
            >
              <Entypo size={height(2.5)} name="chat" color={"grey"} />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </View>
      <Modal
        backdropOpacity={0.5}
        isVisible={modal}
        onBackdropPress={() => {
          setModal(false);
        }}
        onBackButtonPress={() => {
          setModal(false);
        }}
      >
        <View
          style={{
            height: height(38),
            backgroundColor: AppColors.white,
            alignSelf: "center",
            borderRadius: width(3),
            marginBottom: height(1),
            alignSelf: "center",
            width: width(96),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Swiper
            style={{ alignSelf: "center" }}
            activeDotColor={AppColors.primary}
            dotColor="lightgrey"
            automaticallyAdjustContentInsets={true}
          >
            {data?.images.map((image, index) => (
              <Pressable
                key={index}
                style={{
                  width: width(96),
                  justifyContent: "center",
                  height: height(38),
                }}
              >
                <Image
                  source={{ uri: image?.src }}
                  resizeMode="contain"
                  style={{
                    width: width(96),
                    height: height(32),
                    // alignSelf: "center",
                  }}
                  // style={{ flex: 1, resizeMode: "cover" }}
                />
              </Pressable>
            ))}
          </Swiper>
        </View>
      </Modal>
    </View>
  );
});
export default Card;
