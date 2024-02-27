import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../backend/common";
import { CategoryIcon, Head, Header, ScreenWrapper } from "../../../components";
import { selectCategoryList, setAppLoader, setCategoryList } from "../../../redux/slices/config";
import ScreenNames from "../../../routes/routes";
import styles from "./styles";
import { useTranslation } from "react-i18next";

export default function Category({ navigation, route }) {
  const { t } = useTranslation();
  const categoryList = useSelector(selectCategoryList);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!categoryList || categoryList.length === 0) {
      // Fetch category list if it's not available
      getCategoryList();
    }
  }, []);

  const getCategoryList = async () => {
    try {
      dispatch(setAppLoader(true)); // Show loader while fetching data
      const data = await getCategory();
      if (data) {
        dispatch(setCategoryList(data));
      }
    } catch (error) {
      console.log("Error fetching category list:", error);
    } finally {
      dispatch(setAppLoader(false)); // Hide loader after fetching data
    }
  };

  const renderCategoryItem = ({ item }) => {
    return (
        <CategoryIcon
          title={item?.name}
          image={item?.icon?.url} 
          cardStyle={styles.categoryIcon}
          onPress={() => navigateToCategory(item)}
        />
    );
  };

  const navigateToCategory = (item) => {
    navigation.navigate(ScreenNames.LISTDATA, {
      category: item,
      find: item?.name,
      subcategory: item?.name,
      search: "",
    });
  };

  return (
    <ScreenWrapper
      headerUnScrollable={() =>
        route?.params ? (
          <Head headtitle={"categorylist.categories"} navigation={navigation} />
        ) : (
          <Header navigation={navigation} title={t("addPost.post")} />
        )
      }
    >
      <FlatList
        data={categoryList}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.categoryList}
        numColumns={3}
      />
    </ScreenWrapper>
  );
}
