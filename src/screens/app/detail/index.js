import { AntDesign, Entypo, Fontisto, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal";
import Swiper from "react-native-swiper";
import { useDispatch, useSelector } from "react-redux";
import { adView, getDataofAdByID, toggleFavorite } from "../../../backend/api";
import {
  DetailFooter,
  DetailHeader,
  RelatedAd,
  ScreenWrapper,
} from "../../../components";
import {
  selectFavAds,
  selectIsLoggedIn,
  selectToken,
  selectUserMeta,
  setAdsFav,
} from "../../../redux/slices/user";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { WebLink } from "../../../utills/Constants";
import { height, width } from "../../../utills/Dimension";
import GlobalMethods, {
  checkPrice,
  formatPrice,
  formatPriceE,
  infoMessage,
  showDetails,
  isNullOrNullOrEmpty,
} from "../../../utills/Methods";
import styles from "./styles";
import { formatDistanceToNow } from "date-fns";
import { ApiManager } from "../../../backend/ApiManager";
export default function Detail({ navigation, route }) {
  const { t } = useTranslation();
  const dat = route?.params;
  const token = useSelector(selectToken);
  const loginuser = useSelector(selectUserMeta);
  const islogin = useSelector(selectIsLoggedIn);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [data, setDat] = useState(route?.params);
  const favAdIds = useSelector(selectFavAds);
  const [fav, setFav] = useState(false);
  const [img, setimg] = useState([]);
  const [load, setload] = useState(false);
  const [fload, setfload] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isInArray(data?.listing_id, favAdIds)) {
      setFav(true);
    } else {
      setFav(false);
    }
  });
  const handlePress = () => {
    // You can replace the URL with the link you want to open
    Linking.openURL(data?.videoUrl);
  };
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
      setfload(true);
      ApiManager.setAuthToken(token);
      let fav = await toggleFavorite(data?.listing_id);
      if (isInArray(data.listing_id, fav)) {
        setFav(true);
        setfload(false);
      } else {
        setFav(false);
        setfload(false);
      }
      dispatch(setAdsFav(fav));
    }
  };
  useEffect(() => {
    getData();
  }, [dat?.listing_id != data?.listing_id]);
  const getData = async () => {
    try {
      setload(true);

      let d = await getDataofAdByID(dat?.listing_id);
      // setload(false);
      console.log("here");
      // console.log("deydisndu",d);
      if (d) {
        // console.log(d?.images);
        setDat(d);
        setimg(d?.images);
        if (d.userId.listing_id != loginuser?.listing_id) {
          await adView(dat?.listing_id);
        }
      } else {
        // setDat({}), navigation.goBack();
      }
      setload(false);
    } catch (error) {
      setload(false);
    }

    // dispatch(setAppLoader(false));
  };
  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => (
        <DetailHeader
          catgory={data?.categories[0]}
          subcatgory={data?.subCategory}
          onPressBack={() => navigation.goBack()}
          onPressShare={() =>
            GlobalMethods.onPressShare(
              `${WebLink}${data?.listing_id}`,
              data?.title,
              data?.images[0].src
            )
          }
        />
      )}
      footerUnScrollable={() =>
        data &&
        islogin && (
          <DetailFooter
            pNumber={data?.author?.phone_verified && data?.author?.phone}
            eMail={data?.author?.email}
            onPressCall={() =>
              GlobalMethods.onPressCall(data?.userId?.phoneNumber)
            }
            onPressChat={() => {
              // navigation.navigate(ScreenNames.CHAT, {
              //   userRoom: null,
              //   usr: data?.userId,
              //   userItem: data,
              // });
            }}
            onPressMail={() =>
              GlobalMethods.onPressEmail(
                data?.userId?.email,
                loginuser?.email,
                data?.title + `${WebLink}${data?.listing_id}`
              )
            }
          />
        )
      }
      scrollEnabled
    >
      {/*------loder-------*/}
      {load ? (
        <View
          style={{
            alignContent: "center",
            alignSelf: "center",
            justifyContent: "center",
            height: height(60),
          }}
        >
          <ActivityIndicator size={"large"} color={AppColors.primary} />
        </View>
      ) : (
        <View style={styles.mainViewContainer}>
          {/*------Images-------*/}
          {img && (
            <View style={styles.imageview}>
              <Swiper
                style={{ height: height(30) }}
                activeDotColor={AppColors.primary}
                dotColor="white"
                automaticallyAdjustContentInsets={true}
              >
                {img?.map((image, index) => (
                  <Pressable
                    key={index}
                    style={{
                      width: width(100),
                      height: height(32),
                      // backgroundColor: AppColor.lightGrey,
                    }}
                    onPress={() => {
                      setShowModal(true);
                    }}
                  >
                    <Image
                      source={{ uri: image?.src }}
                      resizeMode="contain"
                      style={{
                        width: width(100),
                        height: height(32),
                        marginTop: height(1),
                        // alignSelf: "center",
                      }}
                      // style={{ flex: 1, resizeMode: "cover" }}
                    />
                  </Pressable>
                ))}
              </Swiper>
            </View>
          )}
          {/*------price-------*/}
          <View style={styles.nameview}>
            {!isNullOrNullOrEmpty(data?.price) && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {checkPrice(data?.price) && data?.price && (
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: height(2),
                        color: AppColors.primary,
                        fontWeight: "bold",
                      }}
                    >
                      PKR {formatPrice(data?.price)}
                    </Text>
                  </View>
                )}
                {/*------fav btn-------*/}
                {loginuser && (
                  <TouchableOpacity
                    style={{ marginHorizontal: width(3) }}
                    onPress={onpressfav}
                  >
                    {fload ? (
                      <ActivityIndicator color={AppColors.primary} />
                    ) : (
                      <AntDesign
                        size={height(2.5)}
                        color={fav ? AppColors.primary : "black"}
                        name={fav ? "star" : "staro"}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={{ width: width(70) }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: height(2.5),
                  color: AppColors.black,
                }}
              >
                {data?.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: width(80),
                  paddingVertical: width(2),
                  alignItems: "center",
                }}
              >
                <Entypo name="location-pin" color={"grey"} size={height(2)} />
                <Text style={{ fontSize: height(1.5) }}>
                  {data?.author?.address}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: height(1.5),
                  paddingHorizontal: height(1),
                  color: AppColors.black,
                }}
              >
                {new Date(data?.date_created?.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
          {/*---------detail view------*/}

          <View style={styles.detailview}>
            <View style={styles.detailcard}>
              <Text
                style={{
                  fontSize: height(2.5),
                  fontWeight: "bold",
                  paddingBottom: height(1),
                  color: AppColors.black,
                }}
              >
                {t("detail.detailword")}
              </Text>

              {/*--------Vehicle brand------*/}
              {data?.custom_fields?.map(
                (e) =>
                  e?.value && (
                    <View style={styles.cardrow}>
                      <Text style={styles.cardelement}>{e?.label}</Text>
                      <Text style={styles.cardelement2}>{e?.value}</Text>
                    </View>
                  )
              )}
            </View>
          </View>

          {/*---------description------*/}
          {!isNullOrNullOrEmpty(data?.description) && (
            <View style={{ paddingLeft: width(5), paddingVertical: width(3) }}>
              <Text style={{ fontWeight: "bold", fontSize: height(2.5) }}>
                {t("detail.description")}
              </Text>
              <Text
                selectable={true}
                style={{ fontSize: height(1.5), paddingVertical: width(2) }}
              >
                {data?.description}
              </Text>
            </View>
          )}
          {/* -------user profile-------- */}
          {data && (
            <Pressable
              onPress={() => {
                if (islogin) {
                  data?.store?.id &&
                    navigation.navigate(ScreenNames.DStoreDetailsScreen, {
                      storeId: data?.store?.id,
                    });
                } else {
                  infoMessage(
                    t(`flashmsg.loginView`),
                    t(`flashmsg.authentication`)
                  );
                }
              }}
              style={styles.profileview}
            >
              <View style={styles.profilecard}>
                <Image
                  source={{ uri: data?.author?.pp_thumb_url }}
                  style={styles.profileimage}
                  resizeMode="cover"
                />
                <View style={styles.profilecardin}>
                  <Text
                    style={{
                      marginHorizontal: width(2),
                      fontSize: height(2),
                      fontWeight: "bold",
                      width: width(50),
                      color: AppColors.black,
                    }}
                  >
                    {data?.author?.username}
                  </Text>
                  <Text
                    style={{
                      marginHorizontal: width(2),
                      fontSize: height(1.3),
                      color: AppColors.black,
                    }}
                  >
                    Member since{"  "}
                    {new Date(data?.userId?.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      // hour: "numeric",
                      // minute: "numeric",
                      // second: "numeric",
                    })}
                  </Text>
                </View>

                {/* <IconButton
                textStyle={{fontSize: width(2.5),}}
                  title={"detail.seeAllAds"}
                 
                /> */}
                <Entypo name="chevron-right" size={height(4)} />
              </View>
            </Pressable>
          )}
          {/*------whatsapp -------*/}
          {data?.contact && (
            <View style={styles.contact}>
              {!isNullOrNullOrEmpty(data?.contact?.whatsapp_number) && (
                <TouchableOpacity
                  style={{ marginRight: height(2) }}
                  onPress={() =>
                    GlobalMethods.openWhatsApp(data?.contact?.whatsapp_number)
                  }
                >
                  <Ionicons
                    size={height(5)}
                    name="logo-whatsapp"
                    color={"#41C053"}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          {/*------address-------*/}
          {!isNullOrNullOrEmpty(data?.contact?.address) && (
            <View style={{ paddingLeft: width(4) }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: height(2.5),
                  marginVertical: width(2),
                }}
              >
                {t("detail.location")}
              </Text>
            </View>
          )}
          {/*------Map view-------*/}
          {!isNullOrNullOrEmpty(data?.contact?.address) && (
            <View style={styles.map}>
              <MapView
                ref={mapRef}
                initialRegion={{
                  latitude: data?.latitude || 0,
                  longitude: data?.longitude || 0,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: width(3),
                }}
              >
                <Marker
                  coordinate={{
                    latitude: data?.contact?.latitude || 0,
                    longitude: data?.contact?.longitude || 0,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                />
              </MapView>
            </View>
          )}
          <RelatedAd data={data?.related} />
        </View>
      )}
      {/*------model of pictures-------*/}
      <Modal
        isVisible={showModal}
        statusBarTranslucent={true}
        style={{
          width: width(100),
          alignSelf: "center",
        }}
        hasBackdrop={true}
        backdropColor="black"
        backgroundColor={"black"}
        backdropOpacity={1}
        animationInTiming={300}
        animationOutTiming={200}
        animationIn={"lightSpeedIn"}
        animationOut={"lightSpeedOut"}
        onBackButtonPress={() => {
          setShowModal(false);
        }}
        onBackdropPress={() => {
          setShowModal(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              setShowModal(false);
            }}
            style={{
              marginTop: width(10),
              alignSelf: "flex-end",
              backgroundColor: "rgba(0, 0, 0,.6)",
            }}
          >
            <Ionicons name="close" size={height(5)} color={AppColors.white} />
          </TouchableOpacity>
          <Swiper
            // showsButtons={true}
            // nextButton={
            //   <View
            //     style={{
            //       backgroundColor: "rgba(0, 0, 0,.2)",
            //       padding: width(1),
            //     }}
            //   >
            //     <AntDesign
            //       name="caretright"
            //       size={height(3)}
            //       color={AppColors.white}
            //     />
            //   </View>
            // }
            // prevButton={
            //   <View
            //     style={{
            //       backgroundColor: "rgba(0, 0, 0,.2)",
            //       padding: width(1),
            //     }}
            //   >
            //     <AntDesign
            //       name="caretleft"
            //       size={height(3)}
            //       color={AppColors.white}
            //     />
            //   </View>
            // }
            activeDotColor={AppColors.primary}
            dotColor="white"
            automaticallyAdjustContentInsets={true}
          >
            {img.map((image, index) => (
              <Pressable key={index} style={styles.modelView}>
                <Image
                  source={{ uri: image?.src }}
                  resizeMode="contain"
                  style={styles.modelImage}
                />
              </Pressable>
            ))}
          </Swiper>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
