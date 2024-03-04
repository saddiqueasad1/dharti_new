import React, { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  Alert,
} from "react-native";

import AppColors from "../../../utills/AppColors";
import styles from "./styles";
import { ApiManager } from "../../../backend/ApiManager";

// Vector Icons
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Zocial } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Custom Components & Functions
import { decodeString, getPrice } from "../../../utills/helper";
import { useStateValue } from "../../../redux/slices/appConfig";
// import AppButton from "../components/AppButton";
// import AppTextButton from "../components/AppTextButton";
// import { getRelativeTimeConfig, getWeek, __ } from "../language/stringPicker";
import ScreenNames from "../../../routes/routes";

import CallIcon from "../../../asset/svgComponents/CallIcon";
import MessageIcon from "../../../asset/svgComponents/MessageIcon";
import GlobeIcon from "../../../asset/svgComponents/GlobeIcon";
// import ReadMore from "react-native-read-more-text";
import { useTranslation } from "react-i18next";
import { selectUserMeta } from "../../../redux/slices/user";
import { useSelector } from "react-redux";

const storeDetailsTexts = {
  membershipMomentFormate: "D MMM, YYYY",
};

export const paginationData = {
  home: { per_page: 30 },
  search: { page: 1, per_page: 30 },
  myListings: { page: 1, per_page: 30 },
  favourites: { page: 1, per_page: 30 },
  allStores: { page: 1, per_page: 30 },
  storeDetails: { page: 1, per_page: 30 },
  paymentHistory: { page: 1, per_page: 30 },
  rating: { page: 1, per_page: 10 },
};

const { width: windowWidth } = Dimensions.get("window");

const storeDetailfallbackImage = {
  listingCardImage: require("../../../asset/images/100x100.png"),
  logo: require("../../../asset/images/100x100.png"),
  banner: require("../../../asset/images/200X150.png"),
};

const weekData = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};
const week = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const StoreDetailsScreen = ({ route, navigation }) => {
  const { t } = useTranslation();

  const user = useSelector(selectUserMeta);
  const config = useSelector(selectUserMeta);

  const ios = false;
  const rtl_support = false;
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState();
  const [storeExpired, setStoreExpired] = useState(false);
  const [storeId, setStoreId] = useState(route.params.storeId);

  const [initial, setInitial] = useState(true);
  const [storeListingSData, setStoreListingsData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [weekDays, setWeekDays] = useState({});

  const [currentPage, setCurrentPage] = useState(
    pagination.page || paginationData.storeDetails.page
  );

  const [isExpanded, setIsExpanded] = useState(true);
  const MAX_LENGTH = 100; // Maximum number of characters you want to show by default

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getTrimmedText = (text) => {
    if (text.length <= MAX_LENGTH) {
      return text;
    }
    return isExpanded ? text : text.substring(0, MAX_LENGTH) + "...";
  };
  // {* Get Store Detail Call *}
  useEffect(() => {
    // const timeConfig = getRelativeTimeConfig(appSettings.lng);
    // moment.updateLocale("en-gb", {
    //   relativeTime: timeConfig,
    // });
    if (storeData) return;
    getStoreDetail(route.params.storeId);
  }, []);

  // {* Get Store Listings Call *}
  useEffect(() => {
    if (!initial && loading) return;
    getStoreListings(storeId, paginationData.storeDetails);
  }, [loading]);

  // {* Refreshing get listing call *}
  useEffect(() => {
    if (!refreshing) return;
    setCurrentPage(1);
    setPagination({});
    getStoreListings(storeId, paginationData.storeDetails);
  }, [refreshing]);

  // {* Next page get listing call *}
  useEffect(() => {
    if (!moreLoading) return;
    const tempPaginationData = {
      per_page: paginationData.storeDetails.per_page,
      page: currentPage,
    };
    getStoreListings(storeId, tempPaginationData);
  }, [moreLoading]);

  const getStoreDetail = (storeId) => {
    try {
      ApiManager.get(`stores/${storeId}`).then((res) => {
        if (res) {
          if (res) {
            setStoreData(res);
            setLoading(false);
          } else {
            setStoreExpired(true);
            setLoading(false);
          }
        } else {
          // print error
          // TODO handle error
          setLoading(false);
        }
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = (originalDate) => {
    const formattedDate = new Date(originalDate).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

  const getStoreListings = (storeId, paginationData) => {
    console.log("()=> getStoreListings");
    const args = { ...paginationData, store_id: storeId };
    try {
      ApiManager.get("store/listings", { ...args }).then((res) => {
        if (res.data) {
          if (refreshing) {
            setRefreshing(false);
          }
          if (moreLoading) {
            setStoreListingsData((prevStoreListingsData) => [
              ...prevStoreListingsData,
              ...res.data,
            ]);
            setCurrentPage(res.pagination.page);
            setMoreLoading(false);
          } else {
            setStoreListingsData(res.data);
          }
          setPagination(res.pagination ? res.pagination : {});

          if (initial) {
            setInitial(false);
          }
          if (loading) {
            setLoading(false);
          }
        } else {
          // print error
          // TODO handle error
          // if error give retry button and set initial to true only for initial call
          if (refreshing) {
            setRefreshing(false);
          }
          if (moreLoading) {
            setMoreLoading(false);
          }
          if (loading) {
            setLoading(false);
          }
          if (initial) {
            setInitial(false);
          }
        }
      });
    } catch (error) {
    } finally {
    }
  };

  const handleEmail = () => {
    if (user === null && config?.registered_only?.store_contact) {
      handleEmailLoginAlert();
    } else {
      const data = {
        id: storeData.id,
        title: storeData.title,
      };
      navigation.navigate(ScreenNames.sendEmailScreen, {
        store: data,
        source: "store",
      });
    }
  };

  const handleEmailLoginAlert = () => {
    Alert.alert(
      "",
      t("storeDetailsTexts.loginAlert"),
      [
        {
          text: t("storeDetailsTexts.cancelButtonTitle"),
        },
        {
          text: t("storeDetailsTexts.loginButtonTitle"),
          onPress: () => navigation.navigate(ScreenNames.loginScreen),
        },
      ],
      { cancelable: false }
    );
  };

  const renderListItem = useCallback(
    ({ item }) => <StoreListingCard item={item} />,
    []
  );
  const StoreListingCard = ({ item }) => (
    <View
      style={{
        backgroundColor: AppColors.white,
        padding: "3%",
        marginHorizontal: "3%",
        borderRadius: 5,
        elevation: 1,
        shadowColor: AppColors.border_light,
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
          height: 2,
          width: 2,
        },
      }}
    >
      <TouchableOpacity
        style={[styles.storeListingCardContent, rtlView]}
        onPress={() => handleViewListing(item)}
      >
        <View style={styles.listingCardImageWrap}>
          <Image
            source={
              !!item.images.length
                ? { uri: item.images[0].sizes.thumbnail.src }
                : storeDetailfallbackImage.listingCardImage
            }
            style={styles.listingCardImage}
          />
        </View>
        <View
          style={[
            styles.listingCardDetailWrap,
            {
              paddingLeft: rtl_support ? 0 : 10,
              paddingRight: rtl_support ? 10 : 0,
            },
          ]}
        >
          <View style={styles.listingCardDetailContent}>
            <View
              style={[
                styles.listingCardDetailLeft,
                { alignItems: rtl_support ? "flex-end" : "flex-start" },
              ]}
            >
              <View
                style={{ alignItems: rtl_support ? "flex-end" : "flex-start" }}
              >
                <Text
                  style={[styles.listingCardTitle, rtlText]}
                  numberOfLines={1}
                >
                  {decodeString(item.title)}
                </Text>
                <View
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: ios ? 3 : 2,
                    },
                    rtlView,
                  ]}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        paddingRight: rtl_support ? 0 : 5,
                        paddingLeft: rtl_support ? 5 : 0,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="clock"
                      size={12}
                      color={AppColors.text_gray}
                    />
                  </View>
                  <Text style={[styles.listingCardText, rtlText]}>
                    {formattedDate(item.created_at)}
                  </Text>
                </View>
                <View
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: ios ? 3 : 2,
                    },
                    rtlView,
                  ]}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        paddingRight: rtl_support ? 0 : 5,
                        paddingLeft: rtl_support ? 5 : 0,
                      },
                    ]}
                  >
                    <FontAwesome5
                      name="eye"
                      size={12}
                      color={AppColors.text_gray}
                    />
                  </View>
                  <Text style={[styles.listingCardText, rtlText]}>
                    {t("storeDetailsTexts.viewsCount")} {item?.view_count}
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.listingCardPrice, rtlText]}
                numberOfLines={1}
              >
                {getPrice(
                  "pak",
                  {
                    pricing_type: item.pricing_type,
                    price_type: item.price_type,
                    price: item.price,
                    max_price: item.max_price,
                  },
                  "en"
                )}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const handleViewListing = (listing) => {
    navigation.navigate(ScreenNames.DETAIL, listing);
  };

  const ListSeparator = () => (
    <View
      style={{
        height: 1,
        width: "94%",
        backgroundColor: AppColors.bg_dark,
        marginVertical: 5,
        marginHorizontal: "3%",
      }}
    ></View>
  );

  const getOpenHours = () => {
    if (storeData) {
      if (storeData?.opening_hours?.type === "always") {
        return "storeDetailsTexts.alwaysOpen";
      }
      if (storeData?.opening_hours?.type === "selected") {
        const today = weekData[new Date().getDay()];

        if (storeData?.opening_hours?.hours[today]?.active) {
          if (
            storeData?.opening_hours?.hours[today]?.open ||
            storeData?.opening_hours?.hours[today]?.close
          ) {
            return "storeDetailsTexts.openingHourOpen";
          } else {
            return "storeDetailsTexts.fullDayOpen";
          }
        } else {
          return "storeDetailsTexts.closed";
        }
      }
    }
    return null;
  };

  const keyExtractor = useCallback((item, index) => `${index}`, []);

  const handleMoreDetailPress = () => {
    navigation.navigate(ScreenNames.storeMoreDetailsScreen, {
      data: storeData,
    });
  };

  const habdleSocialLinkOpen = (url) => {
    Linking.openURL(url);
  };

  const renderTruncatedFooter = (handleDescriptionToggle) => {
    return (
      <Text
        style={{
          color: AppColors.text_gray,
          marginTop: 10,
          fontWeight: "bold",
          textAlign: "center",
        }}
        onPress={handleDescriptionToggle}
      >
        {t("listingDetailScreenTexts.showMore")}
      </Text>
    );
  };
  const renderRevealedFooter = (handleDescriptionToggle) => {
    return (
      <Text
        style={{
          color: AppColors.text_gray,
          marginTop: 10,
          fontWeight: "bold",
          textAlign: "center",
        }}
        onPress={handleDescriptionToggle}
      >
        {t("listingDetailScreenTexts.showLess")}
      </Text>
    );
  };

  const getOpeningHours = () => {
    const data = storeData.opening_hours.hours;
    if (storeData.opening_hours.type === "selected") {
      return week.map((item, index) => (
        <OpeningDay
          item={item}
          key={index}
          data={data}
          today={week[new Date().getDay()] === item}
          index={index}
        />
      ));
    } else {
      return (
        <View
          style={{ width: "100%", alignItems: "center", paddingVertical: 5 }}
        >
          <Text
            style={[
              { fontWeight: "bold", color: AppColors.text_dark },
              rtlTextA,
            ]}
          >
            {t("storeDetailsTexts.alwaysOpen")}
          </Text>
        </View>
      );
    }
  };

  const OpeningDay = ({ item, data, today, index }) => (
    <View style={[styles.dayWrap, rtlView]}>
      <View
        style={[
          styles.dayContentWrap,
          {
            paddingLeft: rtl_support ? 0 : 18,
            paddingRight: rtl_support ? 18 : 0,
            alignItems: rtl_support ? "flex-end" : "flex-start",
          },
        ]}
      >
        <Text
          style={[
            styles.dayTitle,
            {
              fontWeight: today ? "bold" : "normal",
              color: today ? AppColors.text_dark : AppColors.text_gray,
            },
            rtlText,
          ]}
          numberOfLines={1}
        >
          {weekDays[index]}
        </Text>
      </View>
      <View style={styles.dayContentWrap}>
        {data[item]?.active ? (
          <>
            {!!data[item]?.open && !!data[item]?.close ? (
              <>
                {rtl_support ? (
                  <Text
                    style={[
                      styles.hoursText,
                      {
                        fontWeight: today ? "bold" : "normal",
                        color: today
                          ? AppColors.text_dark
                          : AppColors.text_gray,
                      },
                      rtlTextA,
                    ]}
                  >
                    {data[item].close}
                    {" - "}
                    {data[item].open}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.hoursText,
                      {
                        fontWeight: today ? "bold" : "normal",
                        color: today
                          ? AppColors.text_dark
                          : AppColors.text_gray,
                      },
                    ]}
                  >
                    {data[item].open}
                    {" - "}
                    {data[item].close}
                  </Text>
                )}
              </>
            ) : (
              <Text
                style={[
                  styles.hoursText,
                  {
                    fontWeight: today ? "bold" : "normal",
                    color: today ? AppColors.text_dark : AppColors.text_gray,
                  },
                  rtlTextA,
                ]}
              >
                {t("storeMoreDetailTexts.fullDayOpen")}
              </Text>
            )}
          </>
        ) : (
          <Text
            style={[
              styles.closedText,
              {
                fontWeight: today ? "bold" : "normal",
              },
              rtlTextA,
            ]}
          >
            {t("storeMoreDetailTexts.closed")}
          </Text>
        )}
      </View>
    </View>
  );

  const ListHeader = useCallback(
    () => (
      <View style={[styles.storeTop]}>
        {/* Store Detail */}
        <View style={[styles.storeDetailWrap, { paddingBottom: 10 }]}>
          {/* Store Banner */}
          <View style={styles.bannerWrap}>
            <Image
              source={
                !!storeData.banner
                  ? { uri: storeData.banner }
                  : storeDetailfallbackImage.banner
              }
              style={styles.banner}
            />
          </View>

          <View style={{ width: "100%", height: windowWidth * 0.94 * 0.15 }}>
            <View
              style={{
                height: windowWidth * 0.94 * 0.24,
                width: windowWidth * 0.94 * 0.24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: AppColors.white,
                borderRadius: windowWidth * 0.94 * 0.12,
                position: "absolute",
                zIndex: 2,
                top: 0,
                left: "50%",
                transform: [
                  { translateY: -windowWidth * 0.94 * 0.12 },
                  { translateX: -windowWidth * 0.94 * 0.12 },
                ],
              }}
            >
              <View style={styles.storeLogo}>
                <Image
                  style={styles.logo}
                  source={
                    storeData?.logo
                      ? { uri: storeData.logo }
                      : storeDetailfallbackImage.logo
                  }
                />
              </View>
            </View>
          </View>

          <View
            style={{
              alignItems: rtl_support ? "flex-end" : "flex-start",
            }}
          >
            <Text style={[styles.storeTitle, rtlText]} numberOfLines={1}>
              {storeData?.title
                ? decodeString(storeData.title)
                : t("storeDetailsTexts.nullText")}
            </Text>
          </View>
          {
            <View
              style={{
                flexDirection: rtl_support ? "row-reverse" : "row",
                alignItems: "center",
                paddingVertical: 5,
              }}
            >
              <MaterialIcons
                name="verified"
                size={20}
                color={config?.seller_verification?.badge_color || "green"}
              />
              <View style={{ paddingHorizontal: 5 }}>
                <Text
                  style={[
                    {
                      fontSize: 15,
                      color:
                        config?.seller_verification?.badge_color || "green",
                    },
                    rtlText,
                  ]}
                >
                  {t("storeDetailsTexts.verified")}
                </Text>
              </View>
            </View>
          }
          <View style={{ paddingVertical: 5 }}>
            <Text
              style={[
                styles.storeDetailMidrowText,
                {
                  fontSize: 15,
                  color: AppColors.text_dark,
                },
                rtlText,
              ]}
            >
              {t("storeDetailsTexts.membership")}
              {" : "}
              <Text style={{ color: AppColors.text_gray }}>
                {formattedDate(storeData.created_at)}
              </Text>
            </Text>
          </View>
          <View
            style={{
              height: 1,
              width: "90%",
              backgroundColor: AppColors.border_light,
              marginTop: 10,
              marginBottom: 10,
            }}
          />
          {/* Phone, Email, Website */}
          <View>
            {!!storeData?.phone && (
              <View style={[styles.storeDetailMidrow, rtlView]}>
                <View style={styles.storeDetailMidrowIconWrap}>
                  <CallIcon fillColor={AppColors.primary} />
                </View>
                <View style={[rtlView]}>
                  <Text
                    style={[
                      styles.storeDetailMidrowText,
                      {
                        marginRight: rtl_support ? 5 : 0,
                        marginLeft: rtl_support ? 0 : 5,
                      },
                      rtlText,
                    ]}
                    numberOfLines={1}
                  >
                    {!!storeData?.phone
                      ? decodeString(storeData.phone)
                      : t("storeDetailsTexts.nullText")}
                  </Text>
                </View>
              </View>
            )}
            {!!storeData?.email && (
              <View style={[styles.storeDetailMidrow, rtlView]}>
                <View style={styles.storeDetailMidrowIconWrap}>
                  <MessageIcon fillColor={AppColors.primary} />
                </View>
                <View style={[rtlView]}>
                  <Text
                    style={[
                      styles.storeDetailMidrowText,
                      {
                        marginRight: rtl_support ? 5 : 0,
                        marginLeft: rtl_support ? 0 : 5,
                      },
                      rtlText,
                    ]}
                    numberOfLines={1}
                  >
                    {!!storeData?.email
                      ? decodeString(storeData.email)
                      : t("storeDetailsTexts.nullText")}
                  </Text>
                </View>
              </View>
            )}
            {!!storeData?.website && (
              <View style={[styles.storeDetailMidrow, rtlView]}>
                <View style={styles.storeDetailMidrowIconWrap}>
                  <GlobeIcon fillColor={AppColors.primary} />
                </View>
                <Text
                  style={[
                    styles.storeDetailMidrowText,
                    {
                      marginRight: rtl_support ? 5 : 0,
                      marginLeft: rtl_support ? 0 : 5,
                    },
                    rtlText,
                  ]}
                >
                  {!!storeData?.website
                    ? storeData.website
                    : t("storeDetailsTexts.nullText")}
                </Text>
              </View>
            )}
          </View>
          {/* Social Section */}
          {!!storeData?.social && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              {!!storeData?.social?.facebook && (
                <TouchableOpacity
                  style={{ marginHorizontal: 5 }}
                  onPress={() =>
                    habdleSocialLinkOpen(storeData.social.facebook)
                  }
                >
                  <FontAwesome
                    name="facebook-square"
                    size={30}
                    color="#008fd9"
                  />
                </TouchableOpacity>
              )}
              {!!storeData?.social?.twitter && (
                <TouchableOpacity
                  style={{ marginHorizontal: 5 }}
                  onPress={() => habdleSocialLinkOpen(storeData.social.twitter)}
                >
                  <FontAwesome
                    name="twitter-square"
                    size={30}
                    color="#30d7f2"
                  />
                </TouchableOpacity>
              )}
              {!!storeData?.social?.youtube && (
                <TouchableOpacity
                  style={{ marginHorizontal: 5 }}
                  onPress={() => habdleSocialLinkOpen(storeData.social.youtube)}
                >
                  <FontAwesome
                    name="youtube-square"
                    size={30}
                    color="#f50000"
                  />
                </TouchableOpacity>
              )}
              {!!storeData?.social?.linkedin && (
                <TouchableOpacity
                  style={{ marginHorizontal: 5 }}
                  onPress={() =>
                    habdleSocialLinkOpen(storeData.social.linkedin)
                  }
                >
                  <FontAwesome
                    name="linkedin-square"
                    size={30}
                    color="#00a0dc"
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        {!!storeData?.description && (
          <View style={[styles.storeDetailWrap, { paddingVertical: 10 }]}>
            <View
              style={{
                paddingHorizontal: 10,
                alignItems: rtl_support ? "flex-end" : "flex-start",
                width: "100%",
                paddingBottom: 10,
                paddingTop: 5,
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontWeight: "bold",
                    color: AppColors.text_dark,
                  },
                  rtlTextA,
                ]}
              >
                {t("storeDetailsTexts.description")}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                width: "94%",
                marginVertical: 5,
                backgroundColor: AppColors.border_light,
              }}
            />
            <View
              style={{
                backgroundColor: AppColors.white,
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                width: "100%",
              }}
            >
              <Text style={[rtlText, styles.text]}>
                {decodeString(getTrimmedText(storeData.description).trim())}
              </Text>
              {storeData.description.length > MAX_LENGTH && (
                <TouchableOpacity onPress={toggleExpanded}>
                  <Text style={styles.showMoreButton}>
                    {isExpanded ? "Show Less" : "Show More"}
                  </Text>
                </TouchableOpacity>
              )}
              {/* <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={renderTruncatedFooter}
                renderRevealedFooter={renderRevealedFooter}
              > */}
              {/* <Text
                  style={[
                    rtlText,
                    {
                      textAlign: "justify",
                      color: AppColors.text_gray,
                      lineHeight: 25,
                    },
                  ]}
                >
                  {decodeString(storeData.description).trim()}
                </Text> */}
              {/* </ReadMore> */}
            </View>
          </View>
        )}
        <View style={[styles.storeDetailWrap, { paddingVertical: 5 }]}>
          <View
            style={{
              flexDirection: rtl_support ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              width: "100%",
            }}
          >
            <View style={styles.view}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: AppColors.text_dark,
                }}
              >
                {t("storeMoreDetailTexts.sectionTitles.openinigDateTime")}
              </Text>
            </View>

            <View
              style={{
                flexDirection: rtl_support ? "row-reverse" : "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 0,
                  width: 0,
                  borderTopWidth: 15,
                  borderTopColor: "transparent",
                  borderBottomWidth: 15,
                  borderBottomColor: "transparent",
                  borderRightWidth: rtl_support ? 0 : 15,
                  borderRightColor: AppColors.primary,
                  borderLeftWidth: rtl_support ? 15 : 0,
                  borderLeftColor: AppColors.primary,
                }}
              />
              <View
                style={[
                  {
                    paddingLeft: rtl_support ? 10 : 0,
                    paddingRight: rtl_support ? 0 : 10,
                    height: 30,
                    justifyContent: "center",
                    backgroundColor: AppColors.primary,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: AppColors.white,
                  }}
                >
                  {getOpenHours()}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "90%",
              backgroundColor: AppColors.border_light,
              height: 1,
              marginVertical: 5,
            }}
          />
          <View style={{ width: "100%" }}>
            {["selected", "always"].includes(storeData?.opening_hours?.type) ? (
              getOpeningHours()
            ) : (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={[
                    { fontWeight: "bold", color: AppColors.text_dark },
                    rtlText,
                  ]}
                >
                  {t("storeMoreDetailTexts.noData")}
                </Text>
              </View>
            )}
          </View>
        </View>
        {!!storeData?.address && (
          <View style={[styles.storeDetailWrap, { paddingVertical: 10 }]}>
            <View
              style={{
                paddingHorizontal: 10,
                alignItems: rtl_support ? "flex-end" : "flex-start",
                width: "100%",
                paddingBottom: 10,
                paddingTop: 5,
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontWeight: "bold",
                    color: AppColors.text_dark,
                  },
                  rtlTextA,
                ]}
              >
                {t("storeMoreDetailTexts.sectionTitles.storeAddress")}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                width: "94%",
                marginVertical: 5,
                backgroundColor: AppColors.border_light,
              }}
            />
            <View
              style={{
                backgroundColor: AppColors.white,
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                width: "100%",
              }}
            >
              <Text
                style={[
                  rtlTextA,
                  {
                    textAlign: "justify",
                    color: AppColors.text_gray,
                    lineHeight: 25,
                  },
                ]}
              >
                {decodeString(storeData.address).trim()}
              </Text>
            </View>
          </View>
        )}

        {/* Flatlist Title */}
        <View
          style={[
            {
              width: "100%",
              paddingHorizontal: "3%",
              marginVertical: 10,
            },
            rtlView,
          ]}
        >
          <Text
            style={[
              {
                fontSize: 15,
                fontWeight: "bold",
                color: AppColors.text_dark,
                lineHeight: 20,
              },
              rtlText,
            ]}
          >
            {t("storeDetailsTexts.latestAds")}
          </Text>
        </View>
      </View>
    ),
    [storeData]
  );

  const EmptyListComponent = () => {
    if (initial) {
      return (
        <View style={styles.view}>
          <ActivityIndicator size="large" color={AppColors.primary} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              {
                fontSize: 15,
                fontWeight: "bold",
                color: AppColors.gray,
              },
              rtlText,
            ]}
          >
            {t("storeDetailsTexts.emptyListing")}
          </Text>
        </View>
      );
    }
  };

  const listFooter = () => {
    if (pagination && pagination.total_pages > pagination.current_page) {
      return (
        <View style={styles.loadMoreWrap}>
          <ActivityIndicator size="small" color={AppColors.primary} />
        </View>
      );
    } else {
      return null;
    }
  };

  const handleNextPageLoading = () => {
    if (refreshing) return;
    if (pagination && pagination.total_pages > pagination.current_page) {
      setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
      setMoreLoading(true);
    }
  };

  const handleCall = (number) => {
    setModalVisible(false);
    let phoneNumber = "";
    if (ios) {
      phoneNumber = `telprompt:${number}`;
    } else {
      phoneNumber = `tel:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const onRefresh = () => {
    if (moreLoading) return;
    setRefreshing(true);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlTextA = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };
  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };

  return loading ? (
    // {* Loading Component *}
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={AppColors.primary} />
      <Text style={[styles.text, rtlText]}>
        {t("storeDetailsTexts.loadingText")}
      </Text>
    </View>
  ) : (
    <View style={styles.container}>
      {!storeExpired && !!storeData && (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.screenTitle, rtlText]}>
              {t("storeDetailsTexts.title")}
            </Text>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={AppColors.white} />
            </TouchableOpacity>
          </View>
          {/* Listing FlatList */}
          <View style={styles.storeBottom}>
            <FlatList
              data={storeListingSData}
              renderItem={renderListItem}
              keyExtractor={keyExtractor}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              onEndReached={handleNextPageLoading}
              onEndReachedThreshold={1}
              ListFooterComponent={listFooter}
              onRefresh={onRefresh}
              refreshing={refreshing}
              ListHeaderComponent={ListHeader}
              ListEmptyComponent={EmptyListComponent}
              ItemSeparatorComponent={ListSeparator}
              contentContainerStyle={{
                paddingBottom: 70,
              }}
            />
          </View>
          {/* Call prompt */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            {!!storeData.phone && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: "3%",
                    padding: 20,
                    backgroundColor: AppColors.white,
                    width: "100%",
                  }}
                >
                  <Text style={[styles.callText, rtlText]}>
                    {t("storeDetailsTexts.callPrompt")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleCall(storeData.phone)}
                    style={styles.phone}
                  >
                    <Text style={[styles.phoneText, rtlText]}>
                      {storeData.phone}
                    </Text>
                    <FontAwesome5
                      name="phone"
                      size={18}
                      color={AppColors.primary}
                    />
                  </TouchableOpacity>
                  {/* {ios && (
                    <AppTextButton
                      title={t(
                        "storeDetailsTexts.cancelButtonTitle",
                        appSettings.lng
                      )}
                      style={{ marginTop: 20 }}
                      onPress={() => setModalVisible(false)}
                    />
                  )} */}
                </View>
              </View>
            )}
          </Modal>
        </>
      )}
      {storeExpired && (
        <View style={styles.expiredWrap}>
          <EvilIcons name="exclamation" size={50} color={AppColors.red} />
          <Text style={[styles.expiredText, rtlText]}>
            {t("storeDetailsTexts.storeExpired")}
          </Text>
          {/* <AppButton
            title={t("storeDetailsTexts.goBackButtonTitle")}
            onPress={handleGoBack}
            style={styles.goBackButton}
          /> */}
        </View>
      )}
      {(user === null || user?.id !== storeData?.owner_id) &&
        !config?.disabled?.listing_contact &&
        (!!storeData?.phone || !!storeData?.email) && (
          <View
            style={{
              paddingVertical: 10,
              position: "absolute",
              bottom: 0,
              width: "100%",
              paddingHorizontal: "1.5%",
            }}
          >
            <View
              style={[
                styles.storeContactWrap,
                {
                  justifyContent: "center",
                },
              ]}
            >
              {!!storeData?.email && (
                <TouchableOpacity
                  style={[
                    styles.storeContactButton,
                    { backgroundColor: AppColors.primary },
                  ]}
                  onPress={handleEmail}
                >
                  <Zocial name="email" size={18} color={AppColors.white} />
                  <Text
                    style={[
                      styles.storeContactButtonText,
                      { color: AppColors.white },
                    ]}
                    numberOfLines={1}
                  >
                    {t("sellerContactTexts.email")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
    </View>
  );
};

export default StoreDetailsScreen;
