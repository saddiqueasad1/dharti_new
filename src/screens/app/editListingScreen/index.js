import React, { useCallback, useState } from "react";
import { FlatList, Text, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ChatIcon, ScreenWrapper } from "../../../components";
import Header from "../../../components/header";


export default function EditListingScreen({ navigation, route }) {
  
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Header navigation={navigation} title="Edit Listing" />
      )}
    >
        <View>
            <Text>edit...</Text>
        </View>

      
    </ScreenWrapper>
  );
}
