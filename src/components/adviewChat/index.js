import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import AppColors from "../../utills/AppColors";
import styles from "./styles";
import Button from "../button";
import Icons from "../../asset/images";
import { height, width } from "../../utills/Dimension";
import ScreenNames from "../../routes/routes";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectUserMeta } from "../../redux/slices/user";

const AdView = ({ detail, onPressView }) => {
  const navigation = useNavigation();
  const user = useSelector(selectUserMeta);
  function isNullOrNullOrEmpty(value) {
    return (
      value === null ||
      value === "" ||
      value === "null" ||
      value === undefined ||
      value === "undefined"
    );
  }
  return (
    <TouchableOpacity 
      disabled={detail?.userId?._id != user?._id && !detail?.visibility}
      onPress={() => navigation.navigate(ScreenNames.DETAIL, detail)}
      style={styles.container}
    >
      {detail?.images && (
        <Image
          style={styles.image}
          source={{ uri: detail?.images[0] }}
          resizeMode="cover"
        />
      )}
      <View style={styles.textview}>
        <Text style={styles.title} numberOfLines={1}>
          {detail?.title}
        </Text>
        {!isNullOrNullOrEmpty(detail?.subCategory) ? (
          <Text style={styles.price}>{detail?.subCategory} </Text>
        ) : (
          <Text style={styles.price}>{detail?.category} </Text>
        )}
      </View>
      <Entypo name="chevron-right" size={height(5)} />
      {!detail?.visibility && (
        <View
          style={{
            height: height(10),
            borderRadius: width(2),
            width: width(95),
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            position: "absolute",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default AdView;
