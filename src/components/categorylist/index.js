import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { selectCategoryList } from "../../redux/slices/config";
import ScreenNames from "../../routes/routes";
import CategoryIcon from "../categories";
import styles from "./styles";

export default function CategoryList({ navigation, search }) {
  const { t } = useTranslation();
  const d = useSelector(selectCategoryList);
  const [data, setData] = useState([d[0], d[1], d[2], d[8], d[9], d[13]]);
  useEffect(() => {
    console.log("set cat", d);
    if (d) {
      setData([d[0], d[1], d[2], d[8], d[9], d[13]]);
    }
  }, [d.length]);
  const renderItem = ({ item }) => {
    return (
      <CategoryIcon
        navigation={navigation}
        title={item?.name}
        image={item?.image}
        onPress={() => {
          navigation.navigate(ScreenNames.BIKECATEGORY, {
            category: item,
            find: item?.name,
            show: true,
          });
        }}
      />
    );
  };

  return (
    <View style={styles.main}>
      <View style={styles.titleview}>
        <Text style={styles.categorytext}>{t("categorylist.categories")}</Text>
        <Pressable
          onPress={() => {
            navigation.navigate(ScreenNames.CATEGORY, {
              search: search,
              value: "seeAll",
            });
          }}
        >
          {<Text style={styles.textseeall}>{t("categorylist.seeAll")}</Text>}
        </Pressable>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}
