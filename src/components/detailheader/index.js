import { Entypo, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { height, width } from "../../utills/Dimension";
import styles from "./styles";
import AppColors from "../../utills/AppColors";
import { Menu, MenuItem } from "react-native-material-menu";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCategoryList } from "../../redux/slices/config";

export default function DetailHeader({
  catgory,
  subcatgory,
  onPressBack,
  onPressShare,
  onPressOption,
  like = true,
  loginuser = false,
}) {
  const { t } = useTranslation();
  const list = useSelector(selectCategoryList);
  const cat = list.find((x) => x.name == catgory);
  const sub = cat?.subCategories.find((e) => e.name == subcatgory);
  return (
    <View style={styles.container}>
      <View style={styles.menuicon}>
        <TouchableOpacity onPress={onPressBack}>
          <Ionicons
            name="chevron-back"
            size={height(3.5)}
            color={AppColors.black}
          />
        </TouchableOpacity>
        {cat && (
          <View
            style={{
              flexDirection: "row",
              padding: height(1),
              backgroundColor: "white",
              alignContent: "center",
              alignItems: "center",
              width:width(75),
            }}
          >
            <Image
              tintColor={AppColors.primary}
              style={{
                width: height(4),
                height: height(4),
                paddingLeft: height(3),
              }}
              source={{ uri: cat?.image }}
            />
            <View>
              <Text
                style={{
                  color: AppColors.black,
                  fontSize: height(2),
                  paddingHorizontal: width(4.5),
                  fontWeight: "bold",
                }}
              >
                {t(`category.${cat?.name}`)}
              </Text>
              {sub && (
                <Text
                  style={{
                    color: AppColors.primary,
                    fontSize: height(1.5),
                    paddingHorizontal: width(4.5),
                  }}
                >
                  {t(`subList.${sub?.name}`)}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          style={{ marginRight: width(8) }}
          onPress={onPressShare}
        >
          <Entypo size={height(3)} name="share" color={AppColors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
