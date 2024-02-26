import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFavAds,
  selectUserMeta,
  setAdsFav,
} from "../../redux/slices/user";
import ScreenNames from "../../routes/routes";
import AppColors from "../../utills/AppColors";
import { width } from "../../utills/Dimension";
import GlobalMethods, {
  checkPrice,
  formatPrice,
  formatPriceE,
  infoMessage,
  isNullOrNullOrEmpty,
} from "../../utills/Methods";
import styles from "./styles";
import { toggleFavorite } from "../../backend/api";
import { WebLink } from "../../utills/Constants";
import { selectCurrentLanguage } from "../../redux/slices/language";
import { useTranslation } from "react-i18next";
export default function ListingView({ data }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const language = useSelector(selectCurrentLanguage);
  const favAdIds = useSelector(selectFavAds);
  const loginuser = useSelector(selectUserMeta);
  const navigation = useNavigation();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (isInArray(data._id, favAdIds)) {
      setFav(true);
    } else {
      setFav(false);
    }
  });

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
      let fav = await toggleFavorite(data._id, loginuser._id);
      if (isInArray(data._id, fav)) {
        setFav(true);
      } else {
        setFav(false);
      }
      dispatch(setAdsFav(fav));
    }
  };
  return (
    <View style={styles.main}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate(ScreenNames.DETAIL, data);
        }}
      >
        <View style={styles.imageview}>
          <Image style={styles.image} source={{ uri: data?.images[0] }} />
        </View>
        <View style={styles.detail}>
          {!isNullOrNullOrEmpty(data?.price) && (
            <View style={styles.detailinerview}>
              {checkPrice(data?.price) ? (
                <View>
                  <Text numberOfLines={1} style={styles.chf}>
                    CHF {formatPrice(data?.price)}
                  </Text>
                  <Text numberOfLines={1} style={styles.eur}>
                    EUR {formatPriceE(Math.round(data?.price * 1.06))}
                  </Text>
                </View>
              ) : (
                <View style={styles.cfpview}>
                  <Text numberOfLines={1} style={styles.cfp}>
                    {t(`addPost.${data?.price}`)}
                  </Text>
                </View>
              )}
              {!(data?.userId?._id === loginuser?._id) ? (
                <View>
                  <TouchableOpacity onPress={onpressfav}>
                    <AntDesign
                      size={width(4)}
                      color={fav ? AppColors.primary : "black"}
                      name={fav ? "heart" : "hearto"}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
            </View>
          )}
          <View>
            <Text numberOfLines={1} style={styles.titletext}>
              {data?.title}
            </Text>
            <View style={styles.categoryview}>
              <MaterialIcons name="category" color={"grey"} size={width(4)} />
              <Text numberOfLines={1} style={styles.categorytext}>
                {data?.category}
              </Text>
            </View>
            <View style={styles.categoryview}>
              <Entypo name="location-pin" color={"grey"} size={width(4)} />
              <Text numberOfLines={2} style={styles.categorytext}>
                {data?.address}
              </Text>
            </View>
            <View style={styles.categoryview}>
              <AntDesign name="clockcircleo" color={"grey"} size={width(3.5)} />
              <Text numberOfLines={1} style={styles.categorytext}>
                {GlobalMethods.calculateTimeDifference(
                  data?.createdAt,
                  language
                )}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {!(data?.userId === loginuser?._id) ? (
        <View style={styles.icons}>
          <TouchableOpacity
            disabled={data?.phone ? false : true}
            onPress={() => GlobalMethods.onPressCall(data?.userId?.phoneNumber)}
          >
            <Ionicons
              size={width(4)}
              name="call"
              color={data?.phone ? "grey" : "lightgrey"}
            />
          </TouchableOpacity>
          <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate(ScreenNames.CHAT, data);
          // }}
          >
            <Ionicons size={width(4)} name="chatbubble-ellipses" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              GlobalMethods.onPressShare(
                `${WebLink}${data?._id}`,
                data?.title,
                data?.images[0]
              )
            }
          >
            <Entypo size={width(4)} name="share" />
          </TouchableOpacity>
          <AntDesign size={width(4)} name="eye" color={"grey"} />
          <Text style={{ fontSize: width(2) }}>{data?.views}</Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
