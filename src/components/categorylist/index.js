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
  const categoryList = useSelector(selectCategoryList);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      setData(categoryList.slice(0, 6));
    }
  }, [categoryList]); // Update when categoryList changes

  const renderItem = ({ item }) => {
    return (
      <CategoryIcon
        navigation={navigation.name}
        title={item?.name.replace(/&amp;/g, '&')}
        image={item?.icon?.url} 
        onPress={() => {
          navigation.navigate(ScreenNames.LISTDATA, {
            category: item,
            find: item?.name,
            subcategory: item?.name,
            search: search || "",
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
          <Text style={styles.textseeall}>{t("categorylist.seeAll")}</Text>
        </Pressable>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item, index) => String(index)}
      />
    </View>
  );
}
