import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  Button,
  Card,
  Head,
  IconButton,
  Input,
  ScreenWrapper,
} from "../../../components";
import AppColors from "../../../utills/AppColors";
//import { data } from "../../../utills/Data";
import RadioButtonRN from "radio-buttons-react-native";
import { useTranslation } from "react-i18next";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import Icons from "../../../asset/images";
import {
  backEndDataAPi,
  geVehicleCategory,
  geVehicleMakes,
  getAllData,
  getModel,
} from "../../../backend/api";
import { selectCategoryList, setAppLoader } from "../../../redux/slices/config";

import { useRoute } from "@react-navigation/native";
import CheckBox from "react-native-check-box";
import ScreenNames from "../../../routes/routes";
import { sortList } from "../../../utills/Data";
import { height, width } from "../../../utills/Dimension";
import { showType } from "../../../utills/Methods";
import styles from "./styles";

export default function ListData({ navigation }) {
  const route = useRoute();
  const { t } = useTranslation();
  const cat = route?.params?.category;
  const find = route?.params?.find;
  const sub = route?.params?.subcategory;
  const ti = route?.params?.search;
  const refRBSheet = useRef();
  const s = useSelector(selectCategoryList);
  const [feild, setFeild] = useState();
  const dispatch = useDispatch();
  const [findValue, setFindValue] = useState(find);
  const modelRef = useRef();
  const [sortby, setSortby] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [subCategory, setSubCategory] = React.useState(sub);

  const [title, setTitle] = React.useState(ti || "");
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pricefrom, setPricefrom] = React.useState();
  const [priceto, setPriceto] = React.useState("");
  const [condition, setCondition] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [category, setCategory] = React.useState(cat);
  const [searchString, setSearchString] = useState("");
  const [km, setKm] = React.useState("");
  const [refreshing, onRefresh] = React.useState(false);
  const [refresh, setRefreshing] = useState(false);
  const [empty, setempty] = React.useState(false);
  /////new add
  const [year, setYear] = React.useState("");
  const [bodyshape, setBodyshap] = React.useState("");
  const [gearbox, setGearbox] = React.useState("");
  const [fueltype, setFueltype] = React.useState("");
  const [exterior, setExterior] = React.useState("");
  const [interior, setInterior] = React.useState("");
  const [type, setType] = useState();
  const [loder, setLoder] = React.useState(false);
  const [vcompanies, setVcompanies] = React.useState([]);
  const [vCategory, setVCategory] = React.useState();
  const [filter, setFilter] = React.useState(false);
  const [data, setData] = useState([]);
  const [totalAds, setTotalAds] = useState(0);
  const [apimodel, setapiModel] = React.useState([]);

  const [otherBrand, setOtherBrand] = React.useState(false);
  const [otherModel, setOtherModel] = React.useState(false);
  let uniqueEntries = {};
  const queryParams = {
    address: address.trim() || "",
    category: category || "",
    subCategory: subCategory || "",
    condition: condition || "",
    title: title.trim() || "",
    brand: brand || "",
    model: model || "",
    year: year || "",
    type: type || "",
    minPrice: priceto || "",
    maxPrice: pricefrom || "",
    sortBy: sortby || "",
    km: km || "",
    bodyShape: bodyshape || "",
    gearBox: gearbox || "",
    fuelType: fueltype || "",
    page: pageNumber, // Adjust the page number as needed
  };
  const clearAll = () => {
    setTitle("");
    setAddress("");
    setBrand("");
    setModel("");
    setYear("");
    setPricefrom("");
    setPriceto("");
    setSortby("");
    setKm("");
    setBodyshap("");
    setGearbox("");
    setFueltype("");
    setCondition("");
    setData([]);
    setempty(false);
    setCategory("");
    setSubCategory("");
    setFindValue("");
    if (pageNumber != 0) {
      setPageNumber(1);
    }
    setFilter(filter + 1);
  };

  useEffect(() => {
    dispatch(setAppLoader(true));
    getData();
    dispatch(setAppLoader(false));
  }, []);
  useEffect(() => {
    if (brand) getmodel(findValue, brand);
  }, [brand]);
  const getmodel = async (a, b) => {
    dispatch(setAppLoader(true));
    let cardata = await getModel(a, b);

    if (cardata) {
      setapiModel(cardata);
      dispatch(setAppLoader(false));
    } else {
      setapiModel(false);
      dispatch(setAppLoader(false));
    }
    dispatch(setAppLoader(false));
  };
  useEffect(() => {
    if (filter) getData();
  }, [filter]);
  const handleEndReached = () => {
    getData();
  };
  useEffect(() => {
    getvehicleMake();
    if (showType(category)) {
      getvehicleSubCategory();
    }
    getFeilds();
  }, [category]);
  const getFeilds = async () => {
    let data = await backEndDataAPi({
      type: findValue,
    });
    setFeild(data);
  };
  const getvehicleMake = async () => {
    setLoder(true);
    let vehicledata = await geVehicleMakes(findValue);
    if (vehicledata) {
      setLoder(false);
      setVcompanies(vehicledata);
    } else {
      setLoder(false);
      setVcompanies([]);
    }
    setLoder(false);
  };
  const getvehicleSubCategory = async () => {
    let vehicledata = await geVehicleCategory(findValue);
    if (vehicledata) {
      setVCategory(vehicledata);
    } else {
      setVCategory([]);
    }
  };
  const getSubcategoriesByName = (categories, categoryName) => {
    const matchedCategory = categories.find(
      (category) => category.name === categoryName
    );

    if (matchedCategory) {
      return matchedCategory;
    }

    // Return an empty array if no match is found
    return [];
  };

  const getData = async () => {
    onRefresh(true);
    let d = await getAllData(queryParams);
    if (d?.ad.length == 0) {
      setempty(true);
    }
    if (d) {
      setTotalAds(d?.totalAds);
      setData((prevData) => [...prevData, ...d?.ad]);
      setPageNumber(pageNumber + 1);
    } else {
      setData([]);
    }
    onRefresh(false);
  };

  const rdata = [
    {
      key: "new",
      label: t("condition.new"),
    },
    {
      key: "used",
      label: t("condition.used"),
    },
    {
      key: "recondition",
      label: t("condition.Recondition"),
    },
  ];
  const otherModelFuntion = () => {
    if (!otherModel) {
      if (model) {
        setModel("");
      }
      setModel("Others");
      setOtherModel(!otherModel);
    } else {
      if (model) {
        setModel("");
      }
      setOtherModel(!otherModel);
    }
  };
  const otherBrandFuntion = () => {
    if (!otherBrand) {
      if (model) {
        setModel("");
        setOtherModel(false);
      }
      setBrand("Others");
      setOtherBrand(!otherBrand);
    } else {
      if (brand) {
        setModel("");
        setBrand("");
      }
      setOtherBrand(!otherBrand);
    }
  };
  const Refresh = async () => {
    // setRefreshing(true);
    dispatch(setAppLoader(true));
    setData([]);
    setempty(false);
    if (pageNumber != 0) {
      setPageNumber(1);
    }
    setFilter(filter + 1);
    setTimeout(() => {
      dispatch(setAppLoader(false));
    }, 1000);
  };

  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => (
        <View style={{ backgroundColor: "white" }}>
          <Head
            headtitle={category ? t(`category.${category}`) : "allData.title"}
            navigation={navigation}
          />
          <IconButton
            title={title ? title : t("searchbar.phsearch")}
            containerStyle={{
              backgroundColor: "white",
              width: width(98),
              borderWidth: height(0.05),
              marginVertical: height(1),
            }}
            textStyle={{
              color: "grey",
              fontWeight: "100",
              fontSize: height(1.5),
              width: width(80),
            }}
            icon={
              <Ionicons
                name="search"
                style={{ marginHorizontal: height(1) }}
                color="lightgrey"
                size={height(2.5)}
              />
            }
            onPress={() => {
              navigation.pop();
              navigation.replace(ScreenNames.SEARCH, {
                category: category,
                find: category,
                search: title,
                sub: subCategory,
                show: true,
              });
            }}
          />
          <View style={styles.totalview}>
            <Text style={styles.totaltext}>
              {t("allData.totalresult")} : {totalAds}
            </Text>
            <View style={styles.iconview}>
              <TouchableOpacity
                style={{ marginLeft: height(2) }}
                onPress={() => refRBSheet.current.open()}
              >
                <FontAwesome
                  name="sliders"
                  size={height(3)}
                  color={AppColors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      // refreshing={refresh}
      // onRefresh={Refresh}
    >
      <View style={styles.mainViewContainer}>
        <FlatList
          key={"coloum1"}
          data={data.filter((entry) => {
            if (!uniqueEntries[entry._id]) {
              uniqueEntries[entry._id] = true;
              return true;
            }
            return false;
          })}
          style={styles.flatlist}
          renderItem={({ item }) => (
            <View style={{ width: width(98), alignItems: "center" }}>
              <Card data={item} />
            </View>
          )}
          ListEmptyComponent={({ item }) => (
            <View style={styles.emptyview}>
              {refreshing ? (
                <ActivityIndicator size={"large"} color={AppColors.primary} />
              ) : (
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: height(1.5),
                      alignSelf: "center",
                    }}
                  >
                    {t("commmon.nothingtoshow")}
                  </Text>
                  <Image source={Icons.empty} style={styles.emptyimage} />
                </View>
              )}
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={Refresh}
              colors={[AppColors.primary]}
            />
          }
          numColumns={1}
          onEndReached={() => {
            if (!empty) handleEndReached();
          }} // Callback when the end is reached
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            !loder && !empty ? (
              <ActivityIndicator size={"large"} color={AppColors.primary} />
            ) : (
              <></>
            )
          }
          keyExtractor={(item, index) => index}
        />
      </View>
      {/* )} */}
      <View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          closeOnPressBack={true}
          height={height(85)}
          customStyles={styles.bs}
        >
          {refreshing ? (
            <ActivityIndicator color={AppColors.primary} size={"large"} />
          ) : (
            <View style={styles.container}>
              <View
                style={{
                  marginBottom: width(3),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: height(3),
                    fontWeight: "bold",
                  }}
                >
                  {t("allData.filter")}
                </Text>
                <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                  {/* <Text
                      style={{
                        fontSize: width(4),
                        color: AppColors.primary,
                      }}
                    >
                      Close
                    </Text> */}
                  <AntDesign
                    name="closesquare"
                    size={height(3)}
                    color={AppColors.primary}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ paddingBottom: height(5) }}>
                  <IconButton
                    onPress={() => {
                      refRBSheet.current.close();
                      setTimeout(() => {
                        navigation.pop();
                        navigation.replace(ScreenNames.CATEGORY, {
                          search: title,
                          value: "seeAll",
                        });
                      }, 600);
                    }}
                    title={
                      category
                        ? t(`category.${category}`)
                        : "filter.selectCategory"
                    }
                    containerStyle={styles.containerb}
                    textStyle={styles.texticon}
                    iconright={
                      <Ionicons name="chevron-forward" size={height(2)} />
                    }
                  />

                  {subCategory && (
                    <IconButton
                      onPress={() => {
                        refRBSheet.current.close();
                        setTimeout(() => {
                          navigation.pop();
                          navigation.replace(ScreenNames.BIKECATEGORY, {
                            category: getSubcategoriesByName(s, category),
                            find: category,
                            search: title,
                            show: true,
                          });
                        }, 600);
                      }}
                      title={t(`subList.${subCategory}`)}
                      containerStyle={styles.containerb}
                      textStyle={styles.texticon}
                      iconright={
                        <Ionicons name="chevron-forward" size={height(2)} />
                      }
                    />
                  )}
                  <View style={{ alignSelf: "center" }}>
                    <Text style={styles.title}>{t("allData.sortby")}</Text>
                    <SelectDropdown
                      data={sortList}
                      defaultValueByIndex={sortby ? -1 : 0}
                      defaultButtonText={
                        t(sortList.find((item) => item.value == sortby)?.key) ||
                        t("allData.defaultValueDropdown")
                      }
                      searchPlaceHolder={t("allData.phsearchHere")}
                      defaultValue={sortby}
                      buttonStyle={styles.searchbox}
                      selectedRowStyle={{
                        backgroundColor: AppColors.primary,
                      }}
                      selectedRowTextStyle={{ color: AppColors.white }}
                      buttonTextStyle={{
                        textAlign: "left",
                        fontSize: height(1.6),
                      }}
                      dropdownStyle={styles.dropdown}
                      onSelect={(selectedItem, index) => {
                        setSortby(selectedItem.value);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return t(`${selectedItem.key}`);
                      }}
                      rowTextForSelection={(item, index) => {
                        return t(item.key);
                      }}
                    />
                  </View>

                  <View style={{ paddingVertical: width(1) }}>
                    <Text style={styles.title}>{t("allData.address")}</Text>
                    <Input
                      value={address}
                      setvalue={setAddress}
                      placeholder={"allData.searchbyaddress"}
                      containerStyle={[
                        {
                          width: width(90),
                          backgroundColor: AppColors.greybackground,
                          borderBottomWidth: 0,
                          borderRadius: width(1),
                        },
                      ]}
                    />
                  </View>
                  <View style={{ paddingLeft: 4, paddingVertical: width(1) }}>
                    <Text style={styles.title}>{t("allData.pricerang")}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Input
                        value={pricefrom}
                        setvalue={setPricefrom}
                        placeholder={"allData.from"}
                        containerStyle={styles.price}
                      />
                      <Input
                        value={priceto}
                        setvalue={setPriceto}
                        placeholder={"allData.to"}
                        containerStyle={styles.price}
                      />
                    </View>
                  </View>
                  {!(vCategory == undefined || vCategory == []) && category && (
                    <View style={{ alignSelf: "center" }}>
                      <Text style={styles.title}>{t("addPost.type")}</Text>

                      <SelectDropdown
                        defaultButtonText={t("addPost.defaultValueDropdown")}
                        data={vCategory}
                        searchPlaceHolder={t("addPost.phsearchHere")}
                        buttonStyle={styles.searchbox}
                        selectedRowStyle={{
                          backgroundColor: AppColors.primary,
                        }}
                        selectedRowTextStyle={{ color: AppColors.white }}
                        buttonTextStyle={{
                          textAlign: "left",
                          fontSize: height(1.6),
                        }}
                        dropdownStyle={styles.dropdown}
                        onSelect={(selectedItem, index) => {
                          setType(selectedItem);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return t(`type.${selectedItem}`);
                        }}
                        rowTextForSelection={(item, index) => {
                          return t(`type.${item}`);
                        }}
                      />
                    </View>
                  )}

                  {category && (
                    <View style={{ alignSelf: "center" }}>
                      <Text style={styles.title}>{t("addPost.brand")}</Text>
                      <SelectDropdown
                        defaultButtonText={
                          brand
                            ? brand === "Others"
                              ? t("category.Others")
                              : brand
                            : t("addPost.defaultValueDropdown") ||
                              t("addPost.defaultValueDropdown")
                        }
                        data={vcompanies}
                        search={true}
                        onFocus={false}
                        disabled={otherBrand}
                        searchPlaceHolder={t("addPost.phsearchHere")}
                        buttonStyle={styles.searchbox}
                        selectedRowStyle={{
                          backgroundColor: AppColors.primary,
                        }}
                        selectedRowTextStyle={{ color: AppColors.white }}
                        buttonTextStyle={{
                          textAlign: "left",
                          fontSize: height(1.6),
                        }}
                        dropdownStyle={styles.dropdown}
                        onSelect={(selectedItem, index) => {
                          if (model) modelRef.current.reset();
                          setBrand(selectedItem);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return t(selectedItem);
                        }}
                        rowTextForSelection={(item, index) => {
                          return t(item);
                        }}
                      />
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          paddingVertical: width(4),
                          alignSelf: "flex-start",
                          alignItems: "center",
                        }}
                        onPress={otherBrandFuntion}
                      >
                        <CheckBox
                          checkedImage={
                            <MaterialIcons
                              name="check-box"
                              size={height(2)}
                              color={AppColors.primary}
                            />
                          }
                          unCheckedImage={
                            <MaterialIcons
                              name="check-box-outline-blank"
                              size={height(2)}
                            />
                          }
                          style={{ paddingRight: width(2) }}
                          checkedCheckBoxColor={AppColors.primary}
                          isChecked={otherBrand}
                          onClick={otherBrandFuntion}
                        />
                        <Text style={{ fontSize: height(1.5) }}>
                          {t("category.Others")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {brand && (
                    <View>
                      {apimodel && brand != "Others" ? (
                        <View style={{ alignSelf: "center" }}>
                          <Text style={styles.title}>{t("addPost.model")}</Text>
                          <SelectDropdown
                            defaultButtonText={
                              model
                                ? model === "Others"
                                  ? t("category.Others")
                                  : model
                                : t("addPost.defaultValueDropdown")
                            }
                            ref={modelRef}
                            searchPlaceHolder={t("addPost.phsearchHere")}
                            data={apimodel}
                            disabled={otherModel}
                            search={true}
                            onFocus={false}
                            buttonStyle={styles.searchbox}
                            selectedRowStyle={{
                              backgroundColor: AppColors.primary,
                            }}
                            selectedRowTextStyle={{ color: AppColors.white }}
                            buttonTextStyle={{
                              textAlign: "left",
                              fontSize: height(1.6),
                            }}
                            dropdownStyle={styles.dropdown}
                            onSelect={(selectedItem, index) => {
                              setModel(selectedItem);
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                              return item;
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              paddingVertical: width(4),
                              alignSelf: "flex-start",
                              alignItems: "center",
                            }}
                            onPress={otherModelFuntion}
                          >
                            <CheckBox
                              checkedImage={
                                <MaterialIcons
                                  name="check-box"
                                  size={height(2)}
                                  color={AppColors.primary}
                                />
                              }
                              unCheckedImage={
                                <MaterialIcons
                                  name="check-box-outline-blank"
                                  size={height(2)}
                                />
                              }
                              style={{ paddingRight: width(2) }}
                              checkedCheckBoxColor={AppColors.primary}
                              isChecked={otherModel}
                              onClick={otherModelFuntion}
                            />
                            <Text style={{ fontSize: height(1.5) }}>
                              {t("category.Others")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                  {category && (
                    <View style={{ paddingVertical: width(1) }}>
                      <Text style={styles.title}>{t("addPost.year")}</Text>
                      <Input
                        value={year + ""}
                        setvalue={setYear}
                        containerStyle={[styles.price, { width: width(90) }]}
                        placeholder={t("addPost.phyear")}
                        keyboardType="number-pad"
                      />
                    </View>
                  )}
                  {findValue && (
                    <View style={{ alignSelf: "center" }}>
                      <Text style={styles.title}>{t("addPost.bodyshape")}</Text>
                      <SelectDropdown
                        defaultButtonText={
                          bodyshape
                            ? t(`bodyShapeList.${bodyshape}`)
                            : t("addPost.defaultValueDropdown")
                        }
                        data={
                          category == "Bikes"
                            ? feild?.bikeBodyShape
                            : feild?.AutosBodyShape
                        }
                        searchPlaceHolder={t("addPost.phsearchHere")}
                        buttonStyle={styles.searchbox}
                        selectedRowStyle={{
                          backgroundColor: AppColors.primary,
                        }}
                        selectedRowTextStyle={{ color: AppColors.white }}
                        buttonTextStyle={{
                          textAlign: "left",
                          fontSize: height(1.6),
                        }}
                        dropdownStyle={styles.dropdown}
                        onSelect={(selectedItem, index) => {
                          setBodyshap(selectedItem.name);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return t(`bodyShapeList.${selectedItem.name}`);
                        }}
                        rowTextForSelection={(item, index) => {
                          return t(`bodyShapeList.${item.name}`);
                        }}
                      />
                    </View>
                  )}
                  {findValue && feild?.gearBox && (
                    <View style={{ alignSelf: "center" }}>
                      <Text style={styles.title}>{t("addPost.gearbox")}</Text>
                      <SelectDropdown
                        defaultButtonText={
                          gearbox
                            ? t(`gearBoxList.${gearbox}`)
                            : t("addPost.defaultValueDropdown")
                        }
                        data={feild.gearBox}
                        searchPlaceHolder={t("addPost.phsearchHere")}
                        buttonStyle={styles.searchbox}
                        selectedRowStyle={{
                          backgroundColor: AppColors.primary,
                        }}
                        selectedRowTextStyle={{ color: AppColors.white }}
                        buttonTextStyle={{
                          textAlign: "left",
                          fontSize: height(1.6),
                        }}
                        dropdownStyle={styles.dropdown}
                        onSelect={(selectedItem, index) => {
                          setGearbox(selectedItem.name);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return t(`gearBoxList.${selectedItem.name}`);
                        }}
                        rowTextForSelection={(item, index) => {
                          return t(`gearBoxList.${item.name}`);
                        }}
                      />
                    </View>
                  )}
                  {findValue && (
                    <View style={{ alignSelf: "center" }}>
                      <Text style={styles.title}>{t("addPost.fueltype")}</Text>
                      <SelectDropdown
                        defaultButtonText={
                          fueltype
                            ? t(`fuelTypelist.${fueltype}`)
                            : t("addPost.defaultValueDropdown")
                        }
                        data={
                          category == "Bikes"
                            ? feild?.BikeFuelType
                            : feild?.fuelType
                        }
                        searchPlaceHolder={t("addPost.phsearchHere")}
                        buttonStyle={styles.searchbox}
                        selectedRowStyle={{
                          backgroundColor: AppColors.primary,
                        }}
                        selectedRowTextStyle={{ color: AppColors.white }}
                        buttonTextStyle={{
                          textAlign: "left",
                          fontSize: height(1.6),
                        }}
                        dropdownStyle={styles.dropdown}
                        onSelect={(selectedItem, index) => {
                          setFueltype(selectedItem.name);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return t(`fuelTypelist.${selectedItem.name}`);
                        }}
                        rowTextForSelection={(item, index) => {
                          return t(`fuelTypelist.${item.name}`);
                        }}
                      />
                    </View>
                  )}
                  {category && (
                    <View style={{ alignSelf: "center" }}>
                      <Text style={styles.title}>{t("addPost.km")}</Text>
                      <SelectDropdown
                        data={feild?.kilometers}
                        defaultButtonText={
                          km || t("addPost.defaultValueDropdown")
                        }
                        searchPlaceHolder={t("addPost.phsearchHere")}
                        buttonStyle={styles.searchbox}
                        selectedRowStyle={{
                          backgroundColor: AppColors.primary,
                        }}
                        selectedRowTextStyle={{ color: AppColors.white }}
                        buttonTextStyle={{
                          textAlign: "left",
                          fontSize: height(1.6),
                        }}
                        dropdownStyle={styles.dropdown}
                        onSelect={(selectedItem, index) => {
                          setKm(selectedItem.name);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return t(selectedItem.name);
                        }}
                        rowTextForSelection={(item, index) => {
                          return t(item.name);
                        }}
                      />
                    </View>
                  )}

                  <View
                    style={{ alignSelf: "center", paddingBottom: height(2) }}
                  >
                    <Text style={styles.title}>{t("allData.condition")}</Text>

                    <RadioButtonRN
                      data={rdata}
                      initial={
                        condition
                          ? rdata.findIndex(
                              (item) =>
                                item?.key.toLowerCase() ===
                                (condition || "").toLowerCase()
                            ) + 1
                          : 0
                      }
                      circleSize={width(3)}
                      boxStyle={{
                        width: width(90),
                        borderWidth: 0,
                        paddingVertical: width(1),
                      }}
                      textStyle={{ fontSize: height(1.5) }}
                      activeColor={AppColors.primary}
                      selectedBtn={(e) => {
                        setCondition(e?.key);
                      }}
                    />
                  </View>
                </View>
              </ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  title={"allData.clear"}
                  containerStyle={{
                    width: width(48),
                    borderRadius: width(1),
                    backgroundColor: "grey",
                  }}
                  onPress={() => {
                    clearAll();
                    refRBSheet.current.close();
                  }}
                />
                <Button
                  title={"allData.search"}
                  containerStyle={{
                    width: width(40),
                    borderRadius: width(1),
                    backgroundColor: AppColors.primary,
                  }}
                  onPress={() => {
                    setData([]);
                    setempty(false);
                    if (pageNumber != 0) {
                      setPageNumber(1);
                    }
                    refRBSheet.current.close();
                    setFilter(filter + 1);
                  }}
                />
              </View>
            </View>
          )}
        </RBSheet>
      </View>
    </ScreenWrapper>
  );
}
