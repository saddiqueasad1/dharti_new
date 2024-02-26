import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../backend/common";
import {
  CategoryIcon,
  Head,
  ScreenWrapper,
  SearchBar,
} from "../../../components";
import {
  selectCategoryList,
  setAppLoader,
  setCategoryList,
} from "../../../redux/slices/config";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";

export default function Search({ navigation, route }) {
  const data = useSelector(selectCategoryList);
  const search = route?.params?.search;
  const dispatch = useDispatch();
  const [searchString, setSearchString] = useState(search || "");
  useEffect(() => {
    onRefresh();
  }, []);
  const onRefresh = async () => {
    async function getCategorylist() {
      const d = await getCategory();
      if (d) dispatch(setCategoryList(d));
    }
    // setRefreshing(true);
    try {
      if (!data || data.length < 1) {
        dispatch(setAppLoader(true));
        getCategorylist();
        setTimeout(() => {
          dispatch(setAppLoader(false));
        }, 1000);
      }
    } catch (error) {}
  };

  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"Search"} navigation={navigation} />
      )}
    >
      <View
        style={[
          {
            margin: height(1),
            paddingBottom: height(5),
            flex: 1,
            marginBottom: height(2),
            justifyContent: "space-between",
          },
        ]}
      >
        <SearchBar
          search={searchString}
          setSearch={setSearchString}
          containerstyle={{
            width: width(95),
            borderRadius: height(1),
            flexDirection: "row",
            flex: 3,
            borderWidth: height(0.1),
            alignItems: "center",
            paddingVertical: height(0.5),
          }}
          onPress={() => {
            if (route?.params?.sub) {
              navigation.navigate(ScreenNames.LISTDATA, {
                category: route?.params?.category,
                find: route?.params?.sub,
                subcategory: route?.params?.sub,
                search: searchString,
              });
            } else {
              navigation.navigate(ScreenNames.LISTDATA, {
                category: route?.params?.category,
                find: route?.params?.category,
                subcategory: route?.params?.sub,
                search: searchString,
              });
            }
          }}
        />
        <View>
          <Text
            style={{
              padding: height(0.5),
              fontSize: height(2.5),
              fontWeight: "bold",
            }}
          >
            Popular categories
          </Text>
        </View>
        <View style={{ flex: 5 }}>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <CategoryIcon
                  navigation={navigation}
                  cardStyle={styles.card}
                  title={item?.name}
                  image={item?.image}
                  textStyle={styles.textStyle}
                  imageStyle={styles.imageStyle}
                  onPress={() => {
                    navigation.navigate(ScreenNames.BIKECATEGORY, {
                      category: item,
                      find: item?.name,
                      show: true,
                      search: search || "",
                    });
                  }}
                />
              );
            }}
            numColumns={1}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
