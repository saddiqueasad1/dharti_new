import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icons from "../../../asset/images";
import { Button, Head, ScreenWrapper } from "../../../components";
import AppColors from "../../../utills/AppColors";
import styles from "./styles";
import { useTranslation } from "react-i18next";

import { ApiManager } from "../../../backend/ApiManager";

const paginationData = {
  home: { per_page: 30 },
  search: { page: 1, per_page: 30 },
  myListings: { page: 1, per_page: 30 },
  favourites: { page: 1, per_page: 30 },
  allStores: { page: 1, per_page: 30 },
  storeDetails: { page: 1, per_page: 30 },
  paymentHistory: { page: 1, per_page: 30 },
  rating: { page: 1, per_page: 10 },
};
const allStoresFallBackImages = {
  storeCardLogo: require("../../../asset/images/100x100.png"),
};

export default function DStore({ navigation, route }) {
  // const [{ appSettings, rtl_support }] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [storesData, setStoresData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(
    pagination.page || paginationData.allStores.page
  );
  //  Initial Call
  useEffect(() => {
    getStoresData(paginationData.allStores);
  }, []);

  // Refreshing get listing call
  useEffect(() => {
    if (!refreshing) return;
    setCurrentPage(1);
    setPagination({});
    getStoresData(paginationData.allStores);
  }, [refreshing]);

  // next page get listing call
  useEffect(() => {
    if (!moreLoading) return;
    const data = {
      per_page: paginationData.allStores.per_page,
      page: currentPage,
    };
    getStoresData(data);
  }, [moreLoading]);

  const getStoresData = (paginationData) => {
    ApiManager.get("stores", paginationData)
      .then((res) => {
        const newData = res.data;
        const pagi = res.pagination;
        if (newData && newData.length > 0) {
          // Assuming res is the direct array of stores
          if (refreshing) {
            setRefreshing(false);
          }
          if (moreLoading) {
            setStoresData((prevStoresData) => [...prevStoresData, ...newData]);
            setMoreLoading(false);
          } else {
            setStoresData(newData);
          }
          setPagination(pagi ? pagi : {});

          if (loading) {
            setLoading(false);
          }
        } else {
          // Handle the case when res is empty or not as expected
          if (refreshing) {
            setRefreshing(false);
          }
          if (moreLoading) {
            setMoreLoading(false);
          }
          if (loading) {
            setLoading(false);
          }
        }
      })
      .catch((error) => {
        // Make sure to catch any error and update the state accordingly
        console.error("Error fetching stores:", error);
        setRefreshing(false);
        setMoreLoading(false);
        setLoading(false);
      });
  };

  const renderListItem = useCallback(
    ({ item }) => <StoreCard item={item} />,
    []
  );

  const handleStoreCardPress = (item) => {
    navigation.navigate(routes.storeDetailsScreen, { storeId: item.id });
  };
  const StoreCard = ({ item }) => (
    <View style={styles.storeWrap}>
      <TouchableOpacity
        style={styles.storeContent}
        onPress={() => handleStoreCardPress(item)}
      >
        <View style={styles.logoWrap}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.logo} />
          ) : (
            <Image
              source={allStoresFallBackImages.storeCardLogo}
              style={styles.logo}
            />
          )}
        </View>
        <Text style={[styles.storeCardTitle]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.storeCardListingCount]}>
          {item.listings_count ? item.listings_count : 0}
          {"  ads"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const keyExtractor = useCallback((item, index) => `${index}`, []);
  const EmptyListComponent = () => (
    <View>
      <Text>{"Sorry, No shop has been registered yet."}</Text>
    </View>
  );
  const listFooter = () => {
    if (pagination && pagination.total_pages > pagination.current_page) {
      return (
        <View style={styles.loadMoreWrap}>
          <ActivityIndicator size="small" color={AppColors.primary} />
        </View>
      );
    } else {
      return null;
    }
  };

  const onRefresh = () => {
    if (moreLoading) return;
    setRefreshing((prevRefreshing) => true);
  };

  const handleNextPageLoading = () => {
    if (refreshing) return;
    if (pagination && pagination.total_pages > pagination.current_page) {
      setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
      setMoreLoading(true);
    }
  };

  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <Head headtitle={"D Store"} navigation={navigation} />
      )}
      scrollEnabled={false}
    >
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text>Getting store data""Getting store data</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={storesData}
            renderItem={renderListItem}
            keyExtractor={keyExtractor}
            horizontal={false}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            onEndReached={handleNextPageLoading}
            onEndReachedThreshold={0.5}
            ListFooterComponent={listFooter}
            maxToRenderPerBatch={15}
            windowSize={60}
            onRefresh={onRefresh}
            refreshing={refreshing}
            scrollEventThrottle={1}
            ListEmptyComponent={EmptyListComponent}
            contentContainerStyle={{
              marginHorizontal: 5,
              paddingVertical: 5,
            }}
          />
        </View>
      )}
    </ScreenWrapper>
  );
}
