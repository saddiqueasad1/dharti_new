import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icons from "../../../asset/images";
import { Button, Head, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import styles from "./styles";
import { useTranslation } from "react-i18next";

import { ApiManager } from "../../../backend/ApiManager";

export default function DStoreDetailsScreen({ navigation, route }) {
  

  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"D Store"} navigation={navigation} />
      )}
      scrollEnabled={false}
    >
      <Text>detail screen................</Text>
    </ScreenWrapper>
  );
}
