import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
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
import { height, width } from "../../utills/Dimension";
import GlobalMethods, {
  checkPrice,
  formatPrice,
  formatPriceE,
  infoMessage,
} from "../../utills/Methods";
import styles from "./styles";
export default function CardView({ data }) {
  const { t } = useTranslation();
  const [slideNo, setSlideNo] = useState(0);
  const introRef = useRef(null);
  const language = useSelector(selectCurrentLanguage);
  const dispatch = useDispatch();
  const favAdIds = useSelector(selectFavAds);
  function isInArray(element, arr) {
    // Check if arr is defined and not null
    if (arr && Array.isArray(arr)) {
      return arr.includes(element);
    }
    return false; // Return false if arr is not defined or not an array
  }
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

  const onpressfav = async () => {
    if (!loginuser) {
      infoMessage(t(`flashmsg.loginfavorite`), t(`flashmsg.authentication`));
    } else {
      let fav = await toggleFavorite(data._id, loginuser._id);
      dispatch(setAdsFav(fav));
      if (isInArray(data._id, fav)) {
        setFav(true);
      } else {
        setFav(false);
      }
    }
  };
  return (
    <View style={styles.main}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate(ScreenNames.DETAIL, data);
        }}
        style={{ flexDirection: "row" }}
      >
        <View style={styles.imageview}>
          <Image
            resizeMode="cover"
            style={styles.image}
            // source={{ uri: data?.image[0] }}
            source={{ uri: data?.images[0] }}
          />
          {/* <SwiperFlatList
            // ref={introRef}
            // autoplay
            // autoplayDelay={1}
            // autoplayLoop={true}
            data={data?.images}
            renderItem={renderItem}
          /> */}
        </View>
        <View style={styles.detail}>
          <View>
            <Text numberOfLines={1} style={styles.titletext}>
              {data?.title}
            </Text>
            <View style={styles.categoryview}>
              <MaterialIcons name="category" color={"grey"} size={height(2)} />
              <Text numberOfLines={1} style={styles.detailtext}>
                {t(`category.${data?.category}`)}
              </Text>
            </View>
            <View style={styles.categoryview}>
              <Entypo name="location-pin" color={"grey"} size={height(2)} />
              <Text numberOfLines={2} style={styles.detailtext}>
                {data?.address}
              </Text>
            </View>
            <View style={styles.categoryview}>
              <AntDesign
                name="clockcircleo"
                color={"grey"}
                size={height(1.6)}
              />
              <Text numberOfLines={1} style={styles.detailtext}>
                {GlobalMethods.calculateTimeDifference(
                  data?.createdAt,
                  language
                )}
              </Text>
            </View>
          </View>
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
        </View>
      </TouchableOpacity>
      {!(data?.userId?._id === loginuser?._id) ? (
        <View style={styles.icons}>
          <TouchableOpacity onPress={onpressfav} style={styles.space}>
            <AntDesign
              size={height(2)}
              color={fav ? AppColors.primary : "black"}
              name={fav ? "heart" : "hearto"}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
       {!data?.visibility && (
        <View
          style={{
            height: height(20),
            borderRadius: width(2),
            width: width(86),
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            position: "absolute",
          }}
        />
      )}
    </View>
  );
}
