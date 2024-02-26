import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { AntDesign, Fontisto } from "@expo/vector-icons";

import { Head, IconButton, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";
import SelectDropdown from "react-native-select-dropdown";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentLanguage,
  setLanguage,
} from "../../../redux/slices/language";
import { storelangData } from "../../../utills/Methods";

export default function AppSetting({ navigation, route }) {
  const dispatch = useDispatch();
  const [show, setShow] = useState();
  const countries = [
    { key: "appseting.English", value: "en" },
    { key: "appseting.German", value: "de" },
    { key: "appseting.Italian", value: "it" },
    { key: "appseting.Spanish", value: "es" },
    { key: "appseting.French", value: "fr" },
  ];
  const { t, i18n } = useTranslation();
  const lang = useSelector(selectCurrentLanguage);

  const changeAppLanguage = async (newLanguage) => {
    // store.dispatch(changeLanguage(value)); // If you're using Redux
    await storelangData(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => (
        <Head headtitle={"appseting.title"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <Text
          style={{
            fontSize: height(2.5),
            width: width(100),
            padding: width(4),
            color: AppColors.black,
          }}
        >
          {t("appseting.language")}
        </Text>
        <SelectDropdown
          data={countries}
          defaultButtonText={t(
            countries.find((item) => {
              return item.value == lang;
            })?.key
          )}
          searchPlaceHolder={t("addPost.phsearchHere")}
          buttonStyle={styles.searchbox}
          selectedRowStyle={{ backgroundColor: AppColors.primary }}
          selectedRowTextStyle={{ color: AppColors.white }}
          buttonTextStyle={{
            textAlign: "left",
            fontSize: height(1.8),
          }}
          renderDropdownIcon={() => <AntDesign name="down" size={height(2)} />}
          dropdownIconPosition="right"
          dropdownStyle={styles.dropdown}
          onSelect={(selectedItem, index) => {
            dispatch(setLanguage(selectedItem.value));
            changeAppLanguage(selectedItem.value);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return t(selectedItem.key);
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return t(item.key);
          }}
        />
      </View>
    </ScreenWrapper>
  );
}
