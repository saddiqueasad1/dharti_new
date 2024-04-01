import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import CameraButtonIcon from "../../../asset/svgComponents/CameraButtonIcon";
import GalleryButtonIcon from "../../../asset/svgComponents/GalleryButtonIcon";

// Expo Libraries
import * as Location from "expo-location";

// External Libraries
import * as Progress from "react-native-progress";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import { GooglePlacesAutocomplete } from "../../../components/map/GooglePlacesAutocomplete/GooglePlacesAutocomplete";
import { useSelector } from "react-redux";

import { debounce } from "lodash";
import WebView from "react-native-webview";
import mime from "mime";

// Vector Icons
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// Custom Components & Constants
import AppSeparator from "../../../components/AppSeparator";
import AppColors from "../../../utills/AppColors";

import AppButton from "../../../components/AppButton";
import DynamicListPicker from "../../../components/DynamicListPicker";
import ImageInputList from "../../../components/ImageInputList";

import DynamicRadioButton from "../../../components/DynamicRadioButton";
import DynamicCheckbox from "../../../components/DynamicCheckbox";
// import DatePicker from "../../../components/DatePicker";
// import DateRangePicker from "../../../components/DateRangePicker";

import UploadingIndicator from "../../../components/UploadingIndicator";
import ErrorIndicator from "../../../components/ErrorIndicator";
import AppRadioButton from "../../../components/AppRadioButton";
import BHTimePicker from "../../../components/BHTimePicker";
import SBHDatePicker from "../../../components/SBHDatePicker";
import AppTextButton from "../../../components/AppTextButton";
import { miscConfig } from "../../../utills/miscConfig";
import osmApi, { reverseParams } from "../../../backend/osmClient";
import { selectToken, selectUserMeta } from "../../../redux/slices/user";
import { getCurrencySymbol, decodeString } from "../../../utills/helper";
import { ApiManager } from "../../../backend/ApiManager";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { ScreenWrapper,Head } from "../../../components";
const { width: screenWidth } = Dimensions.get("screen");

const EditListingScreen = ({ route, navigation }) => {
  const auth_token = useSelector(selectToken);
  const user = useSelector(selectUserMeta);
  const listing_locations = null;
  const { t } = useTranslation();

  const ios = false;
  const rtl_support = false;
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

  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape({
      name: Yup.string().required(
        t("editListingScreenTexts.formFieldLabels.name") +
          " " +
          t("editListingScreenTexts.formValidation.requiredField")
      ),
      zipcode: Yup.string().min(
        3,
        t("editListingScreenTexts.formFieldLabels.zipCode") +
          " " +
          t("editListingScreenTexts.formValidation.minimumLength3")
      ),
      website: Yup.string().url(
        t("editListingScreenTexts.formValidation.validUrl")
      ),
      address: Yup.string().label(
        t("editListingScreenTexts.formFieldLabels.address")
      ),
      email: Yup.string()
        .required(
          t("editListingScreenTexts.formFieldLabels.email") +
            " " +
            t("editListingScreenTexts.formValidation.requiredField")
        )
        .email(t("editListingScreenTexts.formValidation.validEmail")),
      phone: Yup.string()
        .required(
          t("editListingScreenTexts.formFieldLabels.phone") +
            " " +
            t("editListingScreenTexts.formValidation.requiredField")
        )
        .min(
          5,
          t("editListingScreenTexts.formFieldLabels.phone") +
            " " +
            t("editListingScreenTexts.formValidation.minimumLength5")
        ),
      whatsapp_number: Yup.string().min(
        5,
        t("editListingScreenTexts.formFieldLabels.whatsapp") +
          " " +
          t("editListingScreenTexts.formValidation.minimumLength5")
      ),
      title: Yup.string().required(
        t("editListingScreenTexts.formFieldLabels.title") +
          " " +
          t("editListingScreenTexts.formValidation.requiredField")
      ),
      video_urls: Yup.string().matches(
        "(https?://)(www.)?(youtube.com/watch[?]v=([a-zA-Z0-9_-]{11}))",
        t("editListingScreenTexts.videoUrlErrorLabel")
      ),
    })
  );
  const [loading, setLoading] = useState(true);
  const [validateCfDependency, setValidateCfDependency] = useState([]);
  const [listingData, setListingData] = useState();
  const [imageUris, setImageUris] = useState([]);
  const [imageObjects, setImageObjects] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [sortedImages, setSortedImages] = useState([]);
  const [listingCommonData, setListingCommonData] = useState({});
  const [listingCustomData, setListingCustomData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [customRequiredFields, setCustomRequiredFields] = useState([]);
  const [commonRequiredFields, setCommonRequiredFields] = useState([
    "pricing_type",
    "price_type",
  ]);
  const [touchedFields, setTouchedFields] = useState([]);
  const [customErrorFields, setCustomErrorFields] = useState([]);
  const [commonErrorFields, setCommonErrorFields] = useState([]);
  const [existingImageObjects, setExistingImageObjects] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [hasImage, setHasImage] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [mapType, setMapType] = useState("standard");
  const [region, setRegion] = useState({ latitude: 0, longitude: 0 });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [priceUnitPickerVisible, setPriceUnitPickerVisible] = useState(false);
  const [listingGeoAddress, setListingGeoAddress] = useState("");
  const [hideMap, setHideMap] = useState(false);
  const [geoCoderFail, setGeoCoderFail] = useState(false);
  const [geoCoderFailedMessage, setGeoCoderFailedMessage] = useState(false);
  const [socialProfiles, setSocialProfiles] = useState({});
  const [socialErrors, setSocialErrors] = useState([]);

  const [bHActive, setBHActive] = useState(false);
  const [defaultBH, setDefaultBH] = useState({
    0: { open: false },
    1: { open: false },
    2: { open: false },
    3: { open: false },
    4: { open: false },
    5: { open: false },
    6: { open: false },
  });
  const [defaultSBH, setDefaultSBH] = useState([]);
  const [osmOverlay, setOsmOverlay] = useState(true);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [addingPhoto, setAddingPhoto] = useState(false);

  const mapViewRef = useRef();
  const mapRef = useRef();

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

  const isNumeric = (n) => {
    return n !== "" && !isNaN(parseFloat(n)) && isFinite(n);
  };

  const isEqualToNumber = (v1, v2) => {
    return parseFloat(v1) === parseFloat(v2);
  };

  const isEqualTo = (v1, v2) => {
    return parseString(v1).toLowerCase() === parseString(v2).toLowerCase();
  };

  const containsString = (haystack, needle) => {
    return parseString(haystack).indexOf(parseString(needle)) > -1;
  };
  const matchesPattern = (v1, pattern) => {
    const regexp = new RegExp(parseString(pattern), "gi");
    return parseString(v1).match(regexp);
  };

  const parseString = (str) => {
    return str ? "" + str : "";
  };

  const cfValidated = (rule, cfs) => {
    let isValid = 0;
    const field_id = rule.field;

    const operator = rule.operator;
    const dependFieldArray = cfs ? cfs.filter((_) => _.id == field_id) : [];
    let dependField = dependFieldArray.length ? dependFieldArray[0] : "";
    if (dependField) {
      const dependentFieldValue = listingCustomData["_field_" + field_id] || ""; //TODO

      // Check if filed is exist at custom field object
      if (operator === "==empty") {
        // hasNoValue
        isValid = Array.isArray(dependentFieldValue)
          ? !dependentFieldValue.length
          : !dependentFieldValue;
      } else if (operator === "!=empty") {
        // hasValue  -- ANY value
        isValid = Array.isArray(dependentFieldValue)
          ? !!dependentFieldValue.length
          : !!dependentFieldValue;
      } else if (operator === "==") {
        // equalTo
        if (isNumeric(rule.value)) {
          return isEqualToNumber(rule.value, dependentFieldValue);
        } else {
          return isEqualTo(rule.value, dependentFieldValue);
        }
      } else if (operator === "!=") {
        // notEqualTo
        if (isNumeric(rule.value)) {
          return !isEqualToNumber(rule.value, dependentFieldValue);
        } else {
          return !isEqualTo(rule.value, dependentFieldValue);
        }
      } else if (operator === "==pattern") {
        // patternMatch
        return matchesPattern(dependentFieldValue, rule.value);
      } else if (operator === "==contains") {
        // contains
        return containsString(dependentFieldValue, rule.value);
      }
    }
    isValid = isValid === 0 || isValid === 1 ? !!isValid : isValid;
    return isValid;
  };

  const cfDependencyValidateor = (field, cfs) => {
    if (!field.dependency) {
      return true;
    }
    const con = [];
    field.dependency.map((rules) => {
      const conInner = [];
      rules.map((rule) => {
        conInner.push(cfValidated(rule, cfs));
      });
      con.push(conInner);
    });
    if (con.map((item) => !item.includes(false)).includes(true)) {
      return true;
    }
    return false;
  };

  const initialCFDependencyCheck = (cfs) => {
    const tempCfFieldIds = [];
    if (cfs.length) {
      cfs.map((_cf) => {
        if (cfDependencyValidateor(_cf, cfs)) {
          tempCfFieldIds.push(_cf.id);
        }
      });
    }

    setValidateCfDependency(tempCfFieldIds);
  };

  useEffect(() => {
    if (!listingData) return;
    initialCFDependencyCheck(listingData.custom_fields);
  }, [listingCustomData]);

  //get initial form data call
  useEffect(() => {
    ApiManager.setAuthToken(auth_token);
    ApiManager.get("/listing/form", {
      listing_id: route.params.item.listing_id,
    })
      .then((res) => {
        console.log("res-----");
        console.log(res); 
        if (res) { //raw_price
          setListingData(res);

          if (res.custom_fields.length) {
            const required = res.custom_fields.filter(
              (field) => field.required
            );
            setCustomRequiredFields(required);
          }
          if (res.listing.images.length) {
            const existingImages = res.listing.images
              .map((image) => image.sizes.thumbnail.src)
              .reverse();

            const existingImgObjects = res.listing.images.map((image) => {
              return {
                uri: image.sizes.thumbnail.src,
                id: image.ID,
              };
            });
            setImageUris(existingImages);
            setExistingImageObjects(existingImgObjects);
          } else {
            if (res?.config?.gallery?.image_required) {
              setCommonErrorFields((prevCommonErrorFields) => [
                ...prevCommonErrorFields,
                "gallery",
              ]);
            }
          }
          if (res?.config?.gallery?.image_required) {
            setCommonRequiredFields((prevCommonRequiredFields) => [
              ...prevCommonRequiredFields,
              "gallery",
            ]);
          }
          const customData = {};
          res.custom_fields.map((_field) => {
            if (_field.type === "date") {
              if (["date", "date_time"].includes(_field.date.type)) {
                customData[_field.meta_key] = _field.value;
              } else {
                customData[_field.meta_key] = [
                  _field.value.start,
                  _field.value.end,
                ];
              }
            } else {
              customData[_field.meta_key] = _field.value;
            }
          });
          setListingCustomData(customData);
          const commonData = {};
          res.listing?.pricing_type || "raw_price";
          commonData["price_type"] = res?.listing?.price_type;
          commonData["raw_price"] = res?.listing?.raw_price || "";
          if (res?.listing?.pricing_type === "range") {
            commonData["raw_max_price"] =
              res?.listing?.raw_max_price || "";
          }
          if (res?.listing?.price_unit) {
            commonData["price_unit"] = res?.listing?.price_unit;
          }



          setListingCommonData(commonData);

          if (res?.listing?.social_profiles) {
            setSocialProfiles(res.listing.social_profiles);
          }
          if (res?.config?.bhs) {
            const tempBHObj = res?.listing?.bh;
            if (Object.keys(tempBHObj.bhs).length) {
              setBHActive(true);
              setDefaultBH((prev) => tempBHObj.bhs || prev);
            }
            if (Object.keys(tempBHObj.special_bhs).length) {
              setDefaultSBH(tempBHObj.special_bhs || []);
            }
          }
          initialCFDependencyCheck(res.custom_fields);

          if (
            config.location_type === "geo" &&
            res?.listing?.contact?.geo_address
          ) {
            setListingGeoAddress(decodeString(res.listing.contact.geo_address));
          }
          if (
            parseFloat(res.listing.contact.latitude) &&
            parseFloat(res.listing.contact.longitude)
          ) {
            const coordinates = {
              latitude: parseFloat(res.listing.contact.latitude) || 0,
              longitude: parseFloat(res.listing.contact.longitude) || 0,
            };
            setRegion(coordinates);
            setMarkerPosition(coordinates);
            if ("google" === config.map?.type && config?.map?.api_key) {
              Geocoder.init(config.map.api_key);
            }
          } else {
            setGeoCoderFail(true);
            if ("google" === config.map?.type && config?.map?.api_key) {
              Geocoder.init(config.map.api_key);
            }
          }
          ApiManager.removeAuthToken();
          setLoading(false);
        } else {
          // print error
          // setLoading(false);

          ApiManager.removeAuthToken();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // custom field error validation
  useEffect(() => {
    if (loading) return;
    customFieldErrorValidation();
  }, [listingCustomData, validateCfDependency]);

  // common field error validation
  useEffect(() => {
    if (loading) return;
    commonFieldErrorValidation();
  }, [listingCommonData, commonRequiredFields, imageUris]);

  const customFieldErrorValidation = () => {
    const requiredCF = listingData.custom_fields.filter(
      (field) => field.required && validateCfDependency.includes(field.id)
    );

    if (!requiredCF.length) {
      setCustomErrorFields([]);
      return;
    }

    const customErr = requiredCF.filter((field) => {
      if (field.type === "checkbox") {
        return listingCustomData[field.meta_key].length < 1;
      } else {
        return !listingCustomData[field.meta_key];
      }
    });
    setCustomErrorFields(customErr);
  };

  const handleAddImage = (uri) => {
    setImageUris([uri, ...imageUris]);
    let localUri = uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    const image = {
      uri: localUri,
      name: filename,
      type,
    };
    setImageObjects([image, ...imageObjects].reverse());
  };
  const handleAddMultipleImage = (assets) => {
    if (Array.isArray(assets)) {
      const currentImageCount = imageUris.length + assets.length;
      if (
        listingData?.config?.gallery?.max_image_limit &&
        currentImageCount > listingData.config.gallery.max_image_limit
      ) {
        alert(t("listingFormTexts.maxCountLimitReached"));
        return;
      }
      const tempUris = assets.map((asset) => asset.uri);
      setImageUris([...tempUris, ...imageUris]);
      const tempImages = assets.map((asset) => {
        return {
          uri: asset.uri,
          name: asset.uri.split("/").pop(),
          type: mime.getType(asset.uri),
        };
      });

      setImageObjects([...imageObjects, ...tempImages]).reverse();
    } else {
      handleAddImage(assets);
    }
  };
  const handleRemoveImage = (uri) => {
    setImageUris(imageUris.filter((imageUri) => imageUri !== uri));
    setImageObjects((imageObjects) => [
      ...imageObjects.filter((item) => item.uri !== uri),
    ]);

    const deletedImgId = existingImageObjects.filter(
      (imgObj) => imgObj.uri === uri
    );
    if (deletedImgId.length) {
      setDeletedImageIds((prevDeletedImageIds) => [
        ...prevDeletedImageIds,
        deletedImgId[0].id,
      ]);
    }
    setTouchedFields((prevtouchedFields) =>
      Array.from(new Set([...prevtouchedFields, "gallery"]))
    );
  };
  const handleTextData = (key, value) => {
    const tempData = { ...listingCustomData, [key]: value };
    setListingCustomData((listingCustomData) => tempData);
  };

  const testLogProgressValue = (value) => {
    setUploadProgress(value.loaded / value.total);
  };

  // {* Update Listing *}
  const handleUpdateListing = (values) => {
    
    setSubmitting(true);
    setUpdateLoading(true);

    const tempCFData = { ...listingCustomData };
    Object.keys(listingCustomData).map((_key) => {
      if (
        !validateCfDependency.includes(
          parseInt(_key.replace("_field_", ""), 10)
        )
      ) {
        delete tempCFData[_key];
      }
    });
    const tempValues = { ...values };
    delete tempValues["video_urls"];
    tempValues["video_urls"] = [values.video_urls];

    const data = {
      ["custom_fields"]: tempCFData,
      ...listingCommonData,
      ["price"]: listingCommonData.raw_price,
      ...tempValues,
      ["category_id"]: listingData.listing.categories[0].term_id,
      ["agree"]: 1,
      ["gallery"]: imageObjects,
      ["listing_id"]: listingData.listing.listing_id,
      ["gallery_delete"]: deletedImageIds,
      ["gallery_sort"]: sortedImages,
      ...markerPosition,
      ["social_profiles"]: socialProfiles,
      ["active_bhs"]: bHActive ? 1 : 0,
      ["active_special_bhs"]: defaultSBH.length ? 1 : 0,
      bhs: defaultBH,
      special_bhs: defaultSBH,
    };
    if (listingCommonData?.raw_max_price) {
      data["raw_max_price"] = listingCommonData.raw_max_price;
    }
    if (config.location_type === "geo" && listingGeoAddress) {
      data["geo_address"] = listingGeoAddress;
    }

    ApiManager.setAuthToken(auth_token);
    if (data.gallery.length) {
      setHasImage(true);
      const formData = new FormData();
      Object.keys(data).map((key) => {
        if (key === "custom_fields") {
          Object.keys(data[key]).map((innerKey) => {
            if (Array.isArray(data[key][innerKey])) {
              data[key][innerKey].map((_innerItem) => {
                formData.append(
                  "custom_fields[" + innerKey + "][]",
                  _innerItem
                );
              });
            } else {
              formData.append(
                "custom_fields[" + innerKey + "]",
                data[key][innerKey]
              );
            }
          });
        } else if (key === "bhs" || key === "special_bhs") {
          Object.keys(data[key]).map((innerKey) => {
            const main_key = key + "[" + innerKey + "]";
            const main_value = data[key][innerKey];

            if (main_value && main_value.constructor === {}.constructor) {
              Object.keys(main_value).map((_ik) => {
                const _iv = main_value[_ik];
                if (_ik === "times" && Array.isArray(_iv) && _iv.length) {
                  _iv.map((_iTimesOb, _index) => {
                    if (_iTimesOb.start && _iTimesOb.end) {
                      formData.append(
                        `${main_key}[${_ik}][${_index}][end]`,
                        _iTimesOb.end
                      );
                      formData.append(
                        `${main_key}[${_ik}][${_index}][start]`,
                        _iTimesOb.start
                      );
                    }
                  });
                } else if (_ik === "open") {
                  formData.append(main_key + "[" + _ik + "]", !!_iv);
                } else {
                  formData.append(main_key + "[" + _ik + "]", _iv);
                }
              });
            }
          });
        } else if (data[key] && Array.isArray(data[key])) {
          data[key].length &&
            data[key].map((image) => {
              formData.append(key + "[]", image);
            });
        } else if (data[key] && data[key].constructor === {}.constructor) {
          Object.keys(data[key]).map((innerKey) => {
            formData.append(key + "[" + innerKey + "]", data[key][innerKey]);
          });
        } else {
          formData.append(key, data[key]);
        }
      });
      ApiManager.setMultipartHeader();

      ApiManager.post("listing/form", formData, {
        onUploadProgress: (value) => testLogProgressValue(value),
      }).then((res) => {
        console.log("1110011");
        console.log(res);
        if (res) {
          ApiManager.removeMultipartHeader();
          ApiManager.removeAuthToken();
          setUpdateLoading(false);

          setHasImage(false);
          setSuccess(true);
          // refresh my ads screen
        } else {
          // TODO Error handling
          ApiManager.removeMultipartHeader();
          ApiManager.removeAuthToken();
          setUpdateLoading(false);
          setHasImage(false);
          setError(true);
        }
      });
    } else {
      delete data.gallery;
      ApiManager.post("listing/form", data).then((res) => {
        console.log("000");
        console.log(res);
        if (res) {
          ApiManager.removeAuthToken();
          setUpdateLoading(false);

          setSuccess(true);
          // refresh my ads screen
        } else {
          // TODO Error handling
          ApiManager.removeAuthToken();
          setUpdateLoading(false);

          setError(true);
        }
      });
    }
  };

  const commonFieldErrorValidation = () => {
    const errorData = commonRequiredFields.filter((item) => {
      if (listingCommonData[item]) {
        return false;
      } else {
        if (item === "gallery") {
          return !imageUris.length;
        } else {
          return true;
        }
      }
    });
    console.log("commonFieldErrorValidation");
    console.log(errorData);
    setCommonErrorFields(errorData);
  };

  const handleDateTime = (payLoad, field) => {
    setListingCustomData((prevListingCustomData) => {
      return {
        ...prevListingCustomData,
        [field.meta_key]: moment(payLoad).format(field.date.jsFormat),
      };
    });
    setTouchedFields((prevtouchedFields) =>
      Array.from(new Set([...prevtouchedFields, field.meta_key]))
    );
  };

  const handleDateTimeRange = (type, payLoad, field) => {
    if (type === "start") {
      const newRangeStart = [
        moment(payLoad).format(field.date.jsFormat),
        listingCustomData[field.meta_key]
          ? listingCustomData[field.meta_key][1]
            ? listingCustomData[field.meta_key][1]
            : moment(payLoad).format(field.date.jsFormat)
          : moment(payLoad).format(field.date.jsFormat),
      ];
      setListingCustomData((prevListingCustomData) => {
        return { ...prevListingCustomData, [field.meta_key]: newRangeStart };
      });
    } else {
      const newRangeEnd = [
        listingCustomData[field.meta_key]
          ? listingCustomData[field.meta_key][0]
            ? listingCustomData[field.meta_key][0]
            : moment(payLoad).format(field.date.jsFormat)
          : moment(payLoad).format(field.date.jsFormat),
        moment(payLoad).format(field.date.jsFormat),
      ];
      setListingCustomData((prevListingCustomData) => {
        return { ...prevListingCustomData, [field.meta_key]: newRangeEnd };
      });
    }
    setTouchedFields((prevtouchedFields) =>
      Array.from(new Set([...prevtouchedFields, field.meta_key]))
    );
  };

  const handleImageReorder = (data) => {
    setImageUris(data);

    const sorted = data.map((uri) => {
      const temp = existingImageObjects.filter((obj) => obj.uri === uri)[0];
      if (temp) {
        return temp.id;
      } else {
        return uri.split("/").pop();
      }
    });
    setSortedImages(sorted.reverse());
  };

  const handleEventOnAnimationDone = () => {
    setSubmitting(false);
    navigation.goBack();
  };

  const updatePriceType = (item) => {
    setListingCommonData((prevListingCommonData) => {
      return {
        ...prevListingCommonData,
        ["price_type"]: item.id,
      };
    });

    if (item.id === "on_call") {
      const tempComReqFlds = commonRequiredFields.filter(
        (field) => !["raw_price", "raw_max_price"].includes(field)
      );
      setCommonRequiredFields(tempComReqFlds);
    } else {
      if (
        listingCommonData.pricing_type === "range" &&
        !listingData.config.hidden_fields.includes("pricing_type")
      ) {
        const tempComReqFlds = Array.from(
          new Set([...commonRequiredFields, "raw_price", "raw_max_price"])
        );
        setCommonRequiredFields(tempComReqFlds);
      }
      if (listingCommonData.pricing_type === "raw_price") {
        const tempComReqFlds = Array.from(
          new Set([...commonRequiredFields, "raw_price"])
        );
        setCommonRequiredFields(tempComReqFlds);
      }
    }
    setTouchedFields((prevTouchedFields) =>
      Array.from(new Set([...prevTouchedFields, "price_type"]))
    );
  };

  const updatePricingType = (item) => {
    setListingCommonData((prevListingCommonData) => {
      return {
        ...prevListingCommonData,
        ["pricing_type"]: item.id,
      };
    });

    if (item.id === "disabled") {
      const tempComReqFlds = commonRequiredFields.filter(
        (field) => !["raw_price", "raw_max_price", "price_type"].includes(field)
      );
      setCommonRequiredFields(tempComReqFlds);
    } else {
      if (item.id === "raw_price") {
        const tempComReqFlds = Array.from(
          new Set([...commonRequiredFields, "raw_price"])
        ).filter((field) => field !== "raw_max_price");

        setCommonRequiredFields(tempComReqFlds);
        if (Object.keys(listingCommonData).includes("raw_max_price")) {
          delete listingCommonData.raw_max_price;
        }
      }
      if (item.id === "range") {
        const tempComReqFields = Array.from(
          new Set([...commonRequiredFields, "raw_price", "raw_max_price"])
        );
        setCommonRequiredFields(tempComReqFields);
      }
    }
    setTouchedFields((prevTouchedFields) =>
      Array.from(new Set([...prevTouchedFields, "pricing_type"]))
    );
  };

  const handleMapTypeChange = () => {
    if (mapType == "standard") {
      setMapType("hybrid");
    } else {
      setMapType("standard");
    }
  };

  const handleMarkerReleaseEvent = (coords, func) => {
    setLocationLoading(true);
    setRegion(coords);
    setMarkerPosition(coords);

    if ("google" === config?.map?.type) {
      Geocoder.from(coords.latitude, coords.longitude)
        .then((json) => {
          var addressComponent = json?.results[0]?.formatted_address || "";
          if (config.location_type === "local") {
            func("address", decodeString(addressComponent));

            const postalCode =
              json?.results[0]?.address_components?.filter(
                (comp) => comp?.types?.includes("postal_code") || ""
              ) || "";

            func("zipcode", postalCode[0].long_name);
          } else {
            if (addressComponent) {
              setListingGeoAddress(decodeString(addressComponent));
            }
          }
        })
        .catch((error) => {
          console.warn(error);
          if (error.origin.status === "REQUEST_DENIED") {
            setGeoCoderFailedMessage(error.origin.error_message);
            setGeoCoderFail(true);
            setLoading(false);
          }
          // TODO  display error
        })
        .then(() => {
          setLocationLoading(false);
        });
    } else {
      const params = reverseParams({
        lat: coords.latitude,
        lon: coords.longitude,
      });
      osmApi
        .get("reverse", params)
        .then((res) => {
          if (res) {
            const addressComponent = res?.display_name;
            if (config.location_type === "local") {
              if (addressComponent) {
                func("address", addressComponent);
              }
              if (res?.address?.postcode) {
                func("zipcode", res.address.postcode);
              } else {
                func("zipcode", "");
              }
            } else {
              if (addressComponent) {
                setListingGeoAddress(addressComponent);
              }
            }
          }
        })
        .then(() => {
          setLocationLoading(false);
        });
    }
  };

  const handleGetDeviceLocation = (func) => {
    setLocationLoading(true);
    getLocationPermissionAsync(func);
  };

  const getLocationPermissionAsync = async (func) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Need to enable Location permission to use this feature");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});

    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setMarkerPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (config?.map?.type === "google") {
      Geocoder.from(location.coords.latitude, location.coords.longitude)
        .then((json) => {
          var addressComponent = json.results[0].formatted_address;
          if (config.location_type === "local") {
            if (addressComponent) {
              func("address", addressComponent);
            } else {
              func("address", "");
            }
            const postalCode = json.results[0].address_components.filter(
              (comp) => comp.types.includes("postal_code")
            );
            if (postalCode.length) {
              func("zipcode", postalCode[0].long_name);
            } else {
              func("zipcode", "");
            }
          } else {
            if (addressComponent) {
              setListingGeoAddress(addressComponent);
            }
          }
        })
        .catch((error) => {
          console.warn(error);
          // TODO  display error
        })
        .then(() => {
          setLocationLoading(false);
        });
    } else {
      const params = reverseParams({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
      osmApi
        .get("reverse", params)
        .then((res) => {
          if (res) {
            const addressComponent = res?.display_name;
            if (config.location_type === "local") {
              if (addressComponent) {
                func("address", addressComponent);
              } else {
                func("address", "");
              }

              if (res?.address?.postcode) {
                func("zipcode", res.address.postcode);
              } else {
                func("zipcode", "");
              }
            } else {
              if (addressComponent) {
                setListingGeoAddress(addressComponent);
              }
            }
          }
        })
        .then(() => {
          setLocationLoading(false);
        });
    }

    setLocationLoading(false);
  };

  const handleReGeocoding = (values, payload) => {
    let geoAddress = [];
    if (payload.address) {
      geoAddress.push(payload.address);
    } else {
      geoAddress.push(values.address);
    }
    if (payload.zipcode) {
      geoAddress.push(payload.zipcode);
    } else {
      geoAddress.push(values.zipcode);
    }
    if (
      config.location_type === "local" &&
      listingData.listing.contact.locations.length
    ) {
      listingData.listing.contact.locations
        .reverse()
        .map((_location) => geoAddress.push(_location.name));
    }
    geoAddress = geoAddress.length ? decodeString(geoAddress.join(", ")) : "";
    handleGetGeoLatLng(geoAddress);
  };

  const handleGetGeoLatLng = useCallback(
    debounce((data) => {
      setLocationLoading(true);

      Geocoder.from(data)
        .then((json) => {
          var location = json.results[0].geometry.location;
          const position = {
            latitude: location.lat,
            longitude: location.lng,
          };
          setRegion(position);
          setMarkerPosition(position);
          setLocationLoading(false);
        })
        .catch((error) => {
          if (error.origin.status === "REQUEST_DENIED") {
            setGeoCoderFailedMessage(error.origin.error_message);
            setGeoCoderFail(true);
            setLoading(false);
          }
          setLocationLoading(false);
          // TODO : error notice
        });
    }, 1000),
    []
  );

  const getUserName = () => {
    if (!!user.first_name || !!user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (!!user.username) {
      return user.username;
    }
  };

  const handleGalleryTouched = () => {
    setTouchedFields((prevtouchedFields) =>
      Array.from(new Set([...prevtouchedFields, "gallery"]))
    );
  };

  const handleSclPrflFldValue = (text, profile) => {
    const tmpSclPrfls = { ...socialProfiles, [profile.id]: text.trim() };
    setSocialProfiles(tmpSclPrfls);
    socialProfileValidation(text.trim(), profile.id);
  };

  const socialProfileValidation = useCallback(
    debounce((text, profile) => {
      let url = text;
      if (url.length > 0) {
        const valid =
          /((http|https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/.test(
            url
          );
        if (valid) {
          const tempErr = socialErrors.filter((_err) => _err !== profile);
          setSocialErrors(tempErr);
        } else {
          setSocialErrors((prevSocialErrors) =>
            Array.from(new Set([...prevSocialErrors, profile]))
          );
        }
      } else {
        const tempErr = socialErrors.filter((_err) => _err !== profile);
        setSocialErrors(tempErr);
      }
    }, 500),
    []
  );

  const handleBHToggle = () => {
    setBHActive((prevBHActive) => !prevBHActive);
  };

  const BHComponent = ({ day, dayName }) => (
    <View style={[styles.bHDayWrap, rtlView]}>
      <View
        style={[
          styles.bHDayLeftWrap,
          { alignItems: rtl_support ? "flex-end" : "flex-start" },
        ]}
      >
        <Text style={[styles.bHDayName, rtlText]} numberOfLines={1}>
          {dayName}
        </Text>
      </View>
      <View
        style={[
          styles.bHDayRightWrap,
          { alignItems: rtl_support ? "flex-end" : "flex-start" },
        ]}
      >
        <TouchableOpacity
          style={[styles.openButtonWrap, rtlView]}
          onPress={() => handleBHDayOpenBtnPress(day)}
        >
          <MaterialCommunityIcons
            name={
              defaultBH[day].open ? "checkbox-marked" : "checkbox-blank-outline"
            }
            size={24}
            color={AppColors.primary}
          />
          <Text style={[styles.text, rtlText]}>
            {t("listingFormTexts.bHOpenBtnTitle")}
          </Text>
        </TouchableOpacity>
        {defaultBH[day].open && (
          <>
            <TouchableOpacity
              style={[styles.timeSlotToggleBtnWrap, rtlView]}
              onPress={() => handletimeSlotToggleBtnPress(day)}
            >
              <MaterialCommunityIcons
                name={
                  !!defaultBH[day]?.times
                    ? "checkbox-marked"
                    : "checkbox-blank-outline"
                }
                size={24}
                color={AppColors.primary}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.text, rtlTextA]}>
                  {t("listingFormTexts.timeSlotToggleButton")}
                </Text>
              </View>
            </TouchableOpacity>
            {!!defaultBH[day]?.times && (
              <View style={[styles.timeSlotsWrap, { width: "100%" }]}>
                {defaultBH[day].times.map((_slot, index, arr) => (
                  <View style={[styles.timeSlot, rtlView]} key={index}>
                    <View
                      style={[
                        styles.timeSltStartWrap,
                        {
                          marginRight: rtl_support ? 0 : 10,
                          marginLeft: rtl_support ? 10 : 0,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.bHDayName,
                          { marginBottom: 5 },
                          rtlTextA,
                        ]}
                      >
                        {t("listingFormTexts.timeSlotStartTitle")}
                      </Text>
                      <View style={styles.slotTimeWrap}>
                        <BHTimePicker
                          value={moment(_slot.start, "HH:mm").format(
                            config.datetime_fmt.time
                          )}
                          type="start"
                          day={day}
                          onSelectTime={handleBHTimePickerEvent}
                          serial={index}
                          is12hr={
                            config.store?.time_options?.showMeridian ?? true
                          }
                        />
                      </View>
                    </View>
                    <View style={styles.timeSltEndWrap}>
                      <Text
                        style={[
                          styles.bHDayName,
                          { marginBottom: 5 },
                          rtlTextA,
                        ]}
                      >
                        {t("listingFormTexts.timeSlotEndTitle")}
                      </Text>
                      <View style={styles.slotTimeWrap}>
                        <BHTimePicker
                          value={moment(_slot.end, "HH:mm").format(
                            config.datetime_fmt.time
                          )}
                          type="end"
                          day={day}
                          onSelectTime={handleBHTimePickerEvent}
                          serial={index}
                          is12hr={
                            config.store?.time_options?.showMeridian ?? true
                          }
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.btnWrap,
                        {
                          paddingLeft: rtl_support ? 0 : 10,
                          paddingRight: rtl_support ? 10 : 0,
                        },
                        rtlView,
                      ]}
                    >
                      {arr.length > 1 && (
                        <TouchableOpacity
                          style={[styles.sltDltBtn, { flex: 0.5 }]}
                          onPress={() => handleTimeSltDlt(day, index)}
                        >
                          <FontAwesome
                            name="minus-circle"
                            size={20}
                            color={AppColors.primary}
                          />
                        </TouchableOpacity>
                      )}

                      {index === arr.length - 1 && (
                        <TouchableOpacity
                          style={[styles.sltAddBtn, { flex: 0.5 }]}
                          onPress={() => handleTimeSltAdd(day, index)}
                        >
                          <FontAwesome
                            name="plus-circle"
                            size={20}
                            color={AppColors.primary}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );

  const handleBHDayOpenBtnPress = (day) => {
    const tempBHDay = { ...defaultBH[day], open: !defaultBH[day].open };
    if (!tempBHDay.open) {
      delete tempBHDay.times;
    }
    setDefaultBH({ ...defaultBH, [day]: tempBHDay });
  };

  const handletimeSlotToggleBtnPress = (day) => {
    const format = config.datetime_fmt.time || "h:mm a";
    const tempTimeSlot = {
      start: moment("8:00 am", "h:mm a").format(format),
      end: moment("8:00 pm", "h:mm a").format(format),
    };
    let tempBHDay = { ...defaultBH[day] };
    if (!!tempBHDay?.times) {
      delete tempBHDay.times;
    } else {
      tempBHDay["times"] = [tempTimeSlot];
    }
    setDefaultBH({ ...defaultBH, [day]: tempBHDay });
  };

  const handleTimeSltAdd = (day) => {
    const format = config.datetime_fmt.time || "h:mm a";
    const tempTimeSlot = {
      start: moment("8:00 am", "h:mm a").format(format),
      end: moment("8:00 pm", "h:mm a").format(format),
    };
    const tempBHDay = {
      ...defaultBH[day],
      times: [...defaultBH[day].times, tempTimeSlot],
    };
    const tempBH = { ...defaultBH, [day]: tempBHDay };
    setDefaultBH(tempBH);
  };

  const handleTimeSltDlt = (day, index) => {
    const tempTimes = defaultBH[day].times.filter(
      (_timeSlots, _index) => _index !== index
    );

    const tempBH = {
      ...defaultBH,
      [day]: {
        ...defaultBH[day],
        times: tempTimes,
      },
    };
    setDefaultBH(tempBH);
  };

  const handleBHTimePickerEvent = (day, type, payload, serial) => {
    const format = config.datetime_fmt.time || "h:mm a";

    let tempBHDay = { ...defaultBH[day] };
    let tempTimeSlts = [...defaultBH[day].times];
    let temptimeSlt = { ...defaultBH[day].times[serial] };

    if (type === "start") {
      temptimeSlt["start"] = moment(payload).format(format);
    } else {
      temptimeSlt["end"] = moment(payload).format(format);
    }
    tempTimeSlts[serial] = temptimeSlt;
    tempBHDay["times"] = tempTimeSlts;

    setDefaultBH({ ...defaultBH, [day]: tempBHDay });
  };

  const SBHComponent = ({ specialDay, dataArray }) => (
    <View
      style={[
        styles.bHDayWrap,
        { alignItems: defaultSBH[specialDay].open ? "flex-start" : "center" },
        rtlView,
      ]}
    >
      <View
        style={{
          borderRadius: 2,
          borderWidth: 1,
          borderColor: AppColors.gray,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <View style={{ padding: 5 }}>
          <SBHDatePicker
            day={specialDay}
            onSelectDate={handleSBHDateEvent}
            value={defaultSBH[specialDay].date}
          />
        </View>
      </View>
      <View style={styles.bHDayRightWrap}>
        <View
          style={{
            paddingLeft: rtl_support ? 0 : 5,
            paddingRight: rtl_support ? 5 : 0,
          }}
        >
          <View
            style={{
              flexDirection: rtl_support ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={[styles.openButtonWrap, { flex: 1 }, rtlView]}
              onPress={() => handleSBHDayOpenBtnPress(specialDay)}
            >
              <MaterialCommunityIcons
                name={
                  defaultSBH[specialDay].open
                    ? "checkbox-marked"
                    : "checkbox-blank-outline"
                }
                size={24}
                color={AppColors.primary}
              />
              <Text style={[styles.text, rtlText]}>
                {t("listingFormTexts.bHOpenBtnTitle")}
              </Text>
            </TouchableOpacity>

            {dataArray.length > 1 && (
              <TouchableOpacity
                style={[styles.sltDltBtn, { marginHorizontal: 10 }]}
                onPress={() => handleSpecialDayDlt(specialDay)}
              >
                <FontAwesome
                  name="minus-circle"
                  size={20}
                  color={AppColors.primary}
                />
              </TouchableOpacity>
            )}

            {specialDay === dataArray.length - 1 && (
              <TouchableOpacity
                style={[styles.sltAddBtn, {}]}
                onPress={() => handleSpecialDayAdd()}
              >
                <FontAwesome
                  name="plus-circle"
                  size={20}
                  color={AppColors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
          {defaultSBH[specialDay].open && (
            <View style={{ width: "100%" }}>
              <TouchableOpacity
                style={[styles.timeSlotToggleBtnWrap, rtlView]}
                onPress={() => handleSBHtimeSlotToggleBtnPress(specialDay)}
              >
                <MaterialCommunityIcons
                  name={
                    !!defaultSBH[specialDay]?.times
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={24}
                  color={AppColors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text, rtlTextA]}>
                    {t("listingFormTexts.timeSlotToggleButton")}
                  </Text>
                </View>
              </TouchableOpacity>
              {!!defaultSBH[specialDay]?.times && (
                <View style={[styles.timeSlotsWrap, { width: "100%" }]}>
                  {defaultSBH[specialDay].times.map((_slot, index, arr) => (
                    <View style={[styles.timeSlot, rtlView]} key={index}>
                      <View
                        style={[
                          styles.timeSltStartWrap,
                          {
                            marginRight: rtl_support ? 0 : 10,
                            marginLeft: rtl_support ? 10 : 0,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bHDayName,
                            { marginBottom: 5 },
                            rtlText,
                          ]}
                        >
                          {t("listingFormTexts.timeSlotStartTitle")}
                        </Text>

                        <View style={styles.slotTimeWrap}>
                          <BHTimePicker
                            value={moment(_slot.start, "HH:mm").format(
                              config.datetime_fmt.time
                            )}
                            type="start"
                            day={specialDay}
                            onSelectTime={handleSBHTimePickerEvent}
                            serial={index}
                            is12hr={
                              config.store?.time_options?.showMeridian ?? true
                            }
                          />
                        </View>
                      </View>
                      <View style={styles.timeSltEndWrap}>
                        <Text
                          style={[
                            styles.bHDayName,
                            { marginBottom: 5 },
                            rtlText,
                          ]}
                        >
                          {t("listingFormTexts.timeSlotEndTitle")}
                        </Text>

                        <View style={styles.slotTimeWrap}>
                          <BHTimePicker
                            value={moment(_slot.end, "HH:mm").format(
                              config.datetime_fmt.time
                            )}
                            type="end"
                            day={specialDay}
                            onSelectTime={handleSBHTimePickerEvent}
                            serial={index}
                            is12hr={
                              config.store?.time_options?.showMeridian ?? true
                            }
                          />
                        </View>
                      </View>
                      <View style={styles.btnWrap}>
                        {arr.length > 1 && (
                          <TouchableOpacity
                            style={[styles.sltDltBtn, { flex: 0.5 }]}
                            onPress={() =>
                              handleSpecialTimeSltDlt(specialDay, index)
                            }
                          >
                            <FontAwesome
                              name="minus-circle"
                              size={20}
                              color={AppColors.primary}
                            />
                          </TouchableOpacity>
                        )}

                        {index === arr.length - 1 && (
                          <TouchableOpacity
                            style={[styles.sltAddBtn, { flex: 0.5 }]}
                            onPress={() =>
                              handleSpecialTimeSltAdd(specialDay, index)
                            }
                          >
                            <FontAwesome
                              name="plus-circle"
                              size={20}
                              color={AppColors.primary}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const handleSBHDateEvent = (day, payload) => {
    const format = config.datetime_fmt.date || "MMMM D, YYYY";
    const tempSBHDayObj = {
      ...defaultSBH[day],
      date: moment(payload).format(format),
    };

    let tempSBHs = [...defaultSBH];
    tempSBHs[day] = tempSBHDayObj;
    setDefaultSBH(tempSBHs);
  };

  const handleSBHToggle = () => {
    if (defaultSBH.length) {
      setDefaultSBH([]);
    } else {
      setDefaultSBH([
        {
          open: false,
          date: moment(new Date()).format(
            config.datetime_fmt.date || "MMMM D, YYYY"
          ),
        },
      ]);
    }
  };

  const handleSBHDayOpenBtnPress = (index) => {
    const tempSBHObj = { ...defaultSBH[index], open: !defaultSBH[index].open };
    let tempSBHs = [...defaultSBH];
    tempSBHs[index] = tempSBHObj;
    setDefaultSBH(tempSBHs);
  };

  const handleSBHtimeSlotToggleBtnPress = (index) => {
    const format = config.datetime_fmt.time || "h:mm a";

    const tempTimeSlot = {
      start: moment(new Date()).format(format),
      end: moment(new Date()).format(format),
    };
    let tempSBHObj = { ...defaultSBH[index] };
    if (!!tempSBHObj?.times) {
      delete tempSBHObj.times;
    } else {
      tempSBHObj["times"] = [tempTimeSlot];
    }
    let tempSBHs = [...defaultSBH];
    tempSBHs[index] = tempSBHObj;
    setDefaultSBH(tempSBHs);
  };

  const handleSpecialTimeSltAdd = (specialDay) => {
    const format = config.datetime_fmt.time || "h:mm a";
    const tempTimeSlot = {
      start: moment(new Date()).format(format),
      end: moment(new Date()).format(format),
    };

    const tempSBHOBJ = {
      ...defaultSBH[specialDay],
      times: [...defaultSBH[specialDay].times, tempTimeSlot],
    };
    let tempSBH = [...defaultSBH];
    tempSBH[specialDay] = tempSBHOBJ;
    setDefaultSBH(tempSBH);
  };

  const handleSpecialTimeSltDlt = (specialDay, index) => {
    const tempTimes = defaultSBH[specialDay].times.filter(
      (_timeSlt, _index) => _index !== index
    );
    let tempSBH = [...defaultSBH];
    tempSBH[specialDay] = { ...defaultSBH[specialDay], times: tempTimes };
    setDefaultSBH(tempSBH);
  };

  const handleSpecialDayAdd = () => {
    setDefaultSBH((prevSBH) => [
      ...prevSBH,
      {
        open: false,
        date: moment(new Date()).format(
          config.datetime_fmt.date || "MMMM D, YYYY"
        ),
      },
    ]);
  };

  const handleSpecialDayDlt = (specialDay) => {
    const tempSBH = defaultSBH.filter((_sbh, index) => index !== specialDay);
    setDefaultSBH(tempSBH);
  };

  const handleSBHTimePickerEvent = (day, type, payload, serial) => {
    const format = config.datetime_fmt.time || "h:mm a";

    let tempSBHDay = { ...defaultSBH[day] };
    let tempTimeSlts = [...defaultSBH[day].times];
    let temptimeSlt = { ...defaultSBH[day].times[serial] };
    let tempSBH = [...defaultSBH];

    if (type === "start") {
      temptimeSlt["start"] = moment(payload).format(format);
    } else {
      temptimeSlt["end"] = moment(payload).format(format);
    }
    tempTimeSlts[serial] = temptimeSlt;
    tempSBHDay["times"] = tempTimeSlts;
    tempSBH[day] = tempSBHDay;

    setDefaultSBH(tempSBH);
  };

  const html_script = `
<!DOCTYPE html>
<html>
<head>
	<title>Quick Start - Leaflet</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="initial-scale=1.0">
	<link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>	
</head>
<body style="padding: 0; margin: 0">
<div id="map" style="width: 100%; height: 100vh;"></div>
<script>
var osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);
var map = L.map('map', {
  zoom: 10,
  maxZoom: 18,
  center: [${region.latitude || config?.map?.center?.lat || 0}, ${
    region.longitude || config?.map?.center?.lng || 0
  }],
  layers: [osmLayer],
});
const marker = L.marker([${
    markerPosition.latitude || config?.map?.center?.lat || 0
  }, ${
    markerPosition.longitude || config?.map?.center?.lng || 0
  }], {  draggable: true, autoPan: true  }).addTo(map);
  marker.on("dragend", function () {
      var latLng = marker.getLatLng();
      window.ReactNativeWebView.postMessage(JSON.stringify(latLng));
  });
  marker.setPopupContent("Address jhfashf asdjhfskjhdfk").openPopup();  
</script>
</body>
</html>
`;

  const requestGalleryParmission = async () => {
    setAddingPhoto(true);
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert(t("imageInputTexts.ifImageLibraryPermissionDenied"));
      setAddingPhoto(false);
    } else {
      handleSelectGalleryImage();
    }
  };
  const requestCameraParmission = async () => {
    setAddingPhoto(true);
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      alert(t("imageInputTexts.ifCameraPermissionDenied"));
      setAddingPhoto(false);
    } else {
      handleSelectCameraImage();
    }
  };
  const handleSelectGalleryImage = async () => {
    if (Platform.OS === "android") {
      setPhotoModalVisible(false);
      setAddingPhoto(false);
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: miscConfig?.allowMultipleImageSelection
          ? false
          : miscConfig?.allowImageEditing || false,
        quality: 0.8,
        allowsMultipleSelection:
          miscConfig?.allowMultipleImageSelection || false,
      });
      console.log("----0000---000--000-");
      console.log(JSON.stringify(result, null, 2));
      if (!result.canceled) {
        if (miscConfig?.allowMultipleImageSelection) {
          handleAddMultipleImage(result.assets);
        } else {
          handleAddImage(result.assets[0].uri);
        }
        if (ios) {
          setPhotoModalVisible(false);
          setAddingPhoto(false);
        }
      }
    } catch (error) {
      // TODO add error storing
      setPhotoModalVisible((prevPMV) => !prevPMV);
      setAddingPhoto(false);
    }
  };
  const handleSelectCameraImage = async () => {
    if (Platform.OS === "android") {
      setPhotoModalVisible((prevPMV) => !prevPMV);
      setAddingPhoto(false);
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });
      if (!result.canceled) {
        handleAddImage(result.assets[0].uri);
        if (ios) {
          setPhotoModalVisible(false);
          setAddingPhoto(false);
        }
      }
    } catch (error) {
      // TODO add error storing
      setPhotoModalVisible((prevPMV) => !prevPMV);
      setAddingPhoto(false);
    }
  };
  return (

    <ScreenWrapper
    headerUnScrollable={() => (
      <Head headtitle={t("editListingScreenTexts.title")} navigation={navigation} />
    )}
    scrollEnabled={false}
  >
    <>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={AppColors.primary} />
        </View>
      )}
      {submitting && (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          {((!!uploadProgress && !success && !error) ||
            (!uploadProgress && !success && !error)) && (
            <View style={{ height: 150, width: 150 }}>
              <UploadingIndicator />
            </View>
          )}
          {!!success && !error && (
            <View
              style={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../asset/images/success.png")}
                style={{
                  width: screenWidth * 0.5,
                  resizeMode: "contain",
                }}
              />
              <View style={{ alignItems: "center", paddingHorizontal: "5%" }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: AppColors.text_dark,
                    marginBottom: 15,
                  }}
                >
                  {t("listingFormTexts.successTitle")}
                </Text>
                <Text style={{ color: AppColors.text_gray }}>
                  {t("listingFormTexts.successMessage")}
                </Text>
              </View>
              <View style={{ width: "85%", paddingTop: 20 }}>
                <AppButton
                  title={t("listingFormTexts.goBackBtnTitle")}
                  onPress={handleEventOnAnimationDone}
                />
              </View>
            </View>
          )}
          {!success && !!error && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: screenWidth,
                height: screenWidth,
              }}
            >
              <ErrorIndicator visible={true} />
              <View style={{ position: "absolute", bottom: "30%" }}>
                <Text style={[styles.text, rtlText]}>
                  {t("editListingScreenTexts.uploadErrorNotice")}
                </Text>
              </View>
            </View>
          )}
          {uploadProgress < 1 && hasImage && !success && !error && (
            <Progress.Bar
              progress={uploadProgress}
              width={200}
              color={AppColors.primary}
            />
          )}

          {((uploadProgress < 1 && !success && hasImage && !error) ||
            (!success && !hasImage && !error)) && (
            <Text
              style={[
                {
                  fontSize: 15,
                  color: AppColors.text_gray,
                  textAlign: "center",
                  marginTop: 25,
                },
                rtlText,
              ]}
            >
              {t("editListingScreenTexts.uploadingNotice")}
            </Text>
          )}

          {!!error && (
            <View
              style={{
                position: "absolute",
                bottom: 20,
              }}
            >
              <AppButton
                title={t("editListingScreenTexts.buttonTitles.tryAgain")}
                onPress={() => setSubmitting(false)}
              />
            </View>
          )}
        </View>
      )}
      {!loading && !submitting && (
        <KeyboardAvoidingView
          behavior={ios ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "#F8F8F8" }}
          keyboardVerticalOffset={80}
        >
          <ScrollView scrollEnabled={osmOverlay}>
            <View style={styles.container}> 
              
              <View style={styles.mainWrap}>
                <View style={styles.formFieldsWrap}>
                  {/* Image Input Component */}
                  {listingData.config.gallery && (
                    <View style={styles.imageInputWrap}>
                      <View style={styles.imageInputTitleWrap}>
                        <Text style={[styles.imageInputLabel, rtlTextA]}>
                          {t(
                            "editListingScreenTexts.formFieldLabels.imageInput"
                          )}
                          {commonRequiredFields.includes("gallery") && (
                            <Text style={styles.required}> *</Text>
                          )}
                        </Text>
                      </View>
                      <View style={styles.imageInputNotes}>
                        {listingData.config.gallery.max_image_limit && (
                          <Text style={[styles.imageInputNotesText, rtlTextA]}>
                            {t("editListingScreenTexts.maxImageCount")}
                            {listingData.config.gallery.max_image_limit}
                            {t("editListingScreenTexts.images")}
                          </Text>
                        )}
                        {listingData.config.gallery.max_image_limit > 1 && (
                          <Text style={[styles.imageInputNotesText, rtlTextA]}>
                            {t("editListingScreenTexts.dragAndSort")}
                          </Text>
                        )}
                      </View>
                      <View style={styles.view}>
                        {/* <TouchableOpacity
                          style={{ alignItems: "center", paddingHorizontal: 5 }}
                          onPress={() => {
                            if (
                              imageUris.length >=
                              listingData.config.gallery.max_image_limit
                            ) {
                              alert(
                                t("editListingScreenTexts.maxImageWarning")
                              );
                            } else {
                              setPhotoModalVisible(true);
                            }
                          }}
                          disabled={photoModalVisible}
                        >
                          <View
                            style={{
                              backgroundColor: AppColors.primary,
                              height: 50,
                              width: 50,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 25,
                            }}
                          >
                            {photoModalVisible ? (
                              <ActivityIndicator
                                color={AppColors.white}
                                size="small"
                              />
                            ) : (
                              <AntDesign
                                name="plus"
                                size={28}
                                color={AppColors.white}
                              />
                            )}
                          </View>

                          <View style={{ paddingTop: 5 }}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: AppColors.text_light,
                              }}
                            >
                              {!listingData.config.gallery.max_image_limit ||
                              listingData.config.gallery.max_image_limit == 1
                                ? t("imageInputListTexts.addPhotoButtonTitle")
                                : t("imageInputListTexts.addPhotosButtonTitle")}
                            </Text>
                          </View>
                        </TouchableOpacity> */}
                      </View>
                      <ImageInputList
                        imageUris={imageUris}
                        onAddImage={
                          miscConfig?.allowMultipleImageSelection
                            ? handleAddMultipleImage
                            : handleAddImage
                        }
                        onRemoveImage={handleRemoveImage}
                        maxCount={listingData.config.gallery.max_image_limit}
                        reorder={handleImageReorder}
                        handleTouch={handleGalleryTouched}
                      />
                      <View
                        style={[
                          styles.inputFieldErrorWrap,
                          {
                            marginHorizontal: "3%",
                            alignItems: "center",
                            justifyContent: "center",
                          },
                        ]}
                      >
                        {commonErrorFields.includes("gallery") &&
                          touchedFields.includes("gallery") && (
                            <Text
                              style={[styles.inputFieldErrorMessage, rtlTextA]}
                            >
                              {t(
                                "editListingScreenTexts.imageFieldCustomError"
                              )}
                            </Text>
                          )}
                      </View>
                    </View>
                  )}

                  <Formik
                    initialValues={{
                      title: listingData?.listing?.title
                        ? decodeString(listingData.listing.title)
                        : "",

                      description: listingData?.listing?.description
                        ? decodeString(listingData.listing.description)
                        : "",
                      name: user ? getUserName() : "",
                      zipcode:
                        listingData?.listing?.contact?.zipcode ||
                        user?.zipcode ||
                        "",
                      address: listingData.listing.contact.address
                        ? decodeString(listingData.listing.contact.address)
                        : user.address
                        ? decodeString(user.address)
                        : "",
                      phone:
                        listingData?.listing?.contact?.phone ||
                        user?.phone ||
                        "",
                      whatsapp_number: listingData.listing.contact
                        .whatsapp_number
                        ? listingData.listing.contact.whatsapp_number
                        : user.whatsapp_number
                        ? user.whatsapp_number
                        : "",
                      email: listingData.listing.contact.email
                        ? listingData.listing.contact.email
                        : user.email
                        ? user.email
                        : "",
                      website: listingData.listing.contact.website
                        ? listingData.listing.contact.website
                        : user.website
                        ? user.website
                        : "",
                      video_urls: listingData?.listing?.video_urls
                        ? listingData?.listing?.video_urls[0]
                        : "" || "",
                    }}
                    onSubmit={handleUpdateListing}
                    validationSchema={validationSchema}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      setFieldTouched,
                      setFieldValue,
                    }) => (
                      <View>
                        <View
                          style={{
                            backgroundColor: AppColors.white,
                            marginHorizontal: "3%",
                            borderRadius: 6,
                            elevation: 0.5,
                            shadowColor: AppColors.border_light,
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            shadowOffset: { height: 1, width: 1 },
                            // paddingHorizontal: "3%",
                            paddingVertical: 15,
                            marginVertical: 10,
                          }}
                        >
                          {/* Common Fields (Title, Pricing Type, Price Type, Price) */}
                          <View style={styles.commonFieldsWrap}>
                            <View>
                              <Text style={[styles.title, rtlTextA]}>
                                {t(
                                  "editListingScreenTexts.formFieldLabels.formTitle"
                                )}
                              </Text>
                            </View>
                            <AppSeparator
                              style={{
                                marginVertical: 20,
                                width: "94%",
                                marginHorizontal: "3%",
                                backgroundColor: AppColors.border_light,
                                height: 0.7,
                              }}
                            />
                            <View style={styles.commonInputWrap}>
                              {ios ? (
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.listingTitle"
                                  )}
                                  <Text style={styles.required}> *</Text>
                                </Text>
                              ) : (
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  <Text style={styles.required}>* </Text>
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.listingTitle"
                                  )}
                                </Text>
                              )}
                              <TextInput
                                style={[styles.commonInputField, rtlTextA]}
                                onChangeText={handleChange("title")}
                                onBlur={() => setFieldTouched("title")}
                                value={values.title}
                              />
                              <View style={styles.inputFieldErrorWrap}>
                                {errors?.title && touched.title && (
                                  <Text
                                    style={[
                                      styles.inputFieldErrorMessage,
                                      rtlTextA,
                                    ]}
                                  >
                                    {"errors.title"}
                                  </Text>
                                )}
                              </View>
                            </View>
                            {/* Pricing Type */}
                            {!listingData.config.hidden_fields.includes(
                              "pricing_type"
                            ) &&
                              listingData?.config?.pricing_types && (
                                <View style={styles.commonInputWrap}>
                                  {ios ? (
                                    <Text
                                      style={[
                                        styles.commonInputLabel,
                                        rtlTextA,
                                      ]}
                                    >
                                      {t(
                                        "editListingScreenTexts.formFieldLabels.pricingLabel"
                                      )}
                                      <Text style={styles.required}> *</Text>
                                    </Text>
                                  ) : (
                                    <Text
                                      style={[
                                        styles.commonInputLabel,
                                        rtlTextA,
                                      ]}
                                    >
                                      <Text style={styles.required}>* </Text>
                                      {t(
                                        "editListingScreenTexts.formFieldLabels.pricingLabel"
                                      )}
                                    </Text>
                                  )}
                                  <View
                                    style={[
                                      styles.priceTypePickerWrap,
                                      {
                                        alignItems: rtl_support
                                          ? "flex-end"
                                          : "flex-start",
                                      },
                                    ]}
                                  >
                                    <AppRadioButton
                                      field={listingData.config.pricing_types}
                                      handleClick={updatePricingType}
                                      selected={listingCommonData.pricing_type}
                                    />
                                  </View>

                                  <View style={styles.inputFieldErrorWrap}>
                                    {!listingCommonData.pricing_type && (
                                      <Text
                                        style={[
                                          styles.inputFieldErrorMessage,
                                          rtlTextA,
                                        ]}
                                      >
                                        {t(
                                          "editListingScreenTexts.requiredFieldCustomError"
                                        )}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              )}
                            {/* Price Type */}
                            {!listingData.config.hidden_fields.includes(
                              "price_type"
                            ) &&
                              listingCommonData.pricing_type !== "disabled" && (
                                <View style={styles.commonInputWrap}>
                                  {ios ? (
                                    <Text
                                      style={[
                                        styles.commonInputLabel,
                                        rtlTextA,
                                      ]}
                                    >
                                      {t(
                                        "editListingScreenTexts.formFieldLabels.priceType"
                                      )}
                                      <Text style={styles.required}> *</Text>
                                    </Text>
                                  ) : (
                                    <Text
                                      style={[
                                        styles.commonInputLabel,
                                        rtlTextA,
                                      ]}
                                    >
                                      <Text style={styles.required}>* </Text>
                                      {t(
                                        "editListingScreenTexts.formFieldLabels.priceType"
                                      )}
                                    </Text>
                                  )}
                                  <View
                                    style={[
                                      styles.priceTypePickerWrap,
                                      {
                                        alignItems: rtl_support
                                          ? "flex-end"
                                          : "flex-start",
                                      },
                                    ]}
                                  >
                                    <AppRadioButton
                                      field={listingData.config.price_types}
                                      handleClick={updatePriceType}
                                      selected={listingCommonData.price_type}
                                    />
                                  </View>

                                  <View style={styles.inputFieldErrorWrap}>
                                    {!listingCommonData.price_type && (
                                      <Text
                                        style={[
                                          styles.inputFieldErrorMessage,
                                          rtlTextA,
                                        ]}
                                      >
                                        {t(
                                          "editListingScreenTexts.requiredFieldCustomError"
                                        )}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              )}
                            {/* Price */}
                            {!listingData.config.hidden_fields.includes(
                              "price"
                            ) &&
                              listingCommonData.price_type !== "on_call" &&
                              listingCommonData.pricing_type !== "disabled" && (
                                <>
                                  {listingCommonData.pricing_type !== "range" ||
                                  listingData.config.hidden_fields.includes(
                                    "pricing_type"
                                  ) ? (
                                    <View style={styles.commonInputWrap}>
                                      {ios ? (
                                        <Text
                                          style={[
                                            styles.commonInputLabel,
                                            rtlTextA,
                                          ]}
                                        >
                                          {`${t(
                                            "editListingScreenTexts.formFieldLabels.price"
                                          )} (${getCurrencySymbol(
                                            config.currency
                                          )})`}
                                          {listingCommonData.price_type !==
                                            "on_call" && (
                                            <Text style={styles.required}>
                                              {" "}
                                              *
                                            </Text>
                                          )}
                                        </Text>
                                      ) : (
                                        <Text
                                          style={[
                                            styles.commonInputLabel,
                                            rtlTextA,
                                          ]}
                                        >
                                          {listingCommonData.price_type !==
                                            "on_call" && (
                                            <Text style={styles.required}>
                                              *{" "}
                                            </Text>
                                          )}
                                          {`${t(
                                            "editListingScreenTexts.formFieldLabels.price"
                                          )} (${getCurrencySymbol(
                                            config.currency
                                          )})`}
                                        </Text>
                                      )}
                                      <TextInput
                                        style={[
                                          styles.commonInputField,
                                          rtlTextA,
                                        ]}
                                        onChangeText={(value) => {
                                          setListingCommonData(
                                            (listingCommonData) => {
                                              return {
                                                ...listingCommonData,
                                                ["raw_price"]: value,
                                              };
                                            }
                                          );
                                        }}
                                        onBlur={() => {
                                          setTouchedFields(
                                            (prevTouchedFields) =>
                                              Array.from(
                                                new Set([
                                                  ...prevTouchedFields,
                                                  "raw_price",
                                                ])
                                              )
                                          );
                                        }}
                                        //
                                        value={listingCommonData.raw_price}
                                        keyboardType="decimal-pad"
                                      />
                                      <View style={styles.inputFieldErrorWrap}>
                                        {commonErrorFields.includes(
                                          "raw_price"
                                        ) && (
                                          <Text
                                            style={[
                                              styles.inputFieldErrorMessage,
                                              rtlTextA,
                                            ]}
                                          >
                                            {t(
                                              "editListingScreenTexts.requiredFieldCustomError"
                                            )}
                                          </Text>
                                        )}
                                      </View>
                                    </View>
                                  ) : (
                                    <View
                                      style={[
                                        styles.commonInputWrap,
                                        {
                                          flexDirection: rtl_support
                                            ? "row-reverse"
                                            : "row",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        },
                                      ]}
                                    >
                                      <View style={{ width: "48.5%" }}>
                                        {ios ? (
                                          <Text
                                            style={[
                                              styles.commonInputLabel,
                                              rtlTextA,
                                            ]}
                                          >
                                            {`${t(
                                              "editListingScreenTexts.formFieldLabels.price"
                                            )} (${getCurrencySymbol(
                                              config.currency
                                            )})`}
                                            {listingCommonData.price_type !==
                                              "on_call" && (
                                              <Text style={styles.required}>
                                                {" "}
                                                *
                                              </Text>
                                            )}
                                          </Text>
                                        ) : (
                                          <Text
                                            style={[
                                              styles.commonInputLabel,
                                              rtlTextA,
                                            ]}
                                          >
                                            {listingCommonData.price_type !==
                                              "on_call" && (
                                              <Text style={styles.required}>
                                                *{" "}
                                              </Text>
                                            )}
                                            {`${t(
                                              "editListingScreenTexts.formFieldLabels.price"
                                            )} (${getCurrencySymbol(
                                              config.currency
                                            )})`}
                                          </Text>
                                        )}
                                        <TextInput
                                          style={[
                                            styles.commonInputField,
                                            rtlTextA,
                                          ]}
                                          onChangeText={(value) => {
                                            setListingCommonData(
                                              (listingCommonData) => {
                                                return {
                                                  ...listingCommonData,
                                                  ["raw_price"]: value,
                                                };
                                              }
                                            );
                                          }}
                                          onBlur={() => {
                                            setTouchedFields(
                                              (prevTouchedFields) =>
                                                Array.from(
                                                  new Set([
                                                    ...prevTouchedFields,
                                                    "raw_price",
                                                  ])
                                                )
                                            );
                                          }}
                                          value={listingCommonData.raw_price}
                                          keyboardType="decimal-pad"
                                        />
                                        <View
                                          style={styles.inputFieldErrorWrap}
                                        >
                                          {commonErrorFields.includes(
                                            "raw_price"
                                          ) && (
                                            <Text
                                              style={[
                                                styles.inputFieldErrorMessage,
                                                rtlTextA,
                                              ]}
                                            >
                                              {t(
                                                "editListingScreenTexts.requiredFieldCustomError"
                                              )}
                                            </Text>
                                          )}
                                        </View>
                                      </View>

                                      <View style={{ width: "48.5%" }}>
                                        {ios ? (
                                          <Text
                                            style={[
                                              styles.commonInputLabel,
                                              rtlTextA,
                                            ]}
                                          >
                                            {`${t(
                                              "editListingScreenTexts.formFieldLabels.maxPrice"
                                            )} (${getCurrencySymbol(
                                              config.currency
                                            )})`}
                                            {listingCommonData.price_type !==
                                              "on_call" &&
                                              listingCommonData.pricing_type ===
                                                "range" && (
                                                <Text style={styles.required}>
                                                  {" "}
                                                  *
                                                </Text>
                                              )}
                                          </Text>
                                        ) : (
                                          <Text
                                            style={[
                                              styles.commonInputLabel,
                                              rtlTextA,
                                            ]}
                                          >
                                            {listingCommonData.price_type !==
                                              "on_call" &&
                                              listingCommonData.pricing_type ===
                                                "range" && (
                                                <Text style={styles.required}>
                                                  *{" "}
                                                </Text>
                                              )}
                                            {`${t(
                                              "editListingScreenTexts.formFieldLabels.maxPrice"
                                            )} (${getCurrencySymbol(
                                              config.currency
                                            )})`}
                                          </Text>
                                        )}
                                        <TextInput
                                          style={[
                                            styles.commonInputField,
                                            rtlTextA,
                                          ]}
                                          onChangeText={(value) => {
                                            setListingCommonData(
                                              (listingCommonData) => {
                                                return {
                                                  ...listingCommonData,
                                                  ["raw_max_price"]: value,
                                                };
                                              }
                                            );
                                          }}
                                          onBlur={() => {
                                            setTouchedFields(
                                              (prevTouchedFields) =>
                                                Array.from(
                                                  new Set([
                                                    ...prevTouchedFields,
                                                    "raw_max_price",
                                                  ])
                                                )
                                            );
                                          }}
                                          value={
                                            listingCommonData.raw_max_price
                                          }
                                          keyboardType="decimal-pad"
                                        />
                                        <View
                                          style={styles.inputFieldErrorWrap}
                                        >
                                          {commonErrorFields.includes(
                                            "raw_max_price"
                                          ) && (
                                            <Text
                                              style={[
                                                styles.inputFieldErrorMessage,
                                                rtlTextA,
                                              ]}
                                            >
                                              {t(
                                                "editListingScreenTexts.requiredFieldCustomError"
                                              )}
                                            </Text>
                                          )}
                                        </View>
                                      </View>
                                    </View>
                                  )}
                                </>
                              )}

                            {/* Price Unit Input Component */}
                            {!listingData.config.hidden_fields.includes(
                              "price_units"
                            ) &&
                              listingData?.config?.price_units?.length > 0 &&
                              listingCommonData.pricing_type !== "disabled" &&
                              listingCommonData.price_type !== "on_call" && (
                                <View
                                  style={[
                                    styles.commonInputWrap,
                                    { marginBottom: 20 },
                                  ]}
                                >
                                  {ios ? (
                                    <Text style={[styles.label, rtlTextA]}>
                                      {t("listingFormTexts.priceUnitLabel")}
                                      <Text style={styles.required}> *</Text>
                                    </Text>
                                  ) : (
                                    <Text style={[styles.label, rtlTextA]}>
                                      <Text style={styles.required}>* </Text>
                                      {t("listingFormTexts.priceUnitLabel")}
                                    </Text>
                                  )}
                                  <View style={styles.priceTypePickerWrap}>
                                    <TouchableOpacity
                                      style={[styles.priceTypePicker, rtlView]}
                                      onPress={() => {
                                        setPriceUnitPickerVisible(
                                          !priceUnitPickerVisible
                                        );
                                        setListingCommonData(
                                          (listingCommonData) => {
                                            return {
                                              ...listingCommonData,
                                              ["price_unit"]: null,
                                            };
                                          }
                                        );
                                      }}
                                    >
                                      <Text style={styles.text}>
                                        {listingCommonData.price_unit
                                          ? `${
                                              listingData.config.price_units.filter(
                                                (item) =>
                                                  item.id ===
                                                  listingCommonData.price_unit
                                              )[0].name
                                            } (${
                                              listingData.config.price_units.filter(
                                                (item) =>
                                                  item.id ===
                                                  listingCommonData.price_unit
                                              )[0].short
                                            })`
                                          : // ? `${listingCommonData.price_unit.name} (${listingCommonData.price_unit.short})`
                                            t(
                                              "listingFormTexts.priceUnitLabel"
                                            )}
                                      </Text>
                                      <FontAwesome5
                                        name="chevron-down"
                                        size={14}
                                        color={AppColors.text_gray}
                                      />
                                    </TouchableOpacity>
                                    <Modal
                                      animationType="slide"
                                      transparent={true}
                                      visible={priceUnitPickerVisible}
                                    >
                                      <TouchableWithoutFeedback
                                        onPress={() =>
                                          setPriceUnitPickerVisible(false)
                                        }
                                      >
                                        <View style={styles.modalOverlay} />
                                      </TouchableWithoutFeedback>
                                      <View style={styles.centeredView}>
                                        <View style={styles.modalView}>
                                          <Text
                                            style={styles.modalText}
                                          >{`== ${t(
                                            "listingFormTexts.priceUnitLabel"
                                          )} ==`}</Text>
                                          <ScrollView
                                            contentContainerStyle={{
                                              display: "flex",
                                              width: "100%",
                                              alignItems: "flex-start",
                                            }}
                                          >
                                            {listingData.config.price_units.map(
                                              (item) => (
                                                <TouchableOpacity
                                                  style={styles.pickerOptions}
                                                  key={`${item.id}`}
                                                  onPress={() => {
                                                    setPriceUnitPickerVisible(
                                                      false
                                                    );
                                                    setListingCommonData(
                                                      (listingCommonData) => {
                                                        return {
                                                          ...listingCommonData,
                                                          ["price_unit"]:
                                                            item.id,
                                                        };
                                                      }
                                                    );
                                                  }}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.pickerOptionsText,
                                                      rtlTextA,
                                                    ]}
                                                  >
                                                    {item.name} ({item.short})
                                                  </Text>
                                                </TouchableOpacity>
                                              )
                                            )}
                                          </ScrollView>
                                        </View>
                                      </View>
                                    </Modal>
                                  </View>
                                  <View style={styles.errorWrap}>
                                    {touchedFields.includes("price_unit") &&
                                      !listingCommonData.price_unit && (
                                        <Text
                                          style={[
                                            styles.errorMessage,
                                            rtlTextA,
                                          ]}
                                        >
                                          {t(
                                            "listingFormTexts.fieldRequiredErrorMessage"
                                          )}
                                        </Text>
                                      )}
                                  </View>
                                </View>
                              )}
                          </View>

                          {/* Custom Fields */}
                          {listingData.custom_fields && (
                            <View style={styles.customFieldsWrap}>
                              {listingData.custom_fields.map((field) => (
                                <View
                                  key={field.meta_key}
                                  style={styles.metaField}
                                >
                                  {validateCfDependency.includes(field.id) && (
                                    <>
                                      {ios ? (
                                        <Text style={[styles.label, rtlTextA]}>
                                          {decodeString(field.label)}
                                          {field.required && (
                                            <Text style={styles.required}>
                                              {" "}
                                              *
                                            </Text>
                                          )}
                                        </Text>
                                      ) : (
                                        <Text style={[styles.label, rtlTextA]}>
                                          {field.required && (
                                            <Text style={styles.required}>
                                              *{" "}
                                            </Text>
                                          )}
                                          {decodeString(field.label)}
                                        </Text>
                                      )}
                                      {[
                                        "text",
                                        "textarea",
                                        "url",
                                        "number",
                                      ].includes(field.type) && (
                                        <TextInput
                                          style={[
                                            field.type === "textarea"
                                              ? styles.metaField_TextArea
                                              : styles.metaField_Text,
                                            rtlTextA,
                                          ]}
                                          onChangeText={(value) =>
                                            handleTextData(
                                              field.meta_key,
                                              value
                                            )
                                          }
                                          value={
                                            listingCustomData[field.meta_key]
                                              ? listingCustomData[
                                                  field.meta_key
                                                ]
                                              : ""
                                          }
                                          textAlignVertical={
                                            field.type === "textarea"
                                              ? "top"
                                              : "auto"
                                          }
                                          multiline={field.type === "textarea"}
                                          keyboardType={
                                            field.type === "number"
                                              ? "decimal-pad"
                                              : "default"
                                          }
                                          contextMenuHidden={
                                            field.type === "number"
                                          }
                                          placeholder={field.placeholder}
                                          onBlur={() =>
                                            setTouchedFields(
                                              (prevTouchedFields) =>
                                                Array.from(
                                                  new Set([
                                                    ...prevTouchedFields,
                                                    field.meta_key,
                                                  ])
                                                )
                                            )
                                          }
                                        />
                                      )}
                                      {field.type === "select" && (
                                        <View style={styles.dynamicPickerWrap}>
                                          <DynamicListPicker
                                            field={field}
                                            onselect={(item) =>
                                              setListingCustomData(
                                                (listingCustomData) => {
                                                  return {
                                                    ...listingCustomData,
                                                    [field.meta_key]: item.id,
                                                  };
                                                }
                                              )
                                            }
                                            selected={
                                              field.value
                                                ? field.value
                                                : undefined
                                            }
                                            handleTouch={() =>
                                              setTouchedFields(
                                                (prevTouchedFields) =>
                                                  Array.from(
                                                    new Set([
                                                      ...prevTouchedFields,
                                                      field.meta_key,
                                                    ])
                                                  )
                                              )
                                            }
                                          />
                                        </View>
                                      )}
                                      {field.type === "radio" && (
                                        <View style={styles.dynamicRadioWrap}>
                                          <DynamicRadioButton
                                            field={field}
                                            handleClick={(item) => {
                                              setListingCustomData(
                                                (listingCustomData) => {
                                                  return {
                                                    ...listingCustomData,
                                                    [field.meta_key]: item.id,
                                                  };
                                                }
                                              );
                                              setTouchedFields(
                                                (prevTouchedFields) =>
                                                  Array.from(
                                                    new Set([
                                                      ...prevTouchedFields,
                                                      field.meta_key,
                                                    ])
                                                  )
                                              );
                                            }}
                                            selected={
                                              listingCustomData[
                                                `${field.meta_key}`
                                              ]
                                            }
                                          />
                                        </View>
                                      )}
                                      {field.type === "checkbox" && (
                                        <View
                                          style={styles.dynamicCheckboxWrap}
                                        >
                                          <DynamicCheckbox
                                            field={field}
                                            handleClick={(value) => {
                                              setListingCustomData(
                                                (listingCustomData) => {
                                                  return {
                                                    ...listingCustomData,
                                                    [field.meta_key]: value,
                                                  };
                                                }
                                              );
                                              setTouchedFields(
                                                (prevTouchedFields) =>
                                                  Array.from(
                                                    new Set([
                                                      ...prevTouchedFields,
                                                      field.meta_key,
                                                    ])
                                                  )
                                              );
                                            }}
                                            selected={
                                              field.value.length
                                                ? field.value
                                                : []
                                            }
                                          />
                                        </View>
                                      )}
                                      {field.type === "date" && (
                                        <View style={styles.dateFieldWrap}>
                                          {["date", "date_time"].includes(
                                            field.date.type
                                          ) && (
                                            <></>
                                            // <DatePicker
                                            //   field={field}
                                            //   onSelect={handleDateTime}
                                            //   value={
                                            //     listingCustomData[
                                            //       field.meta_key
                                            //     ]
                                            //       ? listingCustomData[
                                            //           field.meta_key
                                            //         ]
                                            //       : null
                                            //   }
                                            // />
                                          )}
                                          {[
                                            "date_range",
                                            "date_time_range",
                                          ].includes(field.date.type) && (
                                            <></>
                                            // <DateRangePicker
                                            //   field={field}
                                            //   value={
                                            //     !!listingCustomData[
                                            //       field.meta_key
                                            //     ][0] ||
                                            //     !!listingCustomData[
                                            //       field.meta_key
                                            //     ][1]
                                            //       ? listingCustomData[
                                            //           field.meta_key
                                            //         ]
                                            //       : null
                                            //   }
                                            //   onSelect={handleDateTimeRange}
                                            // />
                                          )}
                                        </View>
                                      )}
                                      <View style={styles.inputFieldErrorWrap}>
                                        {customErrorFields.includes(field) &&
                                          touchedFields.includes(
                                            field.meta_key
                                          ) && (
                                            <Text
                                              style={[
                                                styles.inputFieldErrorMessage,
                                                rtlTextA,
                                              ]}
                                            >
                                              {t(
                                                "editListingScreenTexts.requiredFieldCustomError"
                                              )}
                                            </Text>
                                          )}
                                      </View>
                                    </>
                                  )}
                                </View>
                              ))}
                            </View>
                          )}
                          {/* Common Fields (Video Url & Description) */}
                          <View style={styles.commonFieldsWrap}>
                            {!!listingData?.config?.video_urls && (
                              <View style={styles.commonInputWrap}>
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.videoUrl"
                                  )}
                                </Text>
                                <TextInput
                                  style={[styles.metaField_Text, rtlTextA]}
                                  onChangeText={handleChange("video_urls")}
                                  onBlur={handleBlur("video_urls")}
                                  value={values.video_urls}
                                  placeholder={t(
                                    "editListingScreenTexts.formFieldLabels.videoUrl"
                                  )}
                                />
                                <Text style={[styles.Text, rtlTextA]}>
                                  {t("editListingScreenTexts.videoUrlNote")}
                                </Text>
                                <View style={styles.inputFieldErrorWrap}>
                                  {errors.video_urls && touched.video_urls && (
                                    <Text
                                      style={[
                                        styles.inputFieldErrorMessage,
                                        rtlTextA,
                                      ]}
                                    >
                                      {errors.video_urls}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            )}
                            {!listingData.config.hidden_fields.includes(
                              "description"
                            ) && (
                              <View style={styles.commonInputWrap}>
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.listingDescription"
                                  )}
                                </Text>
                                <TextInput
                                  style={[styles.metaField_TextArea, rtlTextA]}
                                  onChangeText={handleChange("description")}
                                  onBlur={handleBlur("description")}
                                  value={values.description}
                                  textAlignVertical="top"
                                  multiline
                                  placeholder={t(
                                    "editListingScreenTexts.formFieldLabels.listingDescription"
                                  )}
                                />
                                <View style={styles.inputFieldErrorWrap}>
                                  {errors.description &&
                                    touched.description && (
                                      <Text
                                        style={[
                                          styles.inputFieldErrorMessage,
                                          rtlTextA,
                                        ]}
                                      >
                                        {errors.description}
                                      </Text>
                                    )}
                                </View>
                              </View>
                            )}
                          </View>
                        </View>
                        {/* Business Hours Component */}
                        {listingData?.config?.bhs && (
                          <View
                            style={{
                              backgroundColor: AppColors.white,
                              marginHorizontal: "3%",
                              borderRadius: 6,
                              elevation: 0.5,
                              shadowColor: AppColors.border_light,
                              shadowOpacity: 0.1,
                              shadowRadius: 3,
                              shadowOffset: { height: 1, width: 1 },
                              paddingVertical: 10,
                              marginVertical: 15,
                            }}
                          >
                            <View style={styles.bHWrap}>
                              <View style={styles.contactTitleWrap}>
                                <Text style={[styles.title, rtlTextA]}>
                                  {t("listingFormTexts.businessHoursTitle")}
                                </Text>
                              </View>

                              <View style={styles.bHContentWrap}>
                                <View style={[styles.bHToggleBtnWrap, rtlView]}>
                                  <TouchableWithoutFeedback
                                    style={styles.bHToggleBtnIcon}
                                    onPress={handleBHToggle}
                                  >
                                    <MaterialCommunityIcons
                                      name={
                                        bHActive
                                          ? "checkbox-marked"
                                          : "checkbox-blank-outline"
                                      }
                                      size={24}
                                      color={AppColors.primary}
                                    />
                                  </TouchableWithoutFeedback>
                                  <TouchableWithoutFeedback
                                    style={styles.bHToggleBtnTextWrap}
                                    onPress={handleBHToggle}
                                  >
                                    <Text
                                      style={[
                                        styles.bHToggleBtnText,
                                        {
                                          marginLeft: rtl_support ? 0 : 10,
                                          marginRight: rtl_support ? 10 : 0,
                                        },
                                        rtlText,
                                      ]}
                                    >
                                      {t(
                                        "listingFormTexts.businessHoursToggleTitle"
                                      )}
                                    </Text>
                                  </TouchableWithoutFeedback>
                                </View>

                                {bHActive && (
                                  <>
                                    <View style={styles.bHToggleNoteWrap}>
                                      <Text
                                        style={[styles.bHToggleNote, rtlTextA]}
                                      >
                                        {t(
                                          "listingFormTexts.businessHoursToggleNote"
                                        )}
                                      </Text>
                                    </View>
                                    <View style={styles.bHs}>
                                      {config.week_days.map((_day) => (
                                        <BHComponent
                                          day={_day.id}
                                          dayName={_day.name}
                                          key={_day.id}
                                        />
                                      ))}
                                    </View>
                                    <View style={styles.sBHs}>
                                      <View
                                        style={[
                                          styles.bHToggleBtnWrap,
                                          rtlView,
                                        ]}
                                      >
                                        <TouchableWithoutFeedback
                                          style={styles.bHToggleBtnIcon}
                                          onPress={handleSBHToggle}
                                        >
                                          <MaterialCommunityIcons
                                            name={
                                              !!defaultSBH?.length
                                                ? "checkbox-marked"
                                                : "checkbox-blank-outline"
                                            }
                                            size={24}
                                            color={AppColors.primary}
                                          />
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                          style={styles.bHToggleBtnTextWrap}
                                          onPress={handleSBHToggle}
                                        >
                                          <Text style={styles.bHToggleBtnText}>
                                            {t(
                                              "listingFormTexts.specialHoursToggleTitle"
                                            )}
                                          </Text>
                                        </TouchableWithoutFeedback>
                                      </View>
                                      <View style={styles.bHToggleNoteWrap}>
                                        <Text
                                          style={[
                                            styles.bHToggleNote,
                                            rtlTextA,
                                          ]}
                                        >
                                          {t(
                                            "listingFormTexts.specialHoursToggleNote"
                                          )}
                                        </Text>
                                      </View>
                                      {defaultSBH?.map((_sbh, index, arr) => (
                                        <SBHComponent
                                          specialDay={index}
                                          dataArray={arr}
                                          key={index}
                                        />
                                      ))}
                                    </View>
                                  </>
                                )}
                              </View>
                            </View>
                          </View>
                        )}
                        <View
                          style={{
                            backgroundColor: AppColors.white,
                            marginHorizontal: "3%",
                            borderRadius: 6,
                            elevation: 0.5,
                            shadowColor: AppColors.border_light,
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            shadowOffset: { height: 1, width: 1 },
                            paddingVertical: 10,
                            marginVertical: 10,
                          }}
                        >
                          {/* Contact Section */}
                          <View style={styles.contactSectionWrap}>
                            <View style={styles.contactTitleWrap}>
                              <Text style={[styles.title, rtlTextA]}>
                                {t(
                                  "editListingScreenTexts.formFieldLabels.contact"
                                )}
                              </Text>
                            </View>
                            {/* Name Input */}
                            {!listingData.config.hidden_fields.includes(
                              "name"
                            ) && (
                              <View style={styles.commonInputWrap}>
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.name"
                                  )}
                                  <Text style={styles.required}> *</Text>
                                </Text>
                                <TextInput
                                  style={[styles.commonInputField, rtlTextA]}
                                  onChangeText={handleChange("name")}
                                  onBlur={handleBlur("name")}
                                  value={values.name}
                                  editable={!user.first_name && !user.last_name}
                                />
                                <View style={styles.inputFieldErrorWrap}>
                                  {errors.name && touched.name && (
                                    <Text
                                      style={[
                                        styles.inputFieldErrorMessage,
                                        rtlTextA,
                                      ]}
                                    >
                                      {errors.name}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            )}
                            {/* Phone Input */}
                            {!listingData.config.hidden_fields.includes(
                              "phone"
                            ) && (
                              <View style={styles.commonInputWrap}>
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.phone"
                                  )}
                                  <Text style={styles.required}> *</Text>
                                </Text>
                                <TextInput
                                  style={[styles.commonInputField, rtlTextA]}
                                  onChangeText={handleChange("phone")}
                                  onBlur={handleBlur("phone")}
                                  value={values.phone}
                                />
                                <View style={styles.inputFieldErrorWrap}>
                                  {errors.phone && touched.phone && (
                                    <Text
                                      style={[
                                        styles.inputFieldErrorMessage,
                                        rtlTextA,
                                      ]}
                                    >
                                      {errors.phone}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            )}
                            {/* Whatsapp Input */}
                            {!listingData.config.hidden_fields.includes(
                              "whatsapp_number"
                            ) && (
                              <View style={styles.commonInputWrap}>
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.whatsapp"
                                  )}
                                </Text>
                                <TextInput
                                  style={[styles.commonInputField, rtlTextA]}
                                  onChangeText={handleChange("whatsapp_number")}
                                  onBlur={handleBlur("whatsapp_number")}
                                  value={values.whatsapp_number}
                                />
                                <Text style={[styles.Text, rtlTextA]}>
                                  {t("editListingScreenTexts.whatsappNote")}
                                </Text>
                                <View style={styles.inputFieldErrorWrap}>
                                  {errors.whatsapp_number &&
                                    touched.whatsapp_number && (
                                      <Text
                                        style={[
                                          styles.inputFieldErrorMessage,
                                          rtlTextA,
                                        ]}
                                      >
                                        {errors.whatsapp_number}
                                      </Text>
                                    )}
                                </View>
                              </View>
                            )}
                            {/* Email Input */}
                            {!listingData.config.hidden_fields.includes(
                              "email"
                            ) && (
                              <View style={styles.commonInputWrap}>
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.email"
                                  )}
                                  <Text style={styles.required}> *</Text>
                                </Text>
                                <TextInput
                                  style={[styles.commonInputField, rtlTextA]}
                                  onChangeText={handleChange("email")}
                                  onBlur={handleBlur("email")}
                                  value={values.email}
                                  editable={!values.email}
                                />
                                <View style={styles.inputFieldErrorWrap}>
                                  {errors.email && touched.email && (
                                    <Text
                                      style={[
                                        styles.inputFieldErrorMessage,
                                        rtlTextA,
                                      ]}
                                    >
                                      {errors.email}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            )}
                            {/* Website Input */}
                            {!listingData.config.hidden_fields.includes(
                              "website"
                            ) && (
                              <View style={styles.commonInputWrap}>
                                <Text
                                  style={[styles.commonInputLabel, rtlTextA]}
                                >
                                  {t(
                                    "editListingScreenTexts.formFieldLabels.website"
                                  )}
                                </Text>
                                <TextInput
                                  style={[styles.commonInputField, rtlTextA]}
                                  onChangeText={handleChange("website")}
                                  onBlur={handleBlur("website")}
                                  value={values.website}
                                />
                                <View style={styles.inputFieldErrorWrap}>
                                  {errors.website && touched.website && (
                                    <Text
                                      style={[
                                        styles.inputFieldErrorMessage,
                                        rtlTextA,
                                      ]}
                                    >
                                      {errors.website}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            )}
                            {/* ZipCode Input */}
                            {!listingData.config.hidden_fields.includes(
                              "zipcode"
                            ) &&
                              config.location_type === "local" && (
                                <View style={styles.commonInputWrap}>
                                  <Text
                                    style={[styles.commonInputLabel, rtlTextA]}
                                  >
                                    {t(
                                      "editListingScreenTexts.formFieldLabels.zipCode"
                                    )}
                                  </Text>
                                  <TextInput
                                    style={[styles.commonInputField, rtlTextA]}
                                    onChangeText={(text) => {
                                      setFieldValue("zipcode", text);
                                      if (!geoCoderFail) {
                                        handleReGeocoding(values, {
                                          zipcode: text,
                                        });
                                      }
                                    }}
                                    onBlur={handleBlur("zipcode")}
                                    value={values.zipcode}
                                  />
                                  <View style={styles.inputFieldErrorWrap}>
                                    {errors.zipcode && touched.zipcode && (
                                      <Text
                                        style={[
                                          styles.inputFieldErrorMessage,
                                          rtlTextA,
                                        ]}
                                      >
                                        {errors.zipcode}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              )}
                            {/* Address Input */}
                            {!listingData.config.hidden_fields.includes(
                              "address"
                            ) &&
                              config.location_type === "local" && (
                                <View style={styles.commonInputWrap}>
                                  <Text
                                    style={[styles.commonInputLabel, rtlTextA]}
                                  >
                                    {t(
                                      "editListingScreenTexts.formFieldLabels.address"
                                    )}
                                  </Text>
                                  <TextInput
                                    style={[styles.commonInputField, rtlTextA]}
                                    onChangeText={(text) => {
                                      setFieldValue("address", text);
                                      if (!geoCoderFail) {
                                        handleReGeocoding(values, {
                                          address: text,
                                        });
                                      }
                                    }}
                                    onBlur={handleBlur("address")}
                                    value={values.address}
                                    placeholder={t(
                                      "editListingScreenTexts.formFieldLabels.address"
                                    )}
                                  />
                                  <View style={styles.inputFieldErrorWrap}>
                                    {errors.address && touched.address && (
                                      <Text
                                        style={[
                                          styles.inputFieldErrorMessage,
                                          rtlTextA,
                                        ]}
                                      >
                                        {errors.address}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              )}
                            {/* Geo Address Component */}
                            {config.location_type === "geo" &&
                              !geoCoderFail && (
                                <View style={styles.commonInputWrap}>
                                  <Text
                                    style={[styles.commonInputLabel, rtlTextA]}
                                  >
                                    {t(
                                      "editListingScreenTexts.formFieldLabels.address"
                                    )}
                                  </Text>

                                  <GooglePlacesAutocomplete
                                    type={config.map?.type || "osm"}
                                    placeholder={
                                      listingGeoAddress
                                        ? listingGeoAddress
                                        : t(
                                            "listingFormTexts.geoAddressPlaceholder"
                                          )
                                    }
                                    textInputProps={{
                                      placeholderTextColor: listingGeoAddress
                                        ? AppColors.black
                                        : "#b6b6b6",
                                    }}
                                    onPress={(
                                      data,
                                      details = null,
                                      inputRef
                                    ) => {
                                      if (data.description) {
                                        setListingGeoAddress(data.description);
                                      }
                                      let geoLocation = null;
                                      if (
                                        "google" === config.map?.type &&
                                        details?.geometry?.location
                                      ) {
                                        geoLocation = {
                                          latitude:
                                            details.geometry.location.lat,
                                          longitude:
                                            details.geometry.location.lng,
                                        };
                                      } else if (
                                        data?.details?.geometry?.location
                                      ) {
                                        geoLocation = {
                                          latitude: parseFloat(
                                            data.details.geometry.location.lat
                                          ),
                                          longitude: parseFloat(
                                            data.details.geometry.location.lng
                                          ),
                                        };
                                      }
                                      if (geoLocation) {
                                        setRegion({ ...geoLocation });
                                        setMarkerPosition({ ...geoLocation });
                                      }

                                      if (inputRef) {
                                        inputRef.clear();
                                      }
                                    }}
                                    fetchDetails={"google" === config.map?.type}
                                    query={
                                      "google" === config.map?.type
                                        ? {
                                            key: config.map.api_key,
                                            language: "en",
                                          }
                                        : { language: "en" }
                                    }
                                    debounce={200}
                                    timeout={15000} //15 seconds
                                  />

                                  <View style={styles.inputFieldErrorWrap}>
                                    {errors.address && touched.address && (
                                      <Text
                                        style={[
                                          styles.inputFieldErrorMessage,
                                          rtlTextA,
                                        ]}
                                      >
                                        {errors.address}
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              )}
                            {!osmOverlay && !ios && (
                              <View
                                style={{
                                  position: "absolute",
                                  zIndex: 2,
                                  top: 0,
                                  bottom: 0,
                                  right: 0,
                                  left: 0,
                                  opacity: 0,
                                }}
                              >
                                <TouchableWithoutFeedback
                                  onPress={() => setOsmOverlay(true)}
                                >
                                  <View
                                    style={{
                                      height: "100%",
                                      width: "100%",
                                    }}
                                  />
                                </TouchableWithoutFeedback>
                              </View>
                            )}
                          </View>
                          {/* MapView */}
                          {config?.map && (
                            <View>
                              {geoCoderFail ? (
                                <View
                                  style={{
                                    marginHorizontal: "3%",
                                  }}
                                >
                                  <View style={styles.geoCoderFailWrap}>
                                    <Text
                                      style={[
                                        styles.geoCoderFailTitle,
                                        rtlTextA,
                                      ]}
                                    >
                                      {t("editListingScreenTexts.geoCoderFail")}
                                    </Text>
                                    <Text
                                      style={[
                                        styles.geoCoderFailMessage,
                                        rtlTextA,
                                      ]}
                                    >
                                      {geoCoderFailedMessage}
                                    </Text>
                                  </View>
                                </View>
                              ) : (
                                <>
                                  {/* Loading Component Inside Map */}
                                  {locationLoading && (
                                    <View style={styles.mapOverlay}>
                                      <ActivityIndicator
                                        size="large"
                                        color={AppColors.primary}
                                      />
                                    </View>
                                  )}
                                  {/* Map Mode Toggle Button */}
                                  {"google" === config?.map?.type && (
                                    <View style={styles.mapViewButtonsWrap}>
                                      <TouchableOpacity
                                        style={[
                                          styles.mapViewButton,
                                          {
                                            backgroundColor:
                                              mapType == "standard"
                                                ? AppColors.dodgerblue
                                                : "transparent",
                                          },
                                        ]}
                                        onPress={handleMapTypeChange}
                                        disabled={mapType == "standard"}
                                      >
                                        <Text
                                          style={[
                                            styles.mapViewButtonTitle,
                                            {
                                              color:
                                                mapType == "standard"
                                                  ? AppColors.white
                                                  : AppColors.text_gray,
                                            },
                                          ]}
                                        >
                                          {t(
                                            "editListingScreenTexts.buttonTitles.mapStandard"
                                          )}
                                        </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        style={[
                                          styles.mapViewButton,
                                          {
                                            backgroundColor:
                                              mapType == "hybrid"
                                                ? AppColors.dodgerblue
                                                : "transparent",
                                          },
                                        ]}
                                        onPress={handleMapTypeChange}
                                        disabled={mapType == "hybrid"}
                                      >
                                        <Text
                                          style={[
                                            styles.mapViewButtonTitle,
                                            {
                                              color:
                                                mapType == "hybrid"
                                                  ? AppColors.white
                                                  : AppColors.text_gray,
                                            },
                                          ]}
                                        >
                                          {t(
                                            "editListingScreenTexts.buttonTitles.mapHybrid"
                                          )}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                  {/* Map Component */}
                                  {"google" === config?.map?.type ? (
                                    <MapView
                                      ref={mapViewRef}
                                      style={{
                                        width: "100%",
                                        height: screenWidth * 0.8,
                                      }}
                                      region={{
                                        ...region,
                                        latitudeDelta: 0.0135135,
                                        longitudeDelta: 0.0135135 * 0.8,
                                      }}
                                      provider={MapView.PROVIDER_GOOGLE}
                                      mapType={mapType}
                                      loadingEnabled={true}
                                      loadingIndicatorColor={
                                        AppColors.primary_soft
                                      }
                                      loadingBackgroundColor={AppColors.white}
                                    >
                                      <Marker
                                        coordinate={markerPosition}
                                        draggable
                                        onDragEnd={(event) =>
                                          handleMarkerReleaseEvent(
                                            event.nativeEvent.coordinate,
                                            setFieldValue
                                          )
                                        }
                                      />
                                    </MapView>
                                  ) : (
                                    <View
                                      style={{
                                        width: "100%",
                                        height: screenWidth * 0.8,
                                        zIndex: 3,
                                      }}
                                    >
                                      {!loading && (
                                        <WebView
                                          ref={mapRef}
                                          source={{ html: html_script }}
                                          style={{ flex: 1, opacity: 0.99 }}
                                          onMessage={(event) => {
                                            const rawData =
                                              event.nativeEvent.data;
                                            if (rawData) {
                                              const data = JSON.parse(rawData);

                                              handleMarkerReleaseEvent(
                                                {
                                                  latitude: data?.lat,
                                                  longitude: data?.lng,
                                                },
                                                setFieldValue
                                              );
                                            }
                                          }}
                                        />
                                      )}
                                      {!ios && osmOverlay && (
                                        <View
                                          style={{
                                            position: "absolute",
                                            top: 0,
                                            bottom: 0,
                                            right: 0,
                                            left: 0,

                                            zIndex: 4,
                                            opacity: 0,
                                          }}
                                        >
                                          <TouchableWithoutFeedback
                                            onPress={() => setOsmOverlay(false)}
                                          >
                                            <View
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                              }}
                                            />
                                          </TouchableWithoutFeedback>
                                        </View>
                                      )}
                                    </View>
                                  )}
                                  {/* Hide Map Toggle */}
                                  <View style={styles.view}>
                                    {!osmOverlay && !ios && (
                                      <View
                                        style={{
                                          position: "absolute",
                                          zIndex: 2,
                                          top: 0,
                                          bottom: 0,
                                          right: 0,
                                          left: 0,
                                          opacity: 0,
                                        }}
                                      >
                                        <TouchableWithoutFeedback
                                          onPress={() => setOsmOverlay(true)}
                                        >
                                          <View
                                            style={{
                                              height: "100%",
                                              width: "100%",
                                            }}
                                          />
                                        </TouchableWithoutFeedback>
                                      </View>
                                    )}

                                    <View style={styles.mapDisplayInputWrap}>
                                      <TouchableWithoutFeedback
                                        onPress={() =>
                                          setHideMap(
                                            (prevHideMap) => !prevHideMap
                                          )
                                        }
                                      >
                                        <View
                                          style={[
                                            styles.mapCheckboxWrap,
                                            rtlView,
                                          ]}
                                        >
                                          <MaterialCommunityIcons
                                            name={
                                              hideMap
                                                ? "checkbox-marked"
                                                : "checkbox-blank-outline"
                                            }
                                            size={20}
                                            color={AppColors.primary}
                                          />
                                          <Text
                                            style={[
                                              styles.mapToggleMessage,
                                              {
                                                paddingLeft: rtl_support
                                                  ? 0
                                                  : 5,
                                                paddingRight: rtl_support
                                                  ? 5
                                                  : 0,
                                              },
                                            ]}
                                          >
                                            {t(
                                              "editListingScreenTexts.mapToggleMessage"
                                            )}
                                          </Text>
                                        </View>
                                      </TouchableWithoutFeedback>
                                    </View>
                                  </View>
                                  {/* Device Location Button */}
                                  <TouchableOpacity
                                    style={[
                                      styles.deviceLocationButton,
                                      ios
                                        ? {
                                            shadowColor: "#000",
                                            shadowRadius: 4,
                                            shadowOpacity: 0.2,
                                            shadowOffset: {
                                              height: 2,
                                              width: 2,
                                            },
                                          }
                                        : { elevation: 1 },
                                    ]}
                                    onPress={() =>
                                      handleGetDeviceLocation(setFieldValue)
                                    }
                                    disabled={locationLoading}
                                  >
                                    <MaterialIcons
                                      name="my-location"
                                      size={24}
                                      color={
                                        locationLoading
                                          ? AppColors.primary_soft
                                          : AppColors.primary
                                      }
                                    />
                                  </TouchableOpacity>
                                </>
                              )}
                            </View>
                          )}
                        </View>
                        {/* Social Profiles */}
                        {!!listingData?.config?.social_profiles?.length && (
                          <View
                            style={{
                              backgroundColor: AppColors.white,
                              marginHorizontal: "3%",
                              borderRadius: 6,
                              elevation: 0.5,
                              shadowColor: AppColors.border_light,
                              shadowOpacity: 0.1,
                              shadowRadius: 3,
                              shadowOffset: { height: 1, width: 1 },
                              paddingVertical: 10,
                              marginVertical: 10,
                            }}
                          >
                            <View style={styles.socialProfilesSectionWrap}>
                              {!osmOverlay && !ios && (
                                <View
                                  style={{
                                    position: "absolute",
                                    zIndex: 2,
                                    top: 0,
                                    bottom: 0,
                                    right: 0,
                                    left: 0,
                                    opacity: 0,
                                  }}
                                >
                                  <TouchableWithoutFeedback
                                    onPress={() => setOsmOverlay(true)}
                                  >
                                    <View
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                      }}
                                    />
                                  </TouchableWithoutFeedback>
                                </View>
                              )}
                              <View style={styles.contactTitleWrap}>
                                <Text style={[styles.title, rtlTextA]}>
                                  {t(
                                    "editListingScreenTexts.socialProfileTitle"
                                  )}
                                </Text>
                              </View>

                              {listingData.config.social_profiles.map(
                                (_profile) => (
                                  <View
                                    style={styles.commonInputWrap}
                                    key={_profile.id}
                                  >
                                    <Text
                                      style={[
                                        styles.commonInputLabel,
                                        rtlTextA,
                                      ]}
                                    >
                                      {decodeString(_profile.name)}
                                    </Text>
                                    <TextInput
                                      style={[
                                        styles.commonInputField,
                                        rtlTextA,
                                      ]}
                                      onChangeText={(text) =>
                                        handleSclPrflFldValue(text, _profile)
                                      }
                                      onBlur={() =>
                                        setTouchedFields((prevTouchedFields) =>
                                          Array.from(
                                            new Set([
                                              ...prevTouchedFields,
                                              _profile.id,
                                            ])
                                          )
                                        )
                                      }
                                      value={socialProfiles[_profile.id]}
                                      placeholder={decodeString(_profile.name)}
                                      placeholderTextColor={AppColors.text_gray}
                                    />
                                    <View style={styles.inputFieldErrorWrap}>
                                      {touchedFields.includes(_profile.id) &&
                                        socialErrors.includes(_profile.id) && (
                                          <Text
                                            style={[
                                              styles.inputFieldErrorMessage,
                                              rtlTextA,
                                            ]}
                                          >
                                            {t(
                                              "editListingScreenTexts.websiteErrorLabel"
                                            )}
                                          </Text>
                                        )}
                                    </View>
                                  </View>
                                )
                              )}
                            </View>
                          </View>
                        )}
                        {/* Bottom notes */}
                        <View style={[styles.noteWrap]}>
                          <Text
                            style={[
                              styles.text,
                              {
                                color:
                                  Object.keys(errors).length ||
                                  customErrorFields.length ||
                                  commonErrorFields.length
                                    ? AppColors.red
                                    : AppColors.text_gray,
                              },
                              rtlText,
                            ]}
                          >
                            {t("editListingScreenTexts.requiredFieldNotice")}
                          </Text>
                        </View>
                        {/* Submit Button Component */}
                        <View style={{ paddingHorizontal: "3%" }}>
                          <AppButton
                            style={styles.updateButton}
                            title={t(
                              "editListingScreenTexts.buttonTitles.updateListing"
                            )}
                            onPress={handleSubmit}
                            loading={updateLoading}
                            disabled={
                              updateLoading ||
                              !!Object.keys(errors).length ||
                              !!customErrorFields?.length ||
                              !!commonErrorFields?.length
                            }
                          />
                        </View>
                      </View>
                    )}
                  </Formik>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      {/* Image Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={photoModalVisible}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setPhotoModalVisible((prevMV) => !prevMV);
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          />
        </TouchableWithoutFeedback>
        <View style={styles.centeredView}>
          {addingPhoto ? (
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color={AppColors.primary} />
            </View>
          ) : (
            <View style={styles.modalView}>
              <View style={styles.modalTitleWrap}>
                <Text style={styles.modalTitle}>
                  {t("imageInputTexts.addPhoto")}
                </Text>
              </View>
              <View style={styles.contentWrap}>
                <TouchableOpacity
                  style={styles.libraryWrap}
                  onPress={() => requestCameraParmission()}
                >
                  <CameraButtonIcon
                    fillColor={AppColors.bg_primary}
                    strokeColor={AppColors.primary}
                    iconColor={AppColors.primary}
                  />
                  <Text style={styles.libraryText}>
                    {t("imageInputTexts.takePhoto")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.libraryWrap}
                  onPress={() => requestGalleryParmission()}
                >
                  <GalleryButtonIcon
                    fillColor="#EBF9FF"
                    strokeColor="#2267ED"
                    iconColor="#2267ED"
                  />
                  <Text style={styles.libraryText}>
                    {t("imageInputTexts.fromGallery")}
                  </Text>
                </TouchableOpacity>
              </View>
              <AppTextButton
                style={styles.cancelButton}
                title={t("imageInputTexts.cancelButtonTitle")}
                onPress={() => {
                  setPhotoModalVisible((prevMV) => !prevMV);
                }}
                textStyle={{ color: AppColors.text_dark, fontWeight: "bold" }}
              />
            </View>
          )}
        </View>
      </Modal>
    </>

    </ScreenWrapper>
  );
};

export default EditListingScreen;
