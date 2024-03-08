/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

// Vector Icons
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

import AppColors from "../../../utills/AppColors";
import { useTranslation } from "react-i18next";

// Custom Components & Functions
import AppSeparator from "../../../components/AppSeparator";
import ListingForm from "../../../components/ListingForm";

import AppButton from "../../../components/AppButton";

import TabScreenHeader from "../../../components/TabScreenHeader";

import { decodeString } from "../../../utills/helper";
// import { routes } from "../navigation/routes";
import EditIcon from "../../../asset/svgComponents/EditIcon";
import { selectToken, selectUserMeta } from "../../../redux/slices/user";
import { useSelector } from "react-redux";
import { ApiManager } from "../../../backend/ApiManager";
import styles from "./styles";
import ScreenNames from "../../../routes/routes";
import { selectAppState } from "../../../redux/slices/appConfig";

const AddPostScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const auth_token = useSelector(selectToken);
  const appState = useSelector(selectAppState);
  const searchLocations = appState.search_locations;

  const user = useSelector(selectUserMeta);
  const listing_locations = searchLocations;

  console.log("listing_locations0----");
  console.log(listing_locations);

  const rtl_support = false;
  const ios = false;
  const newListingScreen = false;

  const config = {
    currency: {
      id: "USD",
      symbol: "&#36;",
      position: "left",
      separator: {
        decimal: ".",
        thousand: ",",
      },
    },
    payment_currency: {
      id: "USD",
      position: "right",
      separator: {
        decimal: ".",
        thousand: ",",
      },
      symbol: "&#36;",
    },
    promotions: {
      _bump_up: "Bump Up",
      _top: "Top",
      featured: "Featured",
    },
    location_type: "local",
    mark_as_sold: false,
    radius_search: {
      max_distance: 1000,
      units: "miles",
    },
    store_enabled: false,
    store: {
      time_options: {
        showMeridian: true,
      },
    },
    week_days: [
      { id: 1, name: "Monday" },
      { id: 2, name: "Tuesday" },
      { id: 3, name: "Wednesday" },
      { id: 4, name: "Thursday" },
      { id: 5, name: "Friday" },
      { id: 6, name: "Saturday" },
      { id: 0, name: "Sunday" },
    ],
    registered_only: {
      listing_contact: false,
      store_contact: false,
    },
    pn_events: [
      "listing_approved",
      "listing_expired",
      "chat",
      "listing_created",
      "order_created",
    ],
  };
  const [adType, setAdType] = useState();
  const [categories, setCategories] = useState({});
  const [currentCategories, setCurrentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(false);
  const [noSubCat, setNoSubCat] = useState(false);
  const [locationsData, setLocationsData] = useState([]);
  const [newListingConfig, setNewListingConfig] = useState({});
  const [osmOverlay, setOsmOverlay] = useState(true);

  const handleClear = () => {
    setAdType();
    setCurrentCategories([]);
    setNoSubCat(false);
    setNewListingConfig({});

    // dispatch({
    //   type: "SET_LISTING_LOCATIONS",
    //   listing_locations: null,
    // });
  };

  const handleBackButtonClick = () => {
    setLoading(true);
    navigation.goBack(null);
    // dispatch({
    //   type: "SET_NEW_LISTING_SCREEN",
    //   newListingScreen: false,
    // });

    handleClear();
    return true;
  };
  // initial call ( get config, location )
  useEffect(() => {
    // if (!newListingScreen) return;
    if (user) {
      ApiManager.setAuthToken(auth_token);

      console.log("config-new-listing");

      ApiManager.get("config-new-listing").then((res) => {
        console.log("res 11111");
        console.log(res);
        // if (res.ok) {
        setNewListingConfig(res);
        ApiManager.removeAuthToken();
        setLoading(false);
        // } else {
        //   alert(res?.data?.error_message || res?.data?.error || res?.problem);
        //   ApiManager.removeAuthToken();
        // }
      });

      ApiManager.get("locations").then((res) => {
        console.log("res 0000");
        console.log(res);
        // if (res.ok) {
        setLocationsData(res);
        // } else {
        //   alert(res?.data?.error_message || res?.data?.error || res?.problem);
        // }
      });
    }

    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
      setLoading(true);
    };
  }, [newListingScreen, user]);

  //get categories call
  useEffect(() => {
    if (!adType) return;
    setLoading(true);
    ApiManager.get("categories", {
      listing_type: adType.id,
    }).then((res) => {
      console.log("res 2222");
      console.log(res);
      // if (res.ok) {
      setCategories({ 0: res });
      setLoading(false);
      // } else {

      // }
    });
  }, [adType]);

  const handleSelectedCatPress = (arg) => {
    setCurrentCategories((prevCurrentCategories) =>
      prevCurrentCategories.slice(0, arg)
    );
    const selectedData = {};
    for (let i = 0; i <= arg; i++) {
      selectedData[i] = categories[i];
    }
    setCategories(selectedData);
  };

  const catPicker = (arg) => {
    if (currentCategories.length < arg) return;
    return (
      <View key={arg}>
        {/* Selected Category */}
        {currentCategories[arg] && (
          <TouchableOpacity
            style={[
              styles.selectedCategory,
              {
                backgroundColor:
                  arg == 0 ? AppColors.primary : AppColors.bg_primary,
              },
              rtlView,
            ]}
            onPress={() => handleSelectedCatPress(arg)}
          >
            <Text
              style={[
                styles.selectedCategoryText,
                {
                  color: arg == 0 ? AppColors.white : AppColors.primary,
                },
                rtlText,
              ]}
            >
              {decodeString(currentCategories[arg].name)}
            </Text>
            <FontAwesome5
              name="times"
              size={15}
              color={arg == 0 ? AppColors.white : AppColors.primary}
            />
          </TouchableOpacity>
        )}
        {/* Category Picker Options */}

        {!currentCategories[arg] && (
          <View
            style={{
              flexDirection: rtl_support ? "row-reverse" : "row",
              flexWrap: "wrap",
              paddingBottom: 10,
            }}
          >
            {categories[arg].map((_category) => (
              <TouchableOpacity
                style={styles.categoryPickerOptions}
                key={_category.term_id}
                onPress={() => handleCategorySelection(_category)}
              >
                <Text style={[styles.categoryPickerOptionsText, rtlText]}>
                  {decodeString(_category.name)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* Loading Component for Next level Picker Existance Checking */}
        {!currentCategories[arg + 1] && catLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={AppColors.primary} />
          </View>
        )}
      </View>
    );
  };

  const handleCategorySelection = (item) => {
    setCurrentCategories((prevCurrentCategories) => [
      ...prevCurrentCategories,
      item,
    ]);
    setCatLoading(true);
    getSubCategoryData(item.term_id);
  };

  const getSubCategoryData = (parent_id) => {
    ApiManager.get("categories", {
      parent_id: parent_id,
    }).then((res) => {
      console.log("res 4444");
      console.log(res);
      // if (res.ok) {
      if (res.length) {
        const nwekey = Object.keys(categories).length;
        setCategories((prevCategories) => {
          return { ...prevCategories, [nwekey]: res };
        });
      } else {
        setNoSubCat(true);
      }
      setCatLoading(false);
      // } else {
      //   alert(res?.data?.error_message || res?.data?.error || res?.problem);

      // }
    });
  };

  const getCategoryTaxonomy = () => {
    return rtl_support
      ? decodeString(
          currentCategories
            .map((item) => item.name)
            .reverse()
            .join(" < ")
        )
      : decodeString(currentCategories.map((item) => item.name).join(" > "));
  };

  const handleLocationButtonPress = () => {
    navigation.navigate(ScreenNames.SELECTLOCATION, {
      data: locationsData,
      type: "newListing",
    });
  };

  const handleChangeCategoryButtonPress = () => {
    setCurrentCategories([]);
    setAdType();
    setNoSubCat(false);
  };

  const getLocationTaxonomy = () => {
    if (!listing_locations) {
      return;
    }
    return rtl_support
      ? decodeString(
          listing_locations
            .map((_location) => _location.name)
            .reverse()
            .join(" < ")
        )
      : decodeString(
          listing_locations.map((_location) => _location.name).join(" > ")
        );
  };

  const handleChangeLocationButtonPress = () => {
    // dispatch({
    //   type: "SET_LISTING_LOCATIONS",
    //   listing_locations: [],
    // });
  };

  const handleMembership = () => {
    navigation.navigate(routes.myMembershipScreen);
  };

  const handleGoBack = () => {
    handleBackButtonClick();
  };
  const handleGoBackonSuccess = () => {
    // handleBackButtonClick();
    // dispatch({
    //   type: "SET_NEW_LISTING_SCREEN",
    //   listing_locations: null,
    // });
    navigation.replace(routes.drawerNavigator);
  };

  const rtlTextA = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };
  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };

  const changeOsmOverlay = (bool) => {
    setOsmOverlay(bool);
  };

  return user ? (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f8f8f8" }}
      keyboardVerticalOffset={ios ? 20 : -20}
    >
      <TabScreenHeader
        left={user && newListingScreen}
        onLeftClick={handleGoBack}
        style={{ elevation: 0 }}
      />
      {!user?.phone_verified && config?.verification?.post_restriction ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: AppColors.text_dark,
                paddingBottom: 20,
              }}
            >
              {t("newListingScreenTexts.unverifiedTitle")}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: AppColors.text_gray,
                textAlign: "center",
              }}
            >
              {t(
                user?.phone
                  ? "newListingScreenTexts.unverifiedAccountWithPhoneNumber"
                  : "newListingScreenTexts.unverifiedAccountWithoutPhoneNumber"
              )}
            </Text>
          </View>
          <View style={{ paddingVertical: 20 }}>
            <AppButton
              title={t("newListingScreenTexts.verifyBtnTitle")}
              style={{ paddingHorizontal: "15%" }}
              onPress={() =>
                navigation.navigate(routes.myProfileScreen, { source: "new" })
              }
            />
          </View>
        </View>
      ) : (
        <ScrollView scrollEnabled={osmOverlay}>
          <View style={styles.container}>
            <View style={{ paddingVertical: 15 }}>
              {/* Initial check */}
              {!newListingConfig?.eligible && loading && (
                <View style={styles.typeWrap}>
                  <View style={styles.checkWrap}>
                    <Text style={[styles.typeTitle, rtlText]}>
                      {t("newListingScreenTexts.eligibilityChecking")}
                    </Text>
                    <View style={styles.loading}>
                      <ActivityIndicator
                        size="large"
                        color={AppColors.primary}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* For not eligible users */}
              {!newListingConfig?.eligible && !loading && (
                <View style={styles.notEligible}>
                  <Octicons name="stop" size={50} color={AppColors.red} />
                  <Text style={[styles.remainingAdsText, rtlText]}>
                    {t("newListingScreenTexts.noRemainingAds")}
                  </Text>
                  <Text style={[styles.remainingAdsText, rtlText]}>
                    {t("newListingScreenTexts.purchaseMembership")}
                  </Text>
                  <View style={styles.buttonWrap}>
                    <AppButton
                      title={t("newListingScreenTexts.goBackButtonTitle")}
                      onPress={handleGoBack}
                      style={styles.button}
                    />
                    <AppButton
                      title={t("newListingScreenTexts.membershipButtonTitle")}
                      onPress={handleMembership}
                      style={styles.button}
                    />
                  </View>
                </View>
              )}
              {/* For eligible users */}
              {/* Ad Type Selector */}
              {newListingConfig.eligible && (
                <View
                  style={
                    !!currentCategories.length &&
                    noSubCat &&
                    ((!!listing_locations && !!listing_locations.length) ||
                      config.location_type === "geo")
                      ? styles.displayNone
                      : styles.typeWrap
                  }
                >
                  <View style={[styles.typeTitleWrap]}>
                    <Text style={[styles.typeTitle, rtlTextA]}>
                      {t("newListingScreenTexts.selectType")}
                    </Text>
                  </View>
                  <AppSeparator style={styles.formSeparator} />
                  <View style={styles.adType}>
                    {!newListingConfig["listing_types"].length && loading ? (
                      <View style={styles.loading}>
                        <ActivityIndicator
                          size="large"
                          color={AppColors.primary}
                        />
                      </View>
                    ) : (
                      <>
                        {adType ? (
                          <TouchableOpacity
                            style={[styles.typePickerFieldWrap, rtlView]}
                            onPress={() => {
                              setAdType();
                              setCategories({});
                              setCurrentCategories([]);
                              setNoSubCat(false);
                            }}
                          >
                            <Text style={[styles.types, rtlText]}>
                              {adType
                                ? decodeString(adType.name)
                                : `-- ${t(
                                    "newListingScreenTexts.selectType"
                                  )} --`}
                            </Text>
                            <FontAwesome5
                              name="chevron-down"
                              size={14}
                              color={AppColors.primary}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.typePickerWrap}>
                            {newListingConfig.listing_types.map((typ) => (
                              <TouchableOpacity
                                style={styles.typePickerOptions}
                                key={typ.id}
                                onPress={() => {
                                  setAdType(typ);
                                  setCurrentCategories([]);
                                  setNoSubCat(false);
                                }}
                              >
                                <Text style={[styles.types, rtlTextA]}>
                                  {typ.name}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </View>
              )}
              {/* Ad Category & Location Selector */}
              {/* Category Selector Wrap */}
              {adType && (
                <View
                  style={
                    !!currentCategories.length &&
                    noSubCat &&
                    ((!!listing_locations && !!listing_locations.length) ||
                      config.location_type === "geo")
                      ? styles.displayNone
                      : styles.categoryWrap
                  }
                >
                  <View style={styles.categoryTitleWrap}>
                    <Text style={[styles.categoryTitle, rtlText]}>
                      {t("newListingScreenTexts.selectCategory")}
                    </Text>
                    <AppSeparator style={styles.separator} />
                  </View>
                  {loading && !Object.keys(categories).length ? (
                    <View style={styles.loading}>
                      <ActivityIndicator
                        size="large"
                        color={AppColors.primary}
                      />
                    </View>
                  ) : (
                    <View style={styles.adCategory}>
                      {Object.keys(categories).map((_cat, index) =>
                        catPicker(index)
                      )}
                    </View>
                  )}
                </View>
              )}
              {/* Location Selector Wrap */}
              {adType && !!currentCategories?.length && noSubCat && (
                <View
                  style={
                    !!currentCategories.length &&
                    noSubCat &&
                    ((!!listing_locations && !!listing_locations?.length) ||
                      config.location_type === "geo")
                      ? styles.displayNone
                      : styles.locationWrap
                  }
                >
                  <View style={styles.categoryTitleWrap}>
                    <Text style={[styles.categoryTitle, rtlText]}>
                      {t("newListingScreenTexts.selectLocation")}
                    </Text>
                  </View>
                  <AppSeparator
                    style={[styles.formSeparator, { marginBottom: 15 }]}
                  />
                  {/* Location Selection Button */}
                  <TouchableOpacity
                    style={[styles.locationSelector, rtlView]}
                    onPress={handleLocationButtonPress}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 5,
                        paddingVertical: 1,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={18}
                        color={AppColors.white}
                      />
                    </View>
                    <Text style={[styles.locationSelectorText, rtlText]}>
                      {t("newListingScreenTexts.selectLocation")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* Category & Location Change Button Wrap */}
              <View
                style={
                  !!currentCategories.length &&
                  noSubCat &&
                  ((!!listing_locations && !!listing_locations.length) ||
                    config.location_type === "geo")
                    ? styles.changeCategoryWrap
                    : styles.displayNone
                }
              >
                {/* Category Change Button Wrap */}
                <View style={[styles.categoryChangeWrap, rtlView]}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: rtl_support ? 5 : 0,
                      alignItems: rtl_support ? "flex-end" : "flex-start",
                    }}
                  >
                    <Text
                      style={[styles.categoryRoute, rtlText]}
                      numberOfLines={1}
                    >
                      {getCategoryTaxonomy()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.routeChangeIconWrap}
                    onPress={handleChangeCategoryButtonPress}
                  >
                    <EditIcon fillColor={AppColors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Location Change Button Wrap */}
                {config.location_type === "local" && (
                  <View style={[styles.categoryChangeWrap, rtlView]}>
                    <View
                      style={{
                        flex: 1,
                        marginLeft: rtl_support ? 5 : 0,
                        alignItems: rtl_support ? "flex-end" : "flex-start",
                      }}
                    >
                      <Text style={[styles.categoryRoute, rtlText]}>
                        {getLocationTaxonomy()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.routeChangeIconWrap}
                      onPress={handleChangeLocationButtonPress}
                    >
                      <EditIcon fillColor={AppColors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {adType &&
                !!currentCategories.length &&
                noSubCat &&
                ((!!listing_locations && !!listing_locations.length) ||
                  config.location_type === "geo") && (
                  <ListingForm
                    catId={
                      currentCategories[currentCategories.length - 1].term_id
                    }
                    type={adType}
                    goBack={handleGoBackonSuccess}
                    osmOverlay={osmOverlay}
                    changeOsmOverlay={changeOsmOverlay}
                  />
                )}
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  ) : (
    <>
      <TabScreenHeader />
      <View style={styles.noUserViewWrap}>
        <View style={styles.noUserTitleWrap}>
          <Text style={[styles.noUserTitle, rtlTextA]}>
            {t("newListingScreenTexts.notLoggedIn")}
          </Text>
          <Text style={[styles.noUserMessage, rtlTextA]}>
            {t("newListingScreenTexts.loginOrSignUp")}
          </Text>
          <View style={styles.authButtonWrap}>
            <AppButton
              style={styles.authButton}
              title={t("newListingScreenTexts.loginOrSignUpButtonTitle")}
              onPress={() => navigation.navigate(routes.loginScreen)}
              textStyle={rtlText}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default AddPostScreen;
