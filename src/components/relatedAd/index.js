import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import Icons from "../../asset/images";
import { getAllData } from "../../backend/api";
import AppColors from "../../utills/AppColors";
import { width } from "../../utills/Dimension";
import CardView from "../CardView";
import styles from "./styles";
import { useTranslation } from "react-i18next";

export default function RelatedAd({ category, id }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [refreshing, onRefresh] = useState(false);
  const queryParams = {
    category: category || "",
    page: 1, // Adjust the page number as needed
  };
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    onRefresh(true);
    let d = await getAllData(queryParams);
    if (d) {
      setData(d?.ad);
    } else {
      setData([]);
    }
    onRefresh(false);
  };
  const renderItem = ({ item }) => (
    <View style={{ width: width(100), alignItems: "center" }}>
      <CardView data={item} />
    </View>
  );
  const emptyView = () => (
    <View style={styles.emptyview}>
      {refreshing ? (
        <ActivityIndicator size={"large"} color={AppColors.primary} />
      ) : (
        <Image source={Icons.empty} style={styles.emptyimage} />
      )}
    </View>
  );
  return (
    <View style={styles.main}>
      {data.length>0 && (
        <View style={styles.titleview}>
          <Text style={{ fontSize: width(4), fontWeight: "bold", color: AppColors.black, }}>
            {t("detail.relatedAds")}
          </Text>
        </View>
      )}
      <View
        style={{
          width: width(100),
          alignItems: "center",
        }}
      >
        <FlatList
          scrollEnabled={false}
          data={data.filter((item) => item?._id != id)}
          renderItem={renderItem}
          ListEmptyComponent={emptyView}
          keyExtractor={(item, index) => index}
        />
      </View>
    </View>
  );
}
