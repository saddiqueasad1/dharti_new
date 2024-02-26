import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Head, ScreenWrapper } from "../../../components";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import styles from "./styles";

export default function BikeCategory({ navigation, route }) {
  const subCategories = route?.params?.subCategories;
  const search = route?.params?.search;
  const { t } = useTranslation();
  const cat = route?.params?.category;

  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => (
        <Head headtitle={t(`category.${cat?.name}`)} navigation={navigation} />
      )}
    >
      <View
        style={[
          styles.mainViewContainer,
          { paddingBottom: !route?.params?.show ? 0 : height(8) },
        ]}
      >
        <FlatList
          data={cat?.subCategories || []}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: AppColors.greybackground,
                height: 1,
                width: width(95),
                alignSelf:'center'
              }}
            />
          )}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.card}
                onPress={() => {
                  if (!route?.params?.show) {
                    navigation.navigate(ScreenNames.ADDPOST, {
                      category: cat?.name,
                      find: item?.name,
                      subcategory: item?.name,
                    });
                  } else {
                    navigation.navigate(ScreenNames.LISTDATA, {
                      category: cat?.name,
                      find: item?.name,
                      subcategory: item?.name,
                      search: search || "",
                    });
                  }
                }}
              >
                {/* <Image
                  source={{ uri: item?.image ? item?.image : cat?.image }}
                  style={{ width: height(4), height: height(4) }}
                /> */}
                <Text style={{ fontSize: height(1.6), color: AppColors.black }}>
                  {t(`subList.${item.name}`)}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index}
        />
      </View>
    </ScreenWrapper>
  );
}
