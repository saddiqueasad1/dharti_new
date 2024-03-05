import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Head, ScreenWrapper } from "../../../components";
import CardView from "../../../components/CardView";
import {
  selectFavAds,
  selectToken,
  selectUserMeta,
  setAdsFav,
} from "../../../redux/slices/user";
import { MaterialIcons } from "@expo/vector-icons";

import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
//import { data } from "../../../utills/Data";
import { getFavAds } from "../../../backend/auth";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { ApiManager } from "../../../backend/ApiManager";
import DeleteIcon from "../../../asset/svgComponents/DeleteIcon";

export default function WishList({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserMeta);
  const userFav = useSelector(selectFavAds);
  const id = userInfo?._id;
  const auth_token = useSelector(selectToken);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const data = {
      per_page: 30,
      page: 1,
    };
    getData(data);
  }, [userFav?.length]);
  const getData = useCallback(async (data) => {
    setLoader(true);
    ApiManager.setAuthToken(auth_token);
    let d = await getFavAds(data);
    if (d) {
      let all = d.map((item) => {
        return item._id;
      });
      dispatch(setAdsFav(all));
      setData(d);
    } else setData([]);
    setLoader(false);
  }, []);

  const handleRemoveFromFavorites = async (listing) => {
    try {
      setLoader(true);
      ApiManager.setAuthToken(auth_token);
      let res = await getFavAds(data);
      setLoader(false);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const handleRemoveFavAlert = (listing) => {
    Alert.alert(
      "",
      t("commmon.removePromptMessage"),
      [
        {
          text: t("commmon.removeButtonTitle"),
          style: "cancel",
        },
        {
          text: t("commmon.cancelButtonTitle"),
          onPress: () => handleRemoveFromFavorites(listing),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"wishList.title"} navigation={navigation} />
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={{ width: width(100), alignItems: "center" }}>
          {data?.length === 0 ? (
            loader ? (
              <ActivityIndicator color={AppColors.primary} size={"large"} />
            ) : (
              <View
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  height: height(80),
                }}
              >
                <MaterialIcons
                  name="favorite-border"
                  size={width(60)}
                  color={AppColors.bgIcon}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: height(2),
                  }}
                >
                  {t("commmon.nothingtoshow")}
                </Text>
              </View>
            )
          ) : (
            data.map((item, index) => (
              <View>
                <TouchableOpacity
                  disabled={!item?.visibility}
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate(ScreenNames.DETAIL, item);
                  }}
                  key={index}
                  style={{ width: width(100), alignItems: "center" }}
                >
                  <CardView data={item} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleRemoveFavAlert}
                >
                  <View style={styles.dltIconWrap}>
                    <DeleteIcon fillColor={AppColors.black} />
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
