import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { ApiManager } from "../../../backend/ApiManager";


import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getOwneAd } from "../../../backend/auth";
import { MyListingView, ScreenWrapper } from "../../../components";
import Header from "../../../components/header";
import {
  selectUserAds,
  selectUserMeta,
  setUserAds,
} from "../../../redux/slices/user";
import ScreenNames from "../../../routes/routes";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

import styles from "./styles";




// {* Expo Libraries *}
import * as ImagePicker from "expo-image-picker";

// {* External Libraries *}
import { Formik } from "formik";
import * as Yup from "yup";

// {* Vector Icons *}
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// {* Custom Components and Variables *}
import AppButton from "../../../components/AppButton";
import AppTextButton from "../../../components/AppTextButton";
import OHTimePicker from "./OHTimePicker";
import FlashNotification from "../../../components/FlashNotification";
import GalleryButtonIcon from "../../../asset/svgComponents/GalleryButtonIcon";
import CameraButtonIcon from "../../../asset/svgComponents/CameraButtonIcon";



const myStoreIcons = {
  bannerTitleIcon: require("../../../asset/images/gallery_icon.png"),
  logoTitleIcon: require("../../../asset/images/store_icon.png"),
  schedualTitleIcon: require("../../../asset/images/store_icon.png"),
  infoTitleIcon: require("../../../asset/images/store_icon.png"),
};

const myStoreFallBackImageURL = {
  banner: require("../../../asset/images/200X150.png"),
  logo: require("../../../asset/images/100x100.png"),
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

const defaultOpeningHours = {
  sunday: {
    active: 1,
    open: "8:00:00 AM",
    close: "10:00:00 PM",
  },
  monday: {
    active: 1,
    open: "8:00:00 AM",
    close: "10:00:00 PM",
  },
  tuesday: {
    active: 1,
    open: "8:00:00 AM",
    close: "10:00:00 PM",
  },
  wednesday: {
    active: 1,
    open: "8:00:00 AM",
    close: "10:00:00 PM",
  },
  thursday: {
    active: 1,
    open: "8:00:00 AM",
    close: "10:00:00 PM",
  },
  friday: {
    active: 1,
    open: "8:00:00 AM",
    close: "10:00:00 PM",
  },
  saturday: {
    active: 1,
    open: "8:00:00 AM",
    close: "10:00:00 PM",
  },
};

const { height: windowHeight } = Dimensions.get("window");

const MyStoreScreen = (props) => {

  const user = useSelector(selectUserMeta);
  const config = useSelector(selectUserMeta);
  const auth_token = user.auth_token;
  const { t } = useTranslation();

  const ios = false;
  const rtl_support = false;

  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape({
      title: Yup.string()
        .required(
          t("myStoreTexts.errorFieldNames.title") +
            " " +
            t("myStoreTexts.formValidation.requiredField")
        )
        .min(
          3,
          t("myStoreTexts.errorFieldNames.title") +
            " " +
            t("myStoreTexts.formValidation.minimumLength3")
        ),
      slug: Yup.string()
        .required(
          t("myStoreTexts.errorFieldNames.slug") +
            " " +
            t("myStoreTexts.formValidation.requiredField")
        )
        .min(
          3,
          t("myStoreTexts.errorFieldNames.slug") +
            " " +
            t("myStoreTexts.formValidation.minimumLength3")
        ),
      slogan: Yup.string().label(
        t("myStoreTexts.errorFieldNames.slogan")
      ),
      email: Yup.string()
        .required(
          t("myStoreTexts.errorFieldNames.email") +
            " " +
            t("myStoreTexts.formValidation.requiredField")
        )
        .email(t("myStoreTexts.formValidation.validEmail")),
      phone: Yup.string().min(
        5,
        t("myStoreTexts.errorFieldNames.phone") +
          " " +
          t("myStoreTexts.formValidation.minimumLength5")
      ),
      address: Yup.string().label(
        t("myStoreTexts.errorFieldNames.address")
      ),
      website: Yup.string().url(
        t("myStoreTexts.formValidation.validUrl")
      ),
      facebook: Yup.string().url(
        t("myStoreTexts.formValidation.validUrl")
      ),
      youtube: Yup.string().url(
        t("myStoreTexts.formValidation.validUrl")
      ),
      twitter: Yup.string().url(
        t("myStoreTexts.formValidation.validUrl")
      ),
      linkedin: Yup.string().url(
        t("myStoreTexts.formValidation.validUrl")
      ),
      description: Yup.string().label(
        t("myStoreTexts.errorFieldNames.description")
      ),
    })
  );
  const [loading, setLoading] = useState(true);
  const [logoLoading, setLogoLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [storeUpdateLoading, setStoreUpdateLoading] = useState(false);
  const [storeData, setStoreData] = useState();
  const [storeLogo, setStoreLogo] = useState();
  const [storeBanner, setStoreBanner] = useState();
  const [storeOpeningHoursType, setStoreOpeningHoursType] = useState("always");
  const [storeOpeningHours, setStoreOpeningHours] = useState({});
  const [logoPickerVisible, setLogoPickerVisible] = useState(false);
  const [bannerPickerVisible, setBannerPickerVisible] = useState(false);
  const [storeOHTouched, setStoreOHTouched] = useState(false);
  const [flashNotification, setFlashNotification] = useState(false);
  const [flashNotificationMessage, setFlashNotificationMessage] = useState();
  const [userHasNoStore, setUserHasNoStore] = useState(false);
  const [weekDays, setWeekDays] = useState({});

  // {* Initial Get Store Information Call *}
  useEffect(() => {
    getStore();
  }, []);

  const getStore = () => {
    ApiManager.setAuthToken(auth_token);
    ApiManager.get("my/store").then((res) => {
      if (res.ok) {
        if (res.data) {
          setStoreData(res.data);
          if (res.data.banner) {
            setStoreBanner(res.data.banner);
          }
          if (res.data.logo) {
            setStoreLogo(res.data.logo);
          }
          setStoreOpeningHoursType(res.data?.opening_hours?.type || "always");
          setStoreOpeningHours(
            res.data?.opening_hours?.hours || defaultOpeningHours
          );
        }
        setLoading(false);
        ApiManager.removeAuthToken();
      } else {
        if (res.status === 400) {
          setUserHasNoStore(true);
        } else {
          handleError(
            res?.data?.error_message ||
              res?.problem + " Code: " + res?.status ||
              t("myStoreTexts.errorNotification")
          );
        }
        // TODO handle error

        setLoading(false);
        ApiManager.removeAuthToken();
      }
    });
  };

  const getTrimmedText = (text) => {
    if (text.length <= MAX_LENGTH) {
      return text;
    }
    return isExpanded ? text : text.substring(0, MAX_LENGTH) + "...";
  };

  const LogoPickerModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={logoPickerVisible}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={() =>
          setLogoPickerVisible(
            (prevLogoPickerVisible) => !prevLogoPickerVisible
          )
        }
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTitleWrap}>
            <Text style={[styles.modalTitle, rtlText]}>
              {t("myStoreTexts.imagePickerTitle")}
            </Text>
          </View>
          <View style={styles.contentWrap}>
            <TouchableOpacity
              style={styles.libraryWrap}
              onPress={() => requestCameraParmission("logo")}
              disabled={logoLoading || bannerLoading}
            >
              <CameraButtonIcon
                fillColor={AppColors.bg_primary}
                strokeColor={AppColors.primary}
                iconColor={AppColors.primary}
              />
              <Text style={[styles.libraryText, rtlText]}>
                {t("myStoreTexts.imagePickerCameraText")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.libraryWrap}
              onPress={() => requestGalleryParmission("logo")}
              disabled={logoLoading || bannerLoading}
            >
              <GalleryButtonIcon
                fillColor="#EBF9FF"
                strokeColor="#2267ED"
                iconColor="#2267ED"
              />
              <Text style={[styles.libraryText, rtlText]}>
                {t("myStoreTexts.imagePickerGalleryText")}
              </Text>
            </TouchableOpacity>
          </View>
          <AppTextButton
            style={styles.cancelButton}
            title={t("myStoreTexts.cancelButtonTitle")}
            onPress={() =>
              setLogoPickerVisible(
                (prevLogoPickerVisible) => !prevLogoPickerVisible
              )
            }
            textStyle={{ color: AppColors.text_dark, fontWeight: "bold" }}
          />
        </View>
      </View>
    </Modal>
  );

  const BannerPickerModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={bannerPickerVisible}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={() =>
          setBannerPickerVisible(
            (prevBannerPickerVisible) => !prevBannerPickerVisible
          )
        }
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTitleWrap}>
            <Text style={[styles.modalTitle, rtlText]}>
              {t("myStoreTexts.imagePickerTitle")}
            </Text>
          </View>
          <View style={styles.contentWrap}>
            <TouchableOpacity
              style={styles.libraryWrap}
              onPress={() => requestCameraParmission("banner")}
              disabled={logoLoading || bannerLoading}
            >
              <CameraButtonIcon
                fillColor={AppColors.bg_primary}
                strokeColor={AppColors.primary}
                iconColor={AppColors.primary}
              />
              <Text style={[styles.libraryText, , rtlText]}>
                {t("myStoreTexts.imagePickerCameraText")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.libraryWrap}
              onPress={() => requestGalleryParmission("banner")}
              disabled={logoLoading || bannerLoading}
            >
              <GalleryButtonIcon
                fillColor="#EBF9FF"
                strokeColor="#2267ED"
                iconColor="#2267ED"
              />
              <Text style={[styles.libraryText, , rtlText]}>
                {t("myStoreTexts.imagePickerGalleryText")}
              </Text>
            </TouchableOpacity>
          </View>
          <AppTextButton
            style={styles.cancelButton}
            title={t("myStoreTexts.cancelButtonTitle")}
            onPress={() =>
              setBannerPickerVisible(
                (prevBannerPickerVisible) => !prevBannerPickerVisible
              )
            }
            textStyle={{ color: AppColors.text_dark, fontWeight: "bold" }}
          />
        </View>
      </View>
    </Modal>
  );

  const handleAlwaysPress = () => {
    if (storeOpeningHoursType === "selected") {
      setStoreOpeningHoursType("always");
    }
    if (!storeOHTouched) {
      setStoreOHTouched(true);
    }
    return;
  };

  const handleSelectedPress = () => {
    if (storeOpeningHoursType === "always") {
      setStoreOpeningHoursType("selected");
    }
    if (!storeOHTouched) {
      setStoreOHTouched(true);
    }
    return;
  };
  const requestGalleryParmission = async (arg) => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(t("myStoreTexts.cameraRollPermissionAlert"));
      } else handleSelectGalleryImage(arg);
    }
  };

  const handleSelectGalleryImage = async (arg) => {
    if (!ios) {
      if (logoPickerVisible) setLogoPickerVisible(false);
      if (bannerPickerVisible) setBannerPickerVisible(false);
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      if (ios) {
        if (logoPickerVisible) setLogoPickerVisible(false);
        if (bannerPickerVisible) setBannerPickerVisible(false);
      }
      if (arg === "logo") {
        setLogoLoading(true);
      }
      if (arg === "banner") {
        setBannerLoading(true);
      }

      ApiManager.setAuthToken(auth_token);
      ApiManager.setMultipartHeader();
      let localUri = result.uri;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      const image = {
        uri: localUri,
        name: filename,
        type,
      };
      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects
      formData.append(`${arg}`, image);

      updateImage(formData, arg);
    }
  };

  const requestCameraParmission = async (arg) => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert(t("myStoreTexts.cameraPermissionAlert"));
      } else handleSelectCameraImage(arg);
    }
  };

  const handleSelectCameraImage = async (arg) => {
    if (!ios) {
      if (logoPickerVisible) setLogoPickerVisible(false);
      if (bannerPickerVisible) setBannerPickerVisible(false);
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      if (ios) {
        if (logoPickerVisible) setLogoPickerVisible(false);
        if (bannerPickerVisible) setBannerPickerVisible(false);
      }
      if (arg === "logo") {
        setLogoLoading(true);
      }
      if (arg === "banner") {
        setBannerLoading(true);
      }

      ApiManager.setAuthToken(auth_token);
      ApiManager.setMultipartHeader();
      let localUri = result.uri;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      const image = {
        uri: localUri,
        name: filename,
        type,
      };
      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects
      formData.append(`${arg}`, image);

      updateImage(formData, arg);
    }
  };
  const updateImage = (formData, arg) => {
    ApiManager.post(`my/store/${arg}`, formData).then((res) => {
      if (res.ok) {
        ApiManager.removeAuthToken();
        ApiManager.removeMultipartHeader();
        if (arg === "logo") {
          setStoreLogo(res.data);
          setLogoLoading((prevLogoLoading) => !prevLogoLoading);
          handleSuccess(
            t("myStoreTexts.successNotifications.logo")
          );
        }
        if (arg === "banner") {
          setStoreBanner(res.data);
          setBannerLoading((prevBannerLoading) => !prevBannerLoading);
          handleSuccess(
            t("myStoreTexts.successNotifications.banner")
          );
        }
      } else {
        ApiManager.removeAuthToken();
        ApiManager.removeMultipartHeader();
        if (logoLoading) {
          setLogoLoading(false);
        }
        if (bannerLoading) {
          setBannerLoading(false);
        }
        handleError(
          res?.data?.error_message ||
            res?.data?.error ||
            res?.problem ||
            t("myStoreTexts.errorNotification")
        );
      }
    });
  };

  const handleDaySelection = (arg) => {
    let tempDay = { ...storeOpeningHours[arg] };

    if (!!tempDay.active) {
      delete tempDay["active"];
    } else {
      tempDay = { ...tempDay, ["active"]: 1 };
    }
    setStoreOpeningHours({ ...storeOpeningHours, [arg]: tempDay });
    if (!storeOHTouched) {
      setStoreOHTouched(true);
    }
  };

  const handlePickerPress = (day, type, payload) => {
    const format =
      config?.store?.time_options?.showMeridian !== false ? "h:mm A" : "H:mm";
    const dayObject = {
      ...storeOpeningHours[day],
      [type]: getTrimmedText(payload)
    };
    const weekObject = { ...storeOpeningHours, [day]: dayObject };
    setStoreOpeningHours(weekObject);
    if (!storeOHTouched) {
      setStoreOHTouched(true);
    }
  };

  const handleUpdate = (values) => {
    setStoreUpdateLoading(true);

    let storeInfo = {
      title: values.title,
      slug: values.slug,
      email: values.email,
      phone: values.phone,
      address: values.address,
      website: values.website,
      description: values.description,
      slogan: values.slogan,
      oh_type: storeOpeningHoursType,
      oh_hours: storeOpeningHours,
      social_media: {
        facebook: values.facebook,
        youtube: values.youtube,
        linkedin: values.linkedin,
        twitter: values.twitter,
      },
    };

    ApiManager.setAuthToken(auth_token);
    ApiManager.post("my/store", storeInfo).then((res) => {
      if (res.ok) {
        setStoreUpdateLoading(false);
        handleSuccess(
          t("myStoreTexts.successNotifications.storeInfo")
        );
      } else {
        setStoreUpdateLoading(false);
        handleError(
          res?.data?.error_message ||
            res?.data?.error ||
            res?.problem ||
            t("myStoreTexts.errorNotification")
        );
      }
    });

    ApiManager.removeAuthToken();
  };

  const handleSuccess = (message) => {
    setFlashNotificationMessage(message);
    setTimeout(() => {
      setFlashNotification(true);
    }, 10);
    setTimeout(() => {
      setFlashNotification(false);
      setFlashNotificationMessage();
      // navigation.goBack();
    }, 700);
  };

  const handleError = (message) => {
    setFlashNotificationMessage(message);
    setTimeout(() => {
      setFlashNotification(true);
    }, 10);
    setTimeout(() => {
      setFlashNotification(false);
      setFlashNotificationMessage();
    }, 1000);
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

  return loading ? (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={AppColors.primary} />
    </View>
  ) : (
    <>
      {userHasNoStore ? (
        <View style={styles.noStore}>
          <Text style={[styles.noStoreText, rtlText]}>
            {t("myStoreTexts.userHasNoStore")}
          </Text>
          <Text style={[styles.createStoreMessage, rtlText]}>
            {t("myStoreTexts.storeCreateMessage")}
          </Text>
          <AppButton
            title={t("myStoreTexts.createStoreButtonTitle")}
            style={styles.createStoreButton}
            onPress={() => setUserHasNoStore(false)}
            textStyle={{ writingDirection: rtl_support ? "rtl" : "ltr" }}
          />
        </View>
      ) : (
        <>
          <KeyboardAvoidingView
            behavior={ios ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={70}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.storeSectionComponent}>
                <View style={[styles.storeSectionTitleWrap, rtlView]}>
                  <View style={styles.storeSectionTitleIconWrap}>
                    <Image
                      source={myStoreIcons.bannerTitleIcon}
                      style={styles.storeSectionTitleIcon}
                    />
                  </View>
                  <View
                    style={[
                      styles.storeSectionTitleTextWrap,
                      { alignItems: rtl_support ? "flex-end" : "flex-start" },
                    ]}
                  >
                    <Text style={[styles.storeSectionTitleText, rtlText]}>
                      {t("myStoreTexts.banner")}
                    </Text>
                  </View>
                </View>
                <View style={styles.storeSectionContentWrap}>
                  <View style={styles.bannerWrap}>
                    {bannerLoading ? (
                      <View style={styles.loading}>
                        <ActivityIndicator
                          size="large"
                          color={AppColors.primary}
                        />
                      </View>
                    ) : (
                      <Image
                        source={
                          storeBanner
                            ? { uri: storeBanner }
                            : myStoreFallBackImageURL.banner
                        }
                        style={styles.bannerImage}
                      />
                    )}
                  </View>
                  <View
                    style={[
                      rtl_support
                        ? styles.bannerButtonGroupWrapRtl
                        : styles.bannerButtonGroupWrap,
                      {
                        opacity: bannerLoading || bannerLoading ? 0.5 : 1,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.bannerButton}
                      onPress={() => setBannerPickerVisible(true)}
                      disabled={logoLoading || bannerLoading}
                    >
                      <FontAwesome name="plus" size={20} color={AppColors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={[
                    styles.storeSectionBottomWrap,
                    { alignItems: rtl_support ? "flex-end" : "flex-start" },
                  ]}
                >
                  <Text style={[styles.storeSectionBottomText, rtlText]}>
                    <Text style={styles.star}>* </Text>
                    {t("myStoreTexts.recommendedSize")}
                    {storeData?.config?.banner?.width || "1230"}*
                    {storeData?.config?.banner?.height || "313"}) px.
                  </Text>

                  {!!config.image_size && (
                    <Text style={[styles.storeSectionBottomText, rtlText]}>
                      {t("myStoreTexts.maximum")}
                      {config.image_size}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.storeSectionComponent}>
                <View style={[styles.storeSectionTitleWrap, rtlView]}>
                  <View style={styles.storeSectionTitleIconWrap}>
                    <Image
                      source={myStoreIcons.logoTitleIcon}
                      style={styles.storeSectionTitleIcon}
                    />
                  </View>
                  <View
                    style={[
                      styles.storeSectionTitleTextWrap,
                      { alignItems: rtl_support ? "flex-end" : "flex-start" },
                    ]}
                  >
                    <Text style={[styles.storeSectionTitleText, rtlText]}>
                      {t("myStoreTexts.logo")}
                    </Text>
                  </View>
                </View>
                <View style={styles.storeSectionContentWrap}>
                  <View style={styles.logoWrap}>
                    {logoLoading ? (
                      <View style={styles.loading}>
                        <ActivityIndicator
                          size="large"
                          color={AppColors.primary}
                        />
                      </View>
                    ) : (
                      <Image
                        source={
                          storeLogo
                            ? { uri: storeLogo }
                            : myStoreFallBackImageURL.logo
                        }
                        style={styles.logoImage}
                      />
                    )}
                  </View>
                  <View
                    style={[
                      rtl_support
                        ? styles.logoButtonGroupWrapRtl
                        : styles.logoButtonGroupWrap,
                      {
                        opacity: logoLoading || bannerLoading ? 0.5 : 1,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.logoButton}
                      onPress={() => setLogoPickerVisible(true)}
                      disabled={logoLoading || bannerLoading}
                    >
                      <FontAwesome name="plus" size={16} color={AppColors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={[
                    styles.storeSectionBottomWrap,
                    { alignItems: rtl_support ? "flex-end" : "flex-start" },
                  ]}
                >
                  <Text style={[styles.storeSectionBottomText, rtlText]}>
                    <Text style={styles.star}>* </Text>
                    {t("myStoreTexts.recommendedSize")}
                    {storeData?.config?.logo?.width || "180"}*
                    {storeData?.config?.logo?.height || "140"}) px.
                  </Text>

                  {!!config.image_size && (
                    <Text style={[styles.storeSectionBottomText, rtlText]}>
                      {t("myStoreTexts.maximum")}
                      {config.image_size}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.storeSectionComponent}>
                <View style={[styles.storeSectionTitleWrap, rtlView]}>
                  <View style={styles.storeSectionTitleIconWrap}>
                    <Image
                      source={myStoreIcons.schedualTitleIcon}
                      style={styles.storeSectionTitleIcon}
                    />
                  </View>
                  <View
                    style={[
                      styles.storeSectionTitleTextWrap,
                      { alignItems: rtl_support ? "flex-end" : "flex-start" },
                    ]}
                  >
                    <Text style={[styles.storeSectionTitleText, rtlText]}>
                      {t("myStoreTexts.schedule")}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 1,
                    borderRadius: 1,
                  }}
                ></View>
                <View style={[styles.storeSectionTitleWrap, rtlView]}>
                  <View style={styles.storeSectionTitleIconWrap}>
                    <Fontisto name="clock" size={22} color={AppColors.primary} />
                  </View>
                  <View
                    style={[
                      styles.storeSectionTitleTextWrap,
                      { alignItems: rtl_support ? "flex-end" : "flex-start" },
                    ]}
                  >
                    <Text style={[styles.storeSectionTitleText, rtlText]}>
                      {t("myStoreTexts.hours")}
                    </Text>
                  </View>
                </View>

                <View style={styles.storeSectionContentWrap}>
                  <View style={[styles.radioButtonGroupWrap, rtlView]}>
                    <TouchableOpacity
                      style={[styles.radioButton, rtlView]}
                      onPress={handleAlwaysPress}
                    >
                      <View style={styles.radioOutLine}>
                        {storeOpeningHoursType === "always" && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <View
                        style={[
                          styles.radioButtonTextwrap,
                          { paddingHorizontal: 10 },
                        ]}
                      >
                        <Text style={[styles.radioButtonText, rtlText]}>
                          {t("myStoreTexts.alwaysOpen")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.radioButton, rtlView]}
                      onPress={handleSelectedPress}
                    >
                      <View style={styles.radioOutLine}>
                        {storeOpeningHoursType === "selected" && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <View
                        style={[
                          styles.radioButtonTextwrap,
                          {
                            paddingLeft: rtl_support ? 0 : 10,
                            paddingRight: rtl_support ? 10 : 0,
                          },
                        ]}
                      >
                        <Text style={[styles.radioButtonText, rtlText]}>
                          {t("myStoreTexts.selectHours")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {storeOpeningHoursType === "selected" && (
                    <View style={styles.openingHourPickerWrap}>
                      {week.map((day, index) => (
                        <View
                          style={[styles.dayOHPickerWrap, rtlView]}
                          key={day}
                        >
                          <View
                            style={[
                              styles.dayOHPickerContent,
                              { flex: 4 },
                              rtlView,
                            ]}
                          >
                            <View style={styles.dayOHPickerCheckBoxWrap}>
                              <MaterialCommunityIcons
                                onPress={() => handleDaySelection(day)}
                                name={
                                  !!storeOpeningHours[day]?.active
                                    ? "checkbox-marked"
                                    : "checkbox-blank-outline"
                                }
                                size={20}
                                color={AppColors.primary}
                              />
                            </View>
                            <View
                              style={[
                                styles.dayOHPickerTextWrap,
                                {
                                  alignItems: rtl_support
                                    ? "flex-end"
                                    : "flex-start",
                                  paddingLeft: rtl_support ? 0 : 15,
                                  paddingRight: rtl_support ? 15 : 0,
                                },
                              ]}
                            >
                              <Text style={styles.dayOHPickerText}>
                                {weekDays[index]}
                              </Text>
                            </View>
                          </View>
                          {!!storeOpeningHours[day]?.active ? (
                            <View
                              style={[
                                styles.dayOHPickerContent,
                                {
                                  flex: 6,
                                  justifyContent: "space-evenly",
                                },
                                rtlView,
                              ]}
                            >
                              <OHTimePicker
                                value={
                                  storeOpeningHours[day]?.open || "8:00 AM"
                                }
                                type="open"
                                day={day}
                                onSelectTime={handlePickerPress}
                                is12hr={
                                  config.store?.time_options?.showMeridian ??
                                  true
                                }
                              />

                              <Text style={styles.dayOHPickerTimeSeparator}>
                                -
                              </Text>

                              <OHTimePicker
                                value={
                                  storeOpeningHours[day]?.close || "8:00 PM"
                                }
                                type="close"
                                day={day}
                                onSelectTime={handlePickerPress}
                                is12hr={
                                  config.store?.time_options?.showMeridian ||
                                  true
                                }
                              />
                            </View>
                          ) : (
                            <View
                              style={{
                                flex: 6,
                                alignItems: "center",
                              }}
                            >
                              <Text style={[styles.text, rtlText]}>
                                {t("myStoreTexts.closed")}
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <Formik
                initialValues={{
                  slug: storeData?.slug || "",
                  title: storeData?.title || "",
                  slogan: storeData?.slogan || "",
                  email: storeData?.email || "",
                  phone: storeData?.phone || "",
                  website: storeData?.website || "",
                  address: storeData?.address || "",
                  description: storeData?.description || "",
                  facebook: storeData?.social?.facebook || "",
                  twitter: storeData?.social?.twitter || "",
                  youtube: storeData?.social?.youtube || "",
                  linkedin: storeData?.social?.linkedin || "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleUpdate}
              >
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  setFieldTouched,
                  touched,
                }) => (
                  <View style={styles.storeSectionComponent}>
                    <View style={[styles.storeSectionTitleWrap, rtlView]}>
                      <View style={styles.storeSectionTitleIconWrap}>
                        <Image
                          source={myStoreIcons.infoTitleIcon}
                          style={styles.storeSectionTitleIcon}
                        />
                      </View>
                      <View
                        style={[
                          styles.storeSectionTitleTextWrap,
                          {
                            alignItems: rtl_support ? "flex-end" : "flex-start",
                          },
                        ]}
                      >
                        <Text style={[styles.storeSectionTitleText, rtlText]}>
                          {t("myStoreTexts.info")}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.storeSectionContentWrap}>
                      <View style={styles.storeInputWrap}>
                        <Text style={[styles.storeInputTitle, rtlTextA]}>
                          {t("myStoreTexts.slug")}{" "}
                          <Text
                            style={{ color: AppColors.red, fontWeight: "bold" }}
                          >
                            *
                          </Text>
                        </Text>
                        <TextInput
                          placeholder={t(
                            "myStoreTexts.placeHolders.slug"
                          )}
                          placeholderTextColor={AppColors.text_gray}
                          style={[styles.storeInput, rtlTextA]}
                          onChangeText={handleChange("slug")}
                          onBlur={() => setFieldTouched("slug")}
                          value={values.slug}
                          autoCorrect={false}
                          autoCapitalize="none"
                          keyboardType="default"
                          editable={!storeData?.slug}
                        />
                        <View style={styles.storeInputErrorWrap}>
                          {errors.slug && touched.slug && (
                            <Text style={[styles.storeInputError, rtlTextA]}>
                              {errors.slug}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.storeInputWrap}>
                        <Text style={[styles.storeInputTitle, rtlTextA]}>
                          {t("myStoreTexts.storeName")}{" "}
                          <Text
                            style={{ color: AppColors.red, fontWeight: "bold" }}
                          >
                            *
                          </Text>
                        </Text>
                        <TextInput
                          placeholder={t(
                            "myStoreTexts.placeHolders.title"
                          )}
                          placeholderTextColor={AppColors.text_gray}
                          style={[styles.storeInput, rtlTextA]}
                          onChangeText={handleChange("title")}
                          onBlur={() => setFieldTouched("title")}
                          value={values.title}
                          autoCorrect={false}
                          keyboardType="default"
                        />
                        <View style={styles.storeInputErrorWrap}>
                          {errors.title && touched.title && (
                            <Text style={[styles.storeInputError, rtlTextA]}>
                              {errors.title}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.storeInputWrap}>
                        <Text style={[styles.storeInputTitle, rtlTextA]}>
                          {t("myStoreTexts.storeSlogan")}
                        </Text>
                        <TextInput
                          placeholder={t(
                            "myStoreTexts.placeHolders.slogan"
                          )}
                          placeholderTextColor={AppColors.text_gray}
                          style={[styles.storeInput, rtlTextA]}
                          onChangeText={handleChange("slogan")}
                          onBlur={() => setFieldTouched("slogan")}
                          value={values.slogan}
                          autoCorrect={false}
                          keyboardType="default"
                        />
                        <View style={styles.storeInputErrorWrap}>
                          {errors.slogan && touched.slogan && (
                            <Text style={[styles.storeInputError, rtlTextA]}>
                              {errors.slogan}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.storeInputWrap}>
                        <Text style={[styles.storeInputTitle, rtlTextA]}>
                          {t("myStoreTexts.storeEmail")}{" "}
                          <Text
                            style={{ color: AppColors.red, fontWeight: "bold" }}
                          >
                            *
                          </Text>
                        </Text>
                        <TextInput
                          placeholder={t(
                            "myStoreTexts.placeHolders.email"
                          )}
                          placeholderTextColor={AppColors.text_gray}
                          style={[styles.storeInput, rtlTextA]}
                          onChangeText={handleChange("email")}
                          onBlur={() => setFieldTouched("email")}
                          value={values.email}
                          keyboardType="email-address"
                        />
                        <View style={styles.storeInputErrorWrap}>
                          {errors.email && touched.email && (
                            <Text style={[styles.storeInputError, rtlTextA]}>
                              {errors.email}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.storeInputWrap}>
                        <Text style={[styles.storeInputTitle, rtlTextA]}>
                          {t("myStoreTexts.storePhone")}
                        </Text>
                        <TextInput
                          placeholder={t(
                            "myStoreTexts.placeHolders.phone"
                          )}
                          placeholderTextColor={AppColors.text_gray}
                          style={[styles.storeInput, rtlTextA]}
                          onChangeText={handleChange("phone")}
                          onBlur={() => setFieldTouched("phone")}
                          value={values.phone}
                          autoCorrect={false}
                          autoCapitalize="none"
                          keyboardType="phone-pad"
                        />
                        <View style={styles.storeInputErrorWrap}>
                          {errors.phone && touched.phone && (
                            <Text style={[styles.storeInputError, rtlTextA]}>
                              {errors.phone}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.storeInputWrap}>
                        <Text style={[styles.storeInputTitle, rtlTextA]}>
                          {t("myStoreTexts.storeWebsite")}
                        </Text>
                        <TextInput
                          placeholder={t(
                            "myStoreTexts.placeHolders.website"
                          )}
                          placeholderTextColor={AppColors.text_gray}
                          style={[styles.storeInput, rtlTextA]}
                          onChangeText={handleChange("website")}
                          onBlur={() => setFieldTouched("website")}
                          value={values.website}
                          autoCorrect={false}
                          autoCapitalize="none"
                          keyboardType="default"
                        />
                        <View style={styles.storeInputErrorWrap}>
                          {errors.website && touched.website && (
                            <Text style={[styles.storeInputError, rtlTextA]}>
                              {errors.website}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.storeInputWrap}>
                        <Text style={[styles.storeInputTitle, rtlTextA]}>
                          {t("myStoreTexts.storeAddress")}
                        </Text>
                        <TextInput
                          placeholder={t(
                            "myStoreTexts.placeHolders.address"
                          )}
                          placeholderTextColor={AppColors.text_gray}
                          style={[styles.storeInputArea, rtlTextA]}
                          onChangeText={handleChange("address")}
                          onBlur={() => setFieldTouched("address")}
                          value={values.address}
                          multiline={true}
                          textAlignVertical="top"
                          keyboardType="default"
                        />
                        <View style={styles.storeInputErrorWrap}>
                          {errors.address && touched.address && (
                            <Text style={[styles.storeInputError, rtlTextA]}>
                              {errors.address}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.storeInputWrap}>
                        <Text style={[styles.storeInputTitle, rtlTextA]}>
                          {t("myStoreTexts.storeDescription")}
                        </Text>
                        <TextInput
                          placeholder={t(
                            "myStoreTexts.placeHolders.description"
                          )}
                          placeholderTextColor={AppColors.text_gray}
                          style={[styles.storeInputArea, rtlTextA]}
                          onChangeText={handleChange("description")}
                          onBlur={() => setFieldTouched("description")}
                          value={values.description}
                          keyboardType="default"
                          textAlignVertical="top"
                          multiline={true}
                        />
                        <View style={styles.storeInputErrorWrap}>
                          {errors.description && touched.description && (
                            <Text style={[styles.storeInputError, rtlTextA]}>
                              {errors.description}
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* Social Links */}
                      <Text
                        style={[
                          styles.storeInputTitle,
                          { marginBottom: ios ? 10 : 7 },
                          rtlTextA,
                        ]}
                      >
                        {t("myStoreTexts.storeSocial")}
                      </Text>
                      <View
                        style={[
                          styles.storeSocialInputWrap,
                          rtlView,
                          {
                            borderColor: "#008fd9",
                            backgroundColor: "#008fd9",
                          },
                        ]}
                      >
                        <View style={styles.socialIconWrap}>
                          <FontAwesome
                            name="facebook"
                            size={20}
                            color={AppColors.white}
                          />
                        </View>
                        <TextInput
                          style={[styles.storeSocialInput, rtlTextA]}
                          onChangeText={handleChange("facebook")}
                          onBlur={() => setFieldTouched("facebook")}
                          value={values.facebook}
                          placeholder={t(
                            "myStoreTexts.placeHolders.facebook"
                          )}
                          autoCorrect={false}
                          autoCapitalize="none"
                        />
                      </View>
                      <View style={styles.storeSocialInputErrorWrap}>
                        {errors.facebook && touched.facebook && (
                          <Text
                            style={[styles.storeSocialInputError, rtlTextA]}
                          >
                            {errors.facebook}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.storeSocialInputWrap,
                          rtlView,
                          {
                            borderColor: "#30d7f2",
                            backgroundColor: "#30d7f2",
                          },
                        ]}
                      >
                        <View style={styles.socialIconWrap}>
                          <FontAwesome
                            name="twitter"
                            size={20}
                            color={AppColors.white}
                          />
                        </View>
                        <TextInput
                          style={[styles.storeSocialInput, rtlTextA]}
                          onChangeText={handleChange("twitter")}
                          onBlur={() => setFieldTouched("twitter")}
                          value={values.twitter}
                          placeholder={t(
                            "myStoreTexts.placeHolders.twitter"
                          )}
                          autoCorrect={false}
                          autoCapitalize="none"
                        />
                      </View>
                      <View style={styles.storeSocialInputErrorWrap}>
                        {errors.twitter && touched.twitter && (
                          <Text
                            style={[styles.storeSocialInputError, rtlTextA]}
                          >
                            {errors.twitter}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.storeSocialInputWrap,
                          rtlView,
                          {
                            borderColor: "#f50000",
                            backgroundColor: "#f50000",
                          },
                        ]}
                      >
                        <View style={styles.socialIconWrap}>
                          <FontAwesome
                            name="youtube-play"
                            size={20}
                            color={AppColors.white}
                          />
                        </View>
                        <TextInput
                          style={[styles.storeSocialInput, rtlTextA]}
                          onChangeText={handleChange("youtube")}
                          onBlur={() => setFieldTouched("youtube")}
                          value={values.youtube}
                          placeholder={t(
                            "myStoreTexts.placeHolders.youtube"
                          )}
                          autoCorrect={false}
                          autoCapitalize="none"
                        />
                      </View>
                      <View style={styles.storeSocialInputErrorWrap}>
                        {errors.youtube && touched.youtube && (
                          <Text
                            style={[styles.storeSocialInputError, rtlTextA]}
                          >
                            {errors.youtube}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.storeSocialInputWrap,
                          rtlView,
                          {
                            borderColor: "#ee6d17",
                            backgroundColor: "#ee6d17",
                          },
                        ]}
                      >
                        <View style={styles.socialIconWrap}>
                          <FontAwesome
                            name="linkedin"
                            size={20}
                            color={AppColors.white}
                          />
                        </View>
                        <TextInput
                          style={[styles.storeSocialInput, rtlTextA]}
                          onChangeText={handleChange("linkedin")}
                          onBlur={() => setFieldTouched("linkedin")}
                          value={values.linkedin}
                          placeholder={t(
                            "myStoreTexts.placeHolders.linkedin"
                          )}
                          autoCorrect={false}
                          autoCapitalize="none"
                        />
                      </View>
                      <View style={styles.storeSocialInputErrorWrap}>
                        {errors.linkedin && touched.linkedin && (
                          <Text
                            style={[styles.storeSocialInputError, rtlTextA]}
                          >
                            {errors.linkedin}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.updateButtonWrap}>
                      <AppButton
                        title={t(
                          "myStoreTexts.updateStoreButtonTitle"
                        )}
                        onPress={handleSubmit}
                        disabled={
                          !Object.keys(values).length ||
                          (!storeOHTouched && !Object.keys(touched).length) ||
                          !!Object.keys(errors).length ||
                          !!storeUpdateLoading
                        }
                        loading={!!storeUpdateLoading}
                        style={{
                          borderRadius: 5,
                        }}
                      />
                    </View>
                  </View>
                )}
              </Formik>
            </ScrollView>
          </KeyboardAvoidingView>

          <LogoPickerModal />
          <BannerPickerModal />
        </>
      )}
      <FlashNotification
        falshShow={flashNotification}
        flashMessage={flashNotificationMessage}
      />
    </>
  );
};


export default MyStoreScreen;

