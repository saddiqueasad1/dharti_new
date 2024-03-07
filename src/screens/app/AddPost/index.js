import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import RadioButtonRN from "radio-buttons-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import CheckBox from "react-native-check-box";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  addPostAd,
  backEndDataAPi,
  editAdApi,
  geVehicleCategory,
  geVehicleMakes,
  getModel,
} from "../../../backend/api";
import { getOwneAd } from "../../../backend/auth";
import {
  Button,
  FilePickerModal,
  IconButton,
  Input,
  NumberInput,
  ScreenWrapper,
} from "../../../components";
import {
  selectCategoryList,
  selectShowViber,
  selectShowWhatsapp,
  setAppLoader,
} from "../../../redux/slices/config";
import { selectUserMeta, setUserAds } from "../../../redux/slices/user";
import ScreenNames from "../../../routes/routes";
import AppColors from "../../../utills/AppColors";
import { Apikey } from "../../../utills/Constants";
import { height, width } from "../../../utills/Dimension";
import {
  errorMessage,
  getConditionInitailValue,
  getGenderInitialValue,
  getPContitionInitialValue,
  getPriceInitialValue,
  infoMessage,
  shouldRenderField,
  showType,
  successMessage,
} from "../../../utills/Methods";
import styles from "./styles";
export default function AddPost({ navigation, route }) {
  const { t } = useTranslation();
  const edit = route?.params?.data;
  const category = route?.params?.category || edit?.category;
  const sub = route?.params?.subcategory || edit?.subCategory;
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserMeta);
  const v = useSelector(selectShowViber);
  const w = useSelector(selectShowWhatsapp);
  const mapRef = useRef(null);
  const modelRef = useRef();
  const brandRef = useRef();
  const imageRef = useRef(null);
  const cat = useSelector(selectCategoryList);
  // const [ad, setAd] = useState({
  //   category: category,
  //   subCategory: sub,
  //   title: edit?.title || "",
  //   titleRequire: null,
  //   pricing: "Price",
  //   url: edit?.videoUrl || "",
  //   km: edit?.vhclZ?.km || "",
  //   description: edit?.description || "",
  //   year: edit?.vhclZ?.year || "",
  //   price: edit?.price || "",
  //   condition: edit?.vhclZ?.condition || "",
  //   brand: edit?.vhclZ?.brand || "",
  //   model: edit?.vhclZ?.model || "",
  //   type: edit?.vhclZ?.type || "",
  //   bodyshape: edit?.vhclZ?.bodyShape || "",
  //   gearbox: edit?.vhclZ?.gearBox || "",
  //   fueltype: edit?.vhclZ?.fuelType || "",
  //   exterior: edit?.vhclZ?.exteriorColor || "",
  //   interior: edit?.vhclZ?.interiorColor || "",
  //   latitude: edit?.latitude || 37.78825,
  //   longitude: edit?.longitude || -122.4324,
  //   email: userInfo?.email,
  //   phone: userInfo?.phoneNumber,
  //   whatsapp: edit?.whatsapp || userInfo?.whatsapp,
  //   viber: edit?.viber || userInfo?.viber,
  //   address: edit?.address || "",
  //   area: edit?.property4sr?.area || "",
  //   companyName: edit?.jobZ?.companyName || "",
  //   salaryFrom: edit?.jobZ?.salaryFrom || "",
  //   salaryTo: edit?.jobZ?.salaryTo || "",
  //   salaryPeriod: edit?.jobZ?.salaryPeriod || "",
  //   positionType: edit?.jobZ?.positionType || "",
  //   breed: edit?.animalZ?.breed || "",
  //   age: edit?.animalZ?.age || "",
  //   drivenHours: edit?.vhclZ?.hrzDrvn || "",
  //   workingHours: edit?.bznessInAg?.workingHours || "",
  //   downPayment: edit?.vhclZ?.dwnPymnt || "",
  //   installments: edit?.vhclZ?.mnthlyInstl || "",
  //   installmentPlan: edit?.vhclZ?.instlPlan || "",
  //   bedRooms: edit?.property4sr?.bedrooms || "",
  //   bathRooms: edit?.property4sr?.bathrooms || "",
  //   iAm: edit?.rltnShp?.iAm || "",
  //   lookingFor: edit?.rltnShp?.lkinFor || "",
  //   gender: edit?.animalZ?.gender || "",
  //   propertyCondition: edit?.property4sr?.furnished || "",
  // });

  // Usage example:
  // To update a specific state variable, you can use the spread operator to maintain other state variables unchanged.
  // setAd((prevState) => ({ ...prevState, selectedCategory: newValue }));
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState(edit?.images || []);
  const [subCategory, setSubCategory] = useState(sub);
  const [title, setTitle] = useState(edit?.title || "");
  const [titleRequire, setTitleRequire] = useState(null);
  const [pricing, setPricing] = useState("Price");
  const [url, setUrl] = useState(edit?.videoUrl || "");
  const [km, setKm] = useState(edit?.vhclZ?.km || "");
  const [description, setDescription] = useState(edit?.description || "");
  const [check, setCheck] = useState(false);
  const [otherBrand, setOtherBrand] = useState(false);
  const [otherModel, setOtherModel] = useState(false);
  const [year, setYear] = useState(edit?.vhclZ?.year || "");
  const [price, setPrice] = useState(edit?.price || "");
  const [priceRequire, setPriceRequire] = useState(null);
  const [salaryRequire, setSalaryRequire] = useState(null);
  const [condition, setCondition] = useState(edit?.vhclZ?.condition || "");
  const [brand, setBrand] = useState(edit?.vhclZ?.brand || "");
  const [brandRequire, setBrandRequire] = useState(null);
  const [model, setModel] = useState(edit?.vhclZ?.model || "");
  const [type, setType] = useState(edit?.vhclZ?.type || "");
  const [bodyshape, setBodyshap] = useState(edit?.vhclZ?.bodyShape || "");
  const [gearbox, setGearbox] = useState(edit?.vhclZ?.gearBox || "");
  const [fueltype, setFueltype] = useState(edit?.vhclZ?.fuelType || "");
  const [exterior, setExterior] = useState(edit?.vhclZ?.exteriorColor || "");
  const [interior, setInterior] = useState(edit?.vhclZ?.interiorColor || "");
  const [latitude, setLatiitude] = useState(edit?.latitude || 37.78825);
  const [longitude, setLongitude] = useState(edit?.longitude || -122.4324);
  const [email, setEmail] = useState(userInfo?.email);
  const [phone, setPhone] = useState(userInfo?.phoneNumber);
  const [whatsapp, setWhatsapp] = useState(
    edit?.whatsapp || userInfo?.whatsapp
  );
  const [viber, setViber] = useState(edit?.viber || userInfo?.viber);
  const [address, setAddress] = useState(edit?.address || "");
  const [addressRequire, setAddressRequire] = useState(null);
  const [vcompanies, setVcompanies] = useState([]);
  const [vtype, setVtype] = useState();
  const [apimodel, setapiModel] = useState([]);

  const [addPhone, setAddPhone] = useState(userInfo?.showNumber);
  const [addEmail, setAddEmail] = useState(userInfo?.showEmail);
  const [addWhatsapp, setAddWhatsapp] = useState(w);
  const [addViber, setAddViber] = useState(v);
  const [feild, setFeild] = useState();

  const [renderNow, setRenderNow] = useState(false);

  const [area, setArea] = useState(edit?.property4sr?.area || "");
  const [companyName, setCompanyName] = useState(edit?.jobZ?.companyName || "");
  const [salaryFrom, setSalaryFrom] = useState(edit?.jobZ?.salaryFrom || "");
  const [salaryTo, setSalaryTo] = useState(edit?.jobZ?.salaryTo || "");
  const [salaryPeriod, setSalaryPeriod] = useState(
    edit?.jobZ?.salaryPeriod || ""
  );
  const [positionType, setPositionType] = useState(
    edit?.jobZ?.positionType || ""
  );
  const [breed, setBreed] = useState(edit?.animalZ?.breed || "");
  const [age, setAge] = useState(edit?.animalZ?.age || "");
  const [drivenHours, setDrivenHours] = useState(edit?.vhclZ?.hrzDrvn || "");
  const [workingHours, setWorkingHours] = useState(
    edit?.bznessInAg?.workingHours || ""
  );
  const [downPayment, setDownPayment] = useState(edit?.vhclZ?.dwnPymnt || "");
  const [installments, setInstallments] = useState(
    edit?.vhclZ?.mnthlyInstl || ""
  );
  const [installmentPlan, setInstallmentPlan] = useState(
    edit?.vhclZ?.instlPlan || ""
  );
  const [bedRooms, setBedRooms] = useState(edit?.property4sr?.bedrooms || "");
  const [bathRooms, setBathRooms] = useState(
    edit?.property4sr?.bathrooms || ""
  );
  const [iAm, setIAm] = useState(edit?.rltnShp?.iAm || "");
  const [lookingFor, setLookingFor] = useState(edit?.rltnShp?.lkinFor || "");
  const [gender, setGender] = useState(edit?.animalZ?.gender || "");
  const [propertyCondition, setPropertyCondition] = useState(
    edit?.property4sr?.furnished || ""
  );

  useEffect(() => {
    if (edit) {
      setAddViber(edit?.viber ? true : false);
      setAddWhatsapp(edit?.whatsapp ? true : false);
      setAddPhone(edit?.phone ? true : false);
      setAddEmail(edit?.email ? true : false);
      getPriceInitialValue(edit?.price) == 1 && setPrice(edit?.price);
      edit?.vhclZ?.brand === "Others" && setOtherBrand(true);
      edit?.vhclZ?.model === "Others" && setOtherModel(true);
    }
  }, [edit]);
  useEffect(() => {
    getvehicleMake();
    if (showType(subCategory)) {
      getvehicleCategory();
    }
    getFeilds();
  }, [subCategory]);
  useEffect(() => {
    cat.map((i) => {
      if (i.name == category) {
        setSelectedCategory(i);
      }
    });
  }, []);

  const getFeilds = async () => {
    let data = await backEndDataAPi({
      cat: category,
      subcat: subCategory,
    });
    if (data) setFeild(data);
  };
  const getvehicleMake = async () => {
    dispatch(setAppLoader(true));
    let vehicledata = await geVehicleMakes(subCategory);
    if (vehicledata) {
      setVcompanies(vehicledata);
      dispatch(setAppLoader(false));
    } else {
      setVcompanies([]);
      dispatch(setAppLoader(false));
    }
    dispatch(setAppLoader(false));
  };
  const getvehicleCategory = async () => {
    let vehicledata = await geVehicleCategory(subCategory);
    if (vehicledata) {
      setVtype(vehicledata);
    } else {
      setVtype(false);
    }
  };
  useEffect(() => {
    if (brand) getmodel(subCategory, brand);
  }, [brand, subCategory]);
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
  const addPost = async () => {
    dispatch(setAppLoader(true));
    try {
      const requiredFields = [
        title,
        latitude,
        longitude,
        address,
        image,
        userInfo,
      ];
      // category && requiredFields.push(brand);
      shouldRenderField("Price", category, subCategory) &&
        pricing == "Price" &&
        requiredFields.push(price);
      shouldRenderField("SalaryFrom", category, subCategory) &&
        requiredFields.push(salaryFrom);
      const isAnyFieldEmpty = requiredFields.some((field) => !field);

      if (isAnyFieldEmpty) {
        if (!title) {
          setTitleRequire(true);
        } else {
          setTitleRequire(false);
        }
        // if (!brand) {
        //   setBrandRequire(true);
        // } else {
        //   setBrandRequire(false);
        // }
        if (!address) {
          setAddressRequire(true);
        } else {
          setAddressRequire(false);
        }
        if (!price) {
          setPriceRequire(true);
        } else {
          setPriceRequire(false);
        }
        if (!salaryFrom) {
          setSalaryRequire(true);
        } else {
          setSalaryRequire(false);
        }

        dispatch(setAppLoader(false));
        // Show an alert if any required field is empty
        if (!title && !address && !price)
          errorMessage(
            t(`flashmsg.Please fill all required fields`),
            t(`flashmsg.require`)
          );
        else if (!address)
          infoMessage(t(`flashmsg.locationRequire`), t("flashmsg.require"));
        else
          errorMessage(
            t(`flashmsg.Please fill all required fields`),
            t(`flashmsg.require`)
          );

        return;
      }
      if (image.length < 1) {
        errorMessage("Image require ", t(`flashmsg.error`));
        dispatch(setAppLoader(false));
        return;
      }

      // Append each selected image to the form data

      if (edit) {
        const formData = new FormData();
        formData.append("userId", userInfo?._id);
        formData.append("title", title);
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        (edit?.price || price) && formData.append("price", price);
        (edit?.videoUrl || url) && formData.append("videoUrl", url);
        (edit?.description || description) &&
          formData.append("description", description);
        (edit?.latitude || address) && formData.append("latitude", latitude);
        (edit?.longitude || address) && formData.append("longitude", longitude);
        (edit?.address || address) && formData.append("address", address);
        formData.append("viber", addViber ? viber : "");
        formData.append("whatsapp", addWhatsapp ? whatsapp : "");
        formData.append("phone", addPhone);
        formData.append("email", addEmail);
        (edit?.vhclZ?.type || type) && formData.append("vhclZ.type", type);
        (edit?.vhclZ?.km || km) && formData.append("vhclZ.km", km);
        (edit?.vhclZ?.condition || condition) &&
          formData.append("vhclZ.condition", condition);
        (edit?.vhclZ?.brand || brand) && formData.append("vhclZ.brand", brand);
        (edit?.vhclZ?.year || year) && formData.append("vhclZ.year", year);
        (edit?.vhclZ?.model || model) && formData.append("vhclZ.model", model);
        (edit?.vhclZ?.bodyShape || bodyshape) &&
          formData.append("vhclZ.bodyShape", bodyshape);
        (edit?.vhclZ?.gearBox || gearbox) &&
          formData.append("vhclZ.gearBox", gearbox);
        (edit?.vhclZ?.fuelType || fueltype) &&
          formData.append("vhclZ.fuelType", fueltype);
        (edit?.vhclZ?.exteriorColor || exterior) &&
          formData.append("vhclZ.exteriorColor", exterior);
        (edit?.vhclZ?.interiorColor || interior) &&
          formData.append("vhclZ.interiorColor", interior);
        (edit?.vhclZ?.dwnPymnt || downPayment) &&
          formData.append("vhclZ.dwnPymnt", downPayment);
        (edit?.vhclZ?.mnthlyInstl || installments) &&
          formData.append("vhclZ.mnthlyInstl", installments);
        (edit?.vhclZ?.instlPlan || installmentPlan) &&
          formData.append("vhclZ.instlPlan", installmentPlan);
        (edit?.vhclZ?.hrzDrvn || drivenHours) &&
          formData.append("vhclZ.hrzDrvn", drivenHours);
        (edit?.jobZ?.companyName || companyName) &&
          formData.append("jobZ.companyName", companyName);
        (edit?.jobZ?.salaryFrom || salaryFrom) &&
          formData.append("jobZ.salaryFrom", salaryFrom);
        (edit?.jobZ?.salaryTo || salaryTo) &&
          formData.append("jobZ.salaryTo", salaryTo);
        (edit?.jobZ?.positionType || positionType) &&
          formData.append("jobZ.positionType", positionType);
        (edit?.jobZ?.salaryPeriod || salaryPeriod) &&
          formData.append("jobZ.salaryPeriod", salaryPeriod);
        (edit?.property4sr?.area || area) &&
          formData.append("property4sr.area", area);
        (edit?.property4sr?.furnished || propertyCondition) &&
          formData.append("property4sr.furnished", propertyCondition);
        (edit?.property4sr?.bedrooms || bedRooms) &&
          formData.append("property4sr.bedrooms", bedRooms);
        (edit?.property4sr?.bathrooms || bathRooms) &&
          formData.append("property4sr.bathrooms", bathRooms);
        (edit?.animalZ?.gender || gender) &&
          formData.append("animalZ.gender", gender);
        (edit?.animalZ?.breed || breed) &&
          formData.append("animalZ.breed", breed);
        (edit?.animalZ?.age || age) && formData.append("animalZ.age", age);
        (edit?.bznessInAg?.workingHours || workingHours) &&
          formData.append("bznessInAg.workingHours", workingHours);
        (edit?.rltnShp?.iAm || iAm) && formData.append("rltnShp.iAm", iAm);
        (edit?.rltnShp?.lkinFor || lookingFor) &&
          formData.append("rltnShp.lkinFor", lookingFor);

        image.forEach((img, index) => {
          formData.append("file", {
            name: `image${index}`,
            type: "image/jpeg", // Adjust the type if needed
            uri: img,
          });
        });
        const resp = await editAdApi(edit?._id, formData);
        if (resp?.success) {
          successMessage(t(`flashmsg.editadsussessmsg`), t(`flashmsg.success`));
          navigation.navigate(ScreenNames.MYADS);
        } else {
          errorMessage(t(`flashmsg.editerrormsg`), t(`flashmsg.error`));
        }
      } else {
        const formData = new FormData();
        formData.append("userId", userInfo?._id);
        formData.append("title", title);
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        price && formData.append("price", price);
        url && formData.append("videoUrl", url);
        description && formData.append("description", description);
        address && formData.append("latitude", latitude);
        address && formData.append("longitude", longitude);
        address && formData.append("address", address);
        addViber && formData.append("viber", viber);
        addWhatsapp && formData.append("whatsapp", whatsapp);
        addPhone && formData.append("phone", true);
        addEmail && formData.append("email", true);
        type && formData.append("vhclZ.type", type);
        km && formData.append("vhclZ.km", km);
        condition && formData.append("vhclZ.condition", condition);
        brand && formData.append("vhclZ.brand", brand);
        year && formData.append("vhclZ.year", year);
        model && formData.append("vhclZ.model", model);
        bodyshape && formData.append("vhclZ.bodyShape", bodyshape);
        gearbox && formData.append("vhclZ.gearBox", gearbox);
        fueltype && formData.append("vhclZ.fuelType", fueltype);
        exterior && formData.append("vhclZ.exteriorColor", exterior);
        interior && formData.append("vhclZ.interiorColor", interior);
        downPayment && formData.append("vhclZ.dwnPymnt", downPayment);
        installments && formData.append("vhclZ.mnthlyInstl", installments);
        installmentPlan && formData.append("vhclZ.instlPlan", installmentPlan);
        drivenHours && formData.append("vhclZ.hrzDrvn", drivenHours);
        companyName && formData.append("jobZ.companyName", companyName);
        salaryFrom && formData.append("jobZ.salaryFrom", salaryFrom);
        salaryTo && formData.append("jobZ.salaryTo", salaryTo);
        positionType && formData.append("jobZ.positionType", positionType);
        salaryPeriod && formData.append("jobZ.salaryPeriod", salaryPeriod);
        area && formData.append("property4sr.area", area);
        propertyCondition &&
          formData.append("property4sr.furnished", propertyCondition);
        bedRooms && formData.append("property4sr.bedrooms", bedRooms);
        bathRooms && formData.append("property4sr.bathrooms", bathRooms);
        gender && formData.append("animalZ.gender", gender);
        breed && formData.append("animalZ.breed", breed);
        age && formData.append("animalZ.age", age);
        workingHours &&
          formData.append("bznessInAg.workingHours", workingHours);
        iAm && formData.append("rltnShp.iAm", iAm);
        lookingFor && formData.append("rltnShp.lkinFor", lookingFor);

        image.forEach((img, index) => {
          formData.append("file", {
            name: `image${index}`,
            type: "image/jpeg", // Adjust the type if needed
            uri: img,
          });
        });
        const resp = await addPostAd(formData);
        console.log("====================================");
        console.log("Add post", resp);
        console.log("====================================");
        if (resp?.success) {
          navigation.navigate("StackHome");
          const userAd = await getOwneAd(userInfo?._id);
          dispatch(setUserAds(userAd));
          successMessage(t(`flashmsg.adPostsussessmsg`), t(`flashmsg.success`));
        } else {
          errorMessage(t(`flashmsg.adPosterrormsg`), t(`flashmsg.error`));
        }
      }

      dispatch(setAppLoader(false));
    } catch (error) {
      console.error("post upload error:", error);
      dispatch(setAppLoader(false));
    }
  };
  const rdata = [
    {
      key: "New",
      label: t("condition.new"),
    },
    {
      key: "Used",
      label: t("condition.used"),
    },
    {
      key: "Recondition",
      label: t("condition.Recondition"),
    },
  ];
  const pdata = [
    {
      key: "Price",
      label: t("condition.price"),
    },
    {
      key: "Free",
      label: t("addPost.Free"),
    },
    {
      key: "Contact",
      label: t("addPost.Contact"),
    },
  ];
  const pcdata = [
    {
      key: "Yes",
      label: t("addPost.furnished"),
    },
    {
      key: "No",
      label: t("addPost.unFurnished"),
    },
  ];
  const gdata = [
    {
      key: "Male",
      label: t("addPost.Male"),
    },
    {
      key: "Female",
      label: t("addPost.Female"),
    },
  ];
  const otherModelFuntion = () => {
    if (!otherModel) {
      if (model) {
        setModel("");
        modelRef?.current?.reset();
      }
      setModel("Others");
      setOtherModel(!otherModel);
    } else {
      if (model) {
        setModel("");
        modelRef?.current?.reset();
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
      brandRef?.current?.reset();
      setBrand("Others");
      setOtherBrand(!otherBrand);
    } else {
      if (brand) {
        setModel("");
        setBrand("");
        brandRef?.current?.reset();
      }
      setOtherBrand(!otherBrand);
    }
  };
  const handleInputChange = (text) => {
    // Use regex to allow only integer values
    const regex = /^[0-9]*$/;
    if (regex.test(text)) {
      setPrice(text);
    }
  };
  useEffect(() => {
    if (image.length > 0) setRenderNow(true);
    else setRenderNow(false);
  }, [image]);
  const renderItem = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={{ flexDirection: "row" }}
      >
        <Image
          style={{
            height: height(7),
            width: height(7),
            borderRadius: height(1),
            marginLeft: width(3),
          }}
          source={{ uri: item }}
        />
        <TouchableOpacity
          onPress={() => {
            let temp;
            temp = image.filter((i) => i !== item);
            setImage(temp);
          }}
          style={{ height: height(3) }}
        >
          <Entypo
            name="squared-cross"
            size={height(2)}
            color={AppColors.primary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </ScaleDecorator>
  );
  return (
    <ScreenWrapper
      showStatusBar={false}
      headerUnScrollable={() => (
        // <Head
        //   // headtitle={edit ? "editAd.title" : "addPost.title"}
        //   navigation={navigation}
        // >
        <View
          style={{
            flexDirection: "row",
            padding: height(1),
            backgroundColor: "white",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ margin: height(0.5) }}
          >
            <Ionicons
              name="chevron-back"
              size={height(4)}
              color={AppColors.black}
            />
          </Pressable>
          <Image
            tintColor={AppColors.primary}
            style={{
              width: height(4),
              height: height(4),
              paddingLeft: height(3),
            }}
            source={{ uri: selectedCategory?.image }}
          />
          <View>
            <Text
              style={{
                color: AppColors.black,
                fontSize: height(2),
                paddingHorizontal: width(4.5),
                fontWeight: "bold",
              }}
            >
              {t(`category.${selectedCategory?.name}`)}
            </Text>
            <Text
              style={{
                color: AppColors.primary,
                fontSize: height(1.5),
                paddingHorizontal: width(4.5),
              }}
            >
              {t(`subList.${sub}`)}
            </Text>
          </View>
        </View>
        // </Head>
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        {/* --------Image ---- */}
        <View
          style={{
            backgroundColor: AppColors.grey,
            borderRadius: width(2),
            width: width(90),
            alignContent: "center",
            alignItems: "center",
            paddingVertical: height(3),
          }}
        >
          {!(image != null && image != "") ? (
            <View
              style={{ justifyContent: "space-around", alignItems: "center" }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.primary,
                  borderRadius: width(2),
                  padding: height(1),
                }}
                onPress={() => imageRef.current.show()}
              >
                <Ionicons
                  name="camera"
                  size={height(7)}
                  color={AppColors.white}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <DraggableFlatList
                data={image}
                horizontal
                style={{ marginHorizontal: width(2) }}
                onDragEnd={({ data }) => setImage(data)}
                keyExtractor={(index, item) => {
                  return `key-${index}`;
                }}
                renderItem={renderItem}
                ListHeaderComponent={
                  image?.length < 7 && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: AppColors.primary,
                        height: height(7),
                        width: height(7),
                        borderRadius: height(1),
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => imageRef.current.show()}
                    >
                      <Ionicons
                        name="add"
                        size={height(4)}
                        color={AppColors.white}
                      />
                    </TouchableOpacity>
                  )
                }
              />
            </View>
          )}
          <Text
            style={{
              fontWeight: "bold",
              fontSize: height(2),
              padding: width(3),
            }}
          >
            {t("addPost.attachImage1")}
          </Text>
          <Text style={{ fontSize: height(1.2), padding: width(1) }}>
            {t("addPost.attachImage2")}
          </Text>
          {renderNow && (
            <Text
              style={{
                fontSize: height(1.2),
                padding: width(1),
                width: width(60),
                textAlign: "center",
              }}
            >
              {t("addPost.attachImage3")}
            </Text>
          )}
        </View>

        {/* --------product infomartio---- */}
        <View>
          <Text
            style={[
              styles.title,
              { fontSize: height(2.5), marginVertical: width(2) },
            ]}
          >
            {t("addPost.productInformation")}
          </Text>
          {/*-----------------title---------------*/}
          <View style={{ paddingVertical: width(1) }}>
            <Text style={styles.title}>{t("addPost.titleWord")}</Text>
            <Input
              value={title}
              setvalue={setTitle}
              placeholder={t("addPost.phtitleWord")}
              containerStyle={[
                styles.price,
                { width: width(90) },
                titleRequire && styles.required,
              ]}
            />
            {titleRequire && (
              <Text style={styles.require}>*{t(`addPost.require`)}</Text>
            )}
          </View>
          {/*-----------------area---------------*/}
          {shouldRenderField("Area", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.area")}</Text>
              <Input
                value={area}
                keyboardType="number-pad"
                setvalue={setArea}
                placeholder={t("addPost.enterArea")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------company name---------------*/}
          {shouldRenderField("CompanyName", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.companyName")}</Text>
              <Input
                value={companyName}
                setvalue={setCompanyName}
                placeholder={t("addPost.enterCompanyName")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------salary from---------------*/}
          {shouldRenderField("SalaryFrom", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.salaryFrom")}</Text>
              <Input
                value={salaryFrom}
                setvalue={setSalaryFrom}
                placeholder={t("addPost.enterSalaryFrom")}
                keyboardType="number-pad"
                containerStyle={[
                  styles.price,
                  { width: width(90) },
                  salaryRequire && styles.required,
                ]}
              />
              {salaryRequire && (
                <Text style={styles.require}>*{t(`addPost.require`)}</Text>
              )}
            </View>
          )}
          {/*-----------------salary to---------------*/}
          {shouldRenderField("SalaryTo", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.salaryTo")}</Text>
              <Input
                value={salaryTo}
                setvalue={setSalaryTo}
                placeholder={t("addPost.enterSalaryTo")}
                keyboardType="number-pad"
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------salary period---------------*/}
          {shouldRenderField("SalaryPeriod", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.salaryPeriod")}</Text>
              <Input
                value={salaryPeriod}
                setvalue={setSalaryPeriod}
                placeholder={t("addPost.enterSalaryPeriod")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------position Type---------------*/}
          {shouldRenderField("PositionType", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.positionType")}</Text>
              <Input
                value={positionType}
                setvalue={setPositionType}
                placeholder={t("addPost.enterPositionType")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------breed---------------*/}
          {shouldRenderField("Breed", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.breed")}</Text>
              <Input
                value={breed}
                setvalue={setBreed}
                placeholder={t("addPost.enterBreed")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------age---------------*/}
          {shouldRenderField("Age", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.age")}</Text>
              <Input
                value={age}
                setvalue={setAge}
                placeholder={t("addPost.enterAge")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------driven hours---------------*/}
          {shouldRenderField("Hours Driven", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.drivenHours")}</Text>
              <Input
                value={drivenHours}
                setvalue={setDrivenHours}
                keyboardType="number-pad"
                placeholder={t("addPost.enterDrivenHours")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------working hours---------------*/}
          {shouldRenderField("Working Hours", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.workingHours")}</Text>
              <Input
                value={workingHours}
                setvalue={setWorkingHours}
                keyboardType="number-pad"
                placeholder={t("addPost.enterWorkingHours")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------down payment---------------*/}
          {shouldRenderField("Down Payment", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.downPayment")}</Text>
              <Input
                value={downPayment}
                setvalue={setDownPayment}
                keyboardType="number-pad"
                placeholder={t("addPost.enterDownPayment")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------instalmentplan---------------*/}
          {shouldRenderField("Installment Plan", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.installmentPlan")}</Text>
              <Input
                value={installmentPlan}
                setvalue={setInstallmentPlan}
                placeholder={t("addPost.enterInstallmentPlan")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------monthly instalment---------------*/}
          {shouldRenderField("Monthly Installments", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>
                {t("addPost.monthlyInstallments")}
              </Text>
              <Input
                value={installments}
                setvalue={setInstallments}
                keyboardType="number-pad"
                placeholder={t("addPost.enterMonthlyInstallment")}
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------bedroom---------------*/}
          {shouldRenderField("Bedrooms", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.bedrooms")}</Text>
              <Input
                value={bedRooms}
                setvalue={setBedRooms}
                placeholder={t("addPost.enterBedrooms")}
                keyboardType="number-pad"
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------bathroom---------------*/}
          {shouldRenderField("bathrooms", category, subCategory) && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.bathrooms")}</Text>
              <Input
                value={bathRooms}
                setvalue={setBathRooms}
                placeholder={t("addPost.enterBathrooms")}
                keyboardType="number-pad"
                containerStyle={[styles.price, { width: width(90) }]}
              />
            </View>
          )}
          {/*-----------------condition---------------*/}
          {shouldRenderField("Furnished", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.condition")}</Text>

              <RadioButtonRN
                data={pcdata}
                initial={getPContitionInitialValue(gender)}
                textStyle={{ fontSize: height(1.5) }}
                circleSize={width(3)}
                boxStyle={{
                  width: width(90),
                  borderWidth: 0,
                  paddingVertical: width(1),
                }}
                activeColor={AppColors.primary}
                selectedBtn={(e) => {
                  setPropertyCondition(e.key);
                }}
              />
            </View>
          )}
          {/*-----------------gender---------------*/}
          {shouldRenderField("Gender", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.gender")}</Text>

              <RadioButtonRN
                data={gdata}
                initial={getGenderInitialValue(gender)}
                textStyle={{ fontSize: height(1.5) }}
                circleSize={width(3)}
                boxStyle={{
                  width: width(90),
                  borderWidth: 0,
                  paddingVertical: width(1),
                }}
                activeColor={AppColors.primary}
                selectedBtn={(e) => {
                  setGender(e.key);
                }}
              />
            </View>
          )}
          {/*-----------------i am---------------*/}
          {shouldRenderField("I am", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.iAm")}</Text>

              <RadioButtonRN
                data={gdata}
                initial={getGenderInitialValue(iAm)}
                textStyle={{ fontSize: height(1.5) }}
                circleSize={width(3)}
                boxStyle={{
                  width: width(90),
                  borderWidth: 0,
                  paddingVertical: width(1),
                }}
                activeColor={AppColors.primary}
                selectedBtn={(e) => {
                  setIAm(e.key);
                }}
              />
            </View>
          )}
          {/*-----------------looking for---------------*/}
          {shouldRenderField("Looking For", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.lookingFor")}</Text>

              <RadioButtonRN
                data={gdata}
                initial={getGenderInitialValue(lookingFor)}
                textStyle={{ fontSize: height(1.5) }}
                circleSize={width(3)}
                boxStyle={{
                  width: width(90),
                  borderWidth: 0,
                  paddingVertical: width(1),
                }}
                activeColor={AppColors.primary}
                selectedBtn={(e) => {
                  setLookingFor(e.key);
                }}
              />
            </View>
          )}
          {/*-----------------pricing radiobtn with Text Feild---------------*/}
          {shouldRenderField("Price", category, subCategory) && (
            <>
              <View style={{ alignSelf: "center" }}>
                <Text style={styles.title}>{t("addPost.pricing")}</Text>

                <RadioButtonRN
                  data={pdata}
                  initial={getPriceInitialValue(price)}
                  textStyle={{ fontSize: height(1.5) }}
                  circleSize={width(3)}
                  boxStyle={{
                    width: width(90),
                    borderWidth: 0,
                    paddingVertical: width(1),
                  }}
                  activeColor={AppColors.primary}
                  selectedBtn={(e) => {
                    console.log(e?.key);
                    switch (e?.key) {
                      case "Free":
                        setPrice("Free");
                        setPricing("Free");
                        break;
                      case "Contact":
                        setPrice("Contact");
                        setPricing("Contact");
                        break;
                      default:
                        setPricing("Price");
                        edit?.price ? setPrice(edit?.price) : setPrice("");
                        break;
                    }
                  }}
                />
              </View>
              <View
                style={{ paddingVertical: width(1), alignSelf: "flex-start" }}
              >
                <Text style={styles.title}>{t("addPost.price")}(CHF)</Text>

                <Input
                  editable={pricing == "Price"}
                  value={
                    pricing == "Price" ? price + "" : t(`addPost.${price}`)
                  }
                  setvalue={handleInputChange}
                  placeholder={t("addPost.phprice")}
                  containerStyle={[
                    styles.price,
                    { width: width(90) },
                    priceRequire && styles.required,
                  ]}
                  keyboardType="number-pad"
                />
                {priceRequire && (
                  <Text style={styles.require}>*{t(`addPost.require`)}</Text>
                )}
              </View>
            </>
          )}
          {/*-----------------condition Vahecal---------------*/}
          {shouldRenderField("Condition", category, subCategory) &&
            feild?.conditionList && (
              <View style={{ alignSelf: "center" }}>
                <Text style={styles.title}>{t("addPost.condition")}</Text>

                <RadioButtonRN
                  data={rdata}
                  initial={getConditionInitailValue(condition)}
                  textStyle={{ fontSize: height(1.5) }}
                  circleSize={width(3)}
                  boxStyle={{
                    width: width(90),
                    borderWidth: 0,
                    paddingVertical: width(1),
                  }}
                  activeColor={AppColors.primary}
                  selectedBtn={(e) => {
                    setCondition(e.key);
                  }}
                />
              </View>
            )}
          {/*-----------------Type or bodytype---------------*/}
          {!(vtype == undefined || vtype == []) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.type")}</Text>

              <SelectDropdown
                defaultButtonText={
                  type ? t(`type.${type}`) : t("addPost.defaultValueDropdown")
                }
                data={vtype}
                searchPlaceHolder={t("addPost.phsearchHere")}
                buttonStyle={styles.searchbox}
                selectedRowStyle={{ backgroundColor: AppColors.primary }}
                selectedRowTextStyle={{ color: AppColors.white }}
                buttonTextStyle={[{ textAlign: "left", fontSize: height(1.6) }]}
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
          {/*-----------------brand---------------*/}
          {shouldRenderField("Brand", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.brand")}</Text>
              <SelectDropdown
                ref={brandRef}
                defaultButtonText={
                  brand
                    ? brand === "Others"
                      ? t("category.Others")
                      : brand
                    : t("addPost.defaultValueDropdown")
                }
                data={vcompanies}
                disabled={otherBrand}
                search={true}
                searchInputStyle
                searchPlaceHolder={t("addPost.phsearchHere")}
                buttonStyle={[
                  styles.searchbox,
                  brandRequire && styles.required,
                ]}
                selectedRowStyle={{ backgroundColor: AppColors.primary }}
                selectedRowTextStyle={{ color: AppColors.white }}
                buttonTextStyle={[
                  { textAlign: "left", fontSize: height(1.6) },
                  otherBrand && { color: "grey" },
                ]}
                dropdownStyle={styles.dropdown}
                onSelect={(selectedItem, index) => {
                  if (model) {
                    modelRef.current.reset();
                    setModel("");
                  }
                  setBrand(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
              {brandRequire && (
                <Text style={styles.require}>*{t(`addPost.require`)}</Text>
              )}
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
                  isChecked={otherBrand}
                  onClick={otherBrandFuntion}
                />
                <Text style={{ fontSize: height(1.5) }}>
                  {t("category.Others")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/*-----------------render after select brand---------------*/}
          {brand &&
            (apimodel && brand != "Others" ? (
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
                  buttonStyle={styles.searchbox}
                  selectedRowStyle={{ backgroundColor: AppColors.primary }}
                  selectedRowTextStyle={{ color: AppColors.white }}
                  buttonTextStyle={[
                    { textAlign: "left", fontSize: height(1.6) },
                    otherModel && { color: "grey" },
                  ]}
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
            ))}
          {/*-----------------Year---------------*/}
          {shouldRenderField("Year", category, subCategory) && (
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
          {/*-----------------body shap---------------*/}
          {shouldRenderField("bodyShap", category, subCategory) && (
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
                selectedRowStyle={{ backgroundColor: AppColors.primary }}
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
          {/*-----------------Gear box---------------*/}
          {shouldRenderField("gearBox", category, subCategory) &&
            feild?.gearBox && (
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
                  selectedRowStyle={{ backgroundColor: AppColors.primary }}
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
          {/*-----------------fule type---------------*/}
          {shouldRenderField("fuleType", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.fueltype")}</Text>
              <SelectDropdown
                defaultButtonText={
                  fueltype
                    ? t(`fuelTypelist.${fueltype}`)
                    : t("addPost.defaultValueDropdown")
                }
                data={
                  category == "Bikes" ? feild?.BikeFuelType : feild?.fuelType
                }
                searchPlaceHolder={t("addPost.phsearchHere")}
                buttonStyle={styles.searchbox}
                selectedRowStyle={{ backgroundColor: AppColors.primary }}
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
          {/*-----------------exterior color---------------*/}
          {shouldRenderField("ExteriorColor", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.exteriorcolor")}</Text>
              <SelectDropdown
                defaultButtonText={
                  exterior
                    ? t(`colorList.${exterior}`)
                    : t("addPost.defaultValueDropdown")
                }
                data={
                  category == "Bikes" ? feild?.bikeColor : feild?.exteriorColor
                }
                searchPlaceHolder={t("addPost.phsearchHere")}
                buttonStyle={styles.searchbox}
                selectedRowStyle={{ backgroundColor: AppColors.primary }}
                selectedRowTextStyle={{ color: AppColors.white }}
                buttonTextStyle={{
                  textAlign: "left",
                  fontSize: height(1.6),
                }}
                dropdownStyle={styles.dropdown}
                onSelect={(selectedItem, index) => {
                  setExterior(selectedItem.name);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return t(`colorList.${selectedItem.name}`);
                }}
                rowTextForSelection={(item, index) => {
                  return t(`colorList.${item.name}`);
                }}
              />
            </View>
          )}
          {/*-----------------Interior color---------------*/}
          {shouldRenderField("interirColor", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.interiorcolor")}</Text>
              <SelectDropdown
                defaultButtonText={
                  interior
                    ? t(`colorList.${interior}`)
                    : t("addPost.defaultValueDropdown")
                }
                data={feild?.interiorColor}
                searchPlaceHolder={t("addPost.phsearchHere")}
                buttonStyle={styles.searchbox}
                selectedRowStyle={{ backgroundColor: AppColors.primary }}
                selectedRowTextStyle={{ color: AppColors.white }}
                buttonTextStyle={{
                  textAlign: "left",
                  fontSize: height(1.6),
                }}
                dropdownStyle={styles.dropdown}
                onSelect={(selectedItem, index) => {
                  setInterior(selectedItem.name);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return t(`colorList.${selectedItem.name}`);
                }}
                rowTextForSelection={(item, index) => {
                  return t(`colorList.${item.name}`);
                }}
              />
            </View>
          )}
          {/*-----------------Km---------------*/}
          {shouldRenderField("km", category, subCategory) && (
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.title}>{t("addPost.km")}</Text>
              <SelectDropdown
                data={feild?.kilometers}
                defaultButtonText={km || t("addPost.defaultValueDropdown")}
                searchPlaceHolder={t("addPost.phsearchHere")}
                buttonStyle={styles.searchbox}
                selectedRowStyle={{ backgroundColor: AppColors.primary }}
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

          {/*-----------------description---------------*/}
          <View style={{ paddingVertical: width(1) }}>
            <Text style={styles.title}>{t("addPost.description")}</Text>
            <Input
              value={description}
              multi
              setvalue={setDescription}
              placeholder={t("addPost.phdescription")}
              containerStyle={[styles.price, { width: width(90) }]}
            />
          </View>
        </View>
        {/*-----------------Video url---------------*/}
        <View style={{ paddingVertical: width(1) }}>
          <Text style={styles.title}>{t("addPost.videourl")}</Text>
          <Input
            value={url}
            setvalue={setUrl}
            placeholder={t("addPost.phurl")}
            containerStyle={[styles.price, { width: width(90) }]}
          />
        </View>
        {/* --------owner infomartio---- */}
        <View>
          <Text style={[styles.title, { fontSize: height(2.5) }]}>
            {t("addPost.contactdetail")}
          </Text>
          {/* --------Email---- */}
          <IconButton
            onPress={() => {
              setAddEmail(!addEmail);
            }}
            title={"addPost.addEmail"}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            iconright={
              <FontAwesome
                name={!addEmail ? "toggle-off" : "toggle-on"}
                color={!addEmail ? "black" : AppColors.primary}
                size={height(3)}
              />
            }
            onPressRightIcon={() => {
              setAddEmail(!addEmail);
            }}
          />
          {addEmail && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.email")}</Text>
              <Input
                value={email}
                setvalue={setEmail}
                containerStyle={[styles.price, { width: width(90) }]}
                editable={false}
              />
            </View>
          )}
          {/* --------phone number---- */}
          <IconButton
            onPress={() => {
              setAddPhone(!addPhone);
            }}
            title={"addPost.addNumber"}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            iconright={
              <FontAwesome
                name={!addPhone ? "toggle-off" : "toggle-on"}
                color={!addPhone ? "black" : AppColors.primary}
                size={height(3)}
              />
            }
            onPressRightIcon={() => {
              setAddPhone(!addPhone);
            }}
          />
          {addPhone && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.phoneNumber")}</Text>
              <Input
                value={phone}
                setvalue={setPhone}
                containerStyle={[styles.price, { width: width(90) }]}
                editable={false}
              />
            </View>
          )}
          {/* --------whatsapp---- */}
          <IconButton
            onPress={() => {
              setAddWhatsapp(!addWhatsapp);
            }}
            title={"addPost.addWhatsapp"}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            iconright={
              <FontAwesome
                name={!addWhatsapp ? "toggle-off" : "toggle-on"}
                color={!addWhatsapp ? "black" : AppColors.primary}
                size={height(3)}
              />
            }
            onPressRightIcon={() => {
              setAddWhatsapp(!addWhatsapp);
            }}
          />
          {addWhatsapp && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.whatsapp")}</Text>
              <NumberInput
                value={whatsapp}
                setvalue={setWhatsapp}
                containerStyle={[styles.price, { width: width(90) }]}
                keyboardType="phone-pad"
              />
            </View>
          )}
          {/* --------viber---- */}
          <IconButton
            onPress={() => {
              setAddViber(!addViber);
            }}
            title={"addPost.addViber"}
            containerStyle={styles.container}
            textStyle={styles.texticon}
            iconright={
              <FontAwesome
                name={!addViber ? "toggle-off" : "toggle-on"}
                color={!addViber ? "black" : AppColors.primary}
                size={height(3)}
              />
            }
            onPressRightIcon={() => {
              setAddViber(!addViber);
            }}
          />
          {addViber && (
            <View style={{ paddingVertical: width(1) }}>
              <Text style={styles.title}>{t("addPost.viber")}</Text>
              <NumberInput
                value={viber}
                setvalue={setViber}
                containerStyle={[styles.price, { width: width(90) }]}
                keyboardType="phone-pad"
              />
            </View>
          )}
        </View>
        {/* --------location---- */}
        <View
          style={{
            paddingVertical: width(1),
            flexDirection: "row",
            width: width(90),
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{t("addPost.location")}</Text>
            <GooglePlacesAutocomplete
              fetchDetails={true}
              autoFillOnNotFound={true}
              placeholder={edit?.address || t("addPost.phlocation")}
              onPress={(data, details = null) => {
                setAddress(details?.formatted_address);
                setLatiitude(details?.geometry?.location?.lat);
                setLongitude(details?.geometry?.location?.lng);
                mapRef.current.animateToRegion(
                  {
                    latitude: details?.geometry?.location?.lat,
                    longitude: details?.geometry?.location?.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  },
                  3 * 1000
                );
              }}
              disableScroll={true}
              styles={{
                textInput: [
                  {
                    backgroundColor: AppColors.greybackground,
                    fontSize: height(1.8),
                    height: height(5),
                  },
                  addressRequire && styles.required,
                ],
              }}
              query={{
                key: Apikey,
                language: "en",
            
              }}
              currentLocationLabel="Current location"
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={300}
            />
            {addressRequire && (
              <Text style={styles.require}>*{t(`addPost.require`)}</Text>
            )}
          </View>
        </View>
        {/* --------Map view---- */}
        <View
          style={{
            height: height(20),
            width: width(90),
            alignSelf: "center",
            borderRadius: width(3),
          }}
        >
          <MapView
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: width(3),
            }}
          >
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
            />
          </MapView>
        </View>
        {/* --------T&C check---- */}
        <View
          style={{
            flexDirection: "row",
            paddingVertical: width(4),
            paddingHorizontal: width(1),
            alignSelf: "flex-start",
          }}
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
              <MaterialIcons name="check-box-outline-blank" size={height(2)} />
            }
            style={{ paddingRight: width(2) }}
            onClick={() => {
              setCheck(!check);
            }}
            checkedCheckBoxColor={AppColors.primary}
            isChecked={check}
          />
          <View
            style={{
              width: width(90),
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                fontSize: height(1.8),
              }}
            >
              {t("addPost.TandC1")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ScreenNames.TNC);
              }}
            >
              <Text
                style={{
                  color: AppColors.primary,
                  fontWeight: "bold",
                  fontSize: height(1.8),
                }}
              >
                {t("addPost.TandC2")}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: height(1.8),
              }}
            >
              {t("addPost.TandC3")}
            </Text>
          </View>
        </View>
        {/* --------button infomartio---- */}
        <View
          style={{
            padding: width(3),
            width: width(90),
          }}
        >
          <Button
            disabled={!check}
            onPress={addPost}
            title={edit ? "editAd.edit" : "addPost.post"}
            containerStyle={{
              width: width(80),
              borderRadius: width(2),
              backgroundColor: !check ? "grey" : AppColors.primary,
            }}
          />
        </View>
      </View>
      {/* --------Image Piker Model---- */}
      <FilePickerModal
        ref={imageRef}
        multi={true}
        onFilesSelected={(img) => {
          const selectedImages = img.map((imageUri) => {
            return Platform.OS === "android"
              ? imageUri.uri
              : imageUri.uri.replace("file://", "");
          });
          const combinedImages = [...image, ...selectedImages];

          // If the total number of images exceeds 7, slice the array to keep only the first 7
          const limitedImages = combinedImages.slice(0, 7);

          // Update the state with the limited images
          setImage(limitedImages);
        }}
      />
    </ScreenWrapper>
  );
}
