import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// Vector Icons
import { FontAwesome5 } from "@expo/vector-icons";

// Custom Components & Functions
import  AppColors from "../../../utills/AppColors";
import { decodeString } from "../../../utills/helper";
import ChevronRightIcon from "../../../asset/svgComponents/ChevronRightIcon";
import { ApiManager } from "../../../backend/ApiManager";
import { useDispatch } from "react-redux";
import { updateAppState } from "../../../redux/slices/appConfig";

const maximumPickerLevelArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SelectLocationScreen = ({ route, navigation }) => {
const dispatch = useDispatch();

  const [goBack, setGoBack] = useState(false);
  const [location, setLocation] = useState([]);
const rtl_support = false
  const [locationData, setLocationData] = useState({
    0: [...route.params.data],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!goBack) return;
    if (route.params.type === "search") {
      handleSearchLocationStateUpdate();
    } else if (route.params.type === "newListing") {
      handleListingLocationStateUpdate();
    }
  }, [goBack]);

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
  const handleSearchLocationStateUpdate = () => {
    if (location.length) {
      dispatch({
        type: "SET_SEARCH_LOCATIONS",
        search_locations: location,
      });
      navigation.goBack();
    } else {
      dispatch({
        type: "SET_SEARCH_LOCATIONS",
        search_locations: [],
      });
      navigation.goBack();
    }
  };
  const handleListingLocationStateUpdate = () => {
    console.log(location);
    if (location.length) {
      // dispatch({
      //   type: "SET_LISTING_LOCATIONS",
      //   listing_locations: location,
      // });
      dispatch(updateAppState({ search_locations: location }));
      navigation.goBack();
    }
  };
  const handlePickerSelection = (item) => {
    setLoading(true);
    setLocation((prevLocation) => [...prevLocation, item]);

    ApiManager.get("locations", { parent_id: item.term_id }).then((res) => {
    //   if (res.ok) {
        if (res.length) {
          setLocationData((prevLocationData) => {
            const index = Object.keys(prevLocationData).length;
            const newData = { ...prevLocationData };
            newData[index] = [...res];
            return newData;
          });
          setLoading(false);
        } else {
          setGoBack(true);
        }
    //   } else {
    //     if (res.problem === "TIMEOUT_ERROR") {
    //       setErrorMessage(
    //         t(
    //           "selectLocationScreenTexts.errorMessages.timeOut"
    //         )
    //       );
    //     } else {
    //       setErrorMessage(
    //         res?.data?.error_message ||
    //           res?.data?.error ||
    //           res?.problem ||
    //           t(
    //             "selectLocationScreenTexts.errorMessages.serverError"
    //           )
    //       );
    //     }
    //     setLoading(false);
    //   }
    });
  };
  const handleAllOptionSelection = () => {
    setGoBack(true);
  };
  const handleWholeAreaSelection = () => {
    setGoBack(true);
  };
  const handleSelectedLocationPress = (arg) => {
    setLocation((prevLocation) => prevLocation.slice(0, arg));
    const selectedData = {};
    for (let i = 0; i <= arg; i++) {
      selectedData[i] = locationData[i];
    }
    setLocationData(selectedData);
  };
  const locationPicker = (index) => {
    if (location.length < index) return;
    return (
      <View key={index}>
        {location[index] && (
          <TouchableOpacity
            style={[styles.selectedOptionsWrap]}
            disabled={loading}
            onPress={() => handleSelectedLocationPress(index)}
          >
            <Text style={[styles.selectedOptionsText, rtlText]}>
              {location[index]
                ? decodeString(location[index].name)
                : t(
                    "selectLocationScreenTexts.nextLevelLocation"
                  )}
            </Text>
            <FontAwesome5 name="times" size={16} color={ AppColors.white} />
          </TouchableOpacity>
        )}
        {location.length === 0 &&
          !location[index] &&
          !loading &&
          route.params.type === "search" && (
            <TouchableOpacity
              disabled={loading}
              style={styles.allLocationWrap}
              onPress={handleWholeAreaSelection}
            >
              <Text style={[styles.allLocationText, rtlText]}>
                {t("selectLocationScreenTexts.showAll")}
              </Text>
            </TouchableOpacity>
          )}
        {location.length > 0 &&
          !location[index] &&
          !loading &&
          route.params.type === "search" && (
            <View
              style={{
                alignItems: "center",
                borderBottomColor:  AppColors.border_light,
                borderBottomWidth: 1,
                marginHorizontal: "3%",
              }}
            >
              <TouchableOpacity
                style={[{ paddingVertical: 15 }, rtlView]}
                onPress={handleAllOptionSelection}
                disabled={loading}
              >
                <Text style={[styles.pickerOptionsText, rtlText]}>
                  {t(
                    "selectLocationScreenTexts.showAllofLocation"
                  )}{" "}
                  {decodeString(location[index - 1].name)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        {!location[index] && !loading && (
          <View style={styles.view}>
            {locationData[index].map((item) => (
              <TouchableOpacity
                key={item.term_id}
                onPress={() => handlePickerSelection(item)}
                style={[styles.pickerOptions]}
                disabled={loading}
              >
                <Text style={[styles.pickerOptionsText, rtlText]}>
                  {decodeString(item.name)}
                </Text>
                <ChevronRightIcon fillColor={ AppColors.gray} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {!location[index] && loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={ AppColors.primary} />
          </View>
        )}
        {!loading && !!errorMessage && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={[styles.text, rtlText]}>{errorMessage}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: "#F8F8F8", flex: 1 }}>
      <ScrollView>
        {maximumPickerLevelArr.map((picker, index) => locationPicker(index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  allLocationText: {
    color:  AppColors.white,
    fontWeight: "bold",
  },
  allLocationWrap: {
    backgroundColor:  AppColors.primary,
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 3,
    marginVertical: 15,
    marginHorizontal: "3%",
  },
  container: {
    backgroundColor:  AppColors.white,
  },
  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor:  AppColors.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    flex: 1,
  },

  pickerOptions: {
    borderBottomColor:  AppColors.border_light,
    borderBottomWidth: 1,
    paddingVertical: 15,
    marginHorizontal: "3%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerOptionsText: {
    color:  AppColors.text_dark,
    fontSize: 16,
    textAlign: "left",
  },
  scrollContainer: {},
  selectedOptionsText: {
    color:  AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  selectedOptionsWrap: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "3%",
    backgroundColor:  AppColors.primary,
    marginHorizontal: "3%",
    marginTop: "3%",
    borderRadius: 5,
  },
});

export default SelectLocationScreen;
