import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  Modal,
  Text,
  Dimensions,
} from "react-native";

// Expo Libraries
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";

// Vector Icons
import { FontAwesome } from "@expo/vector-icons";

// Custom Component & Variables
import AppColors from "../../utills/AppColors";
import AppTextButton from "../AppTextButton";
import CameraButtonIcon from "../../asset/svgComponents/CameraButtonIcon";
import GalleryButtonIcon from "../../asset/svgComponents/GalleryButtonIcon";
import { miscConfig } from "../../utills/miscConfig";
import { useTranslation } from "react-i18next";

const { width: deviceWidth } = Dimensions.get("screen");

const ImageInput = ({
  imageUri,
  onChangeImage,
  drag,
  active,
  addingImage,
  closePhotoModal,
  display,
  index,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!addingImage) {
      return;
    }
    setModalVisible(true);
  }, [addingImage]);

  const requestGalleryParmission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted)
      alert(
         t("imageInputTexts.ifImageLibraryPermissionDenied" )
      );
    else handleSelectGalleryImage();
  };
  const requestCameraParmission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted)
      alert( t("imageInputTexts.ifCameraPermissionDenied" ));
    else handleSelectCameraImage();
  };
  const handleSelectGalleryImage = async () => {
    // if (Platform.OS === "android") {
    // }
    setTimeout(() => {
      setModalVisible(false);
    }, 100);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: miscConfig?.allowMultipleImageSelection
          ? false
          : miscConfig?.allowImageEditing || false,
        quality: 0.8,
        allowsMultipleSelection:
          miscConfig?.allowMultipleImageSelection || false,
      });
      if (!result.cancelled) {
        if (result?.selected) {
          onChangeImage(result.selected);
        } else {
          onChangeImage(result.uri);
        }
      }
    } catch (error) {
      // TODO add error storing
      setModalVisible((modalVisible) => !modalVisible);
    }
  };
  const handleSelectCameraImage = async () => {
    // if (Platform.OS === "android") {
    //   setModalVisible((prevModalVisible) => !prevModalVisible);
    // }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });
      if (!result.cancelled) {
        // if (Platform.OS === "ios") {
        setModalVisible(false);
        // }
        onChangeImage(result.uri);
      }
    } catch (error) {
      // TODO add error storing
      setModalVisible((modalVisible) => !modalVisible);
    }
  };
  const handleDelete = () => {
    Alert.alert(
      t ("imageInputTexts.deleteMessageHeader" ),
       t("imageInputTexts.deletePrompt" ),
      [
        { text:  t("imageInputTexts.noButton" ) },
        {
          text:  t("imageInputTexts.yesButton" ),
          onPress: () => onChangeImage(null),
        },
      ]
    );
  };
  const handlePress = () => {
    if (!imageUri) setModalVisible((modalVisible) => !modalVisible);
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={handlePress} onLongPress={drag}>
        <View
          style={[styles.container, { display: display ? "flex" : "none" }]}
        >
          {active && <View style={styles.activeOverlay} />}
          {!imageUri && (
            <FontAwesome name="camera" size={30} color={AppColors.text_gray} />
          )}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
        </View>
      </TouchableWithoutFeedback>
      {index === 0 && (
        <TouchableOpacity style={styles.titleImgWrap} onPress={handleDelete}>
          <Entypo name="check" size={12} color={AppColors.white} />
        </TouchableOpacity>
      )}
      {imageUri && (
        <TouchableOpacity style={styles.deleteImgWrap} onPress={handleDelete}>
          <View
            style={{ height: 3, width: 10, backgroundColor: AppColors.white }}
          />
        </TouchableOpacity>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible((modalVisible) => !modalVisible);
            closePhotoModal();
          }}
        >
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalTitleWrap}>
              <Text style={styles.modalTitle}>
                {t("imageInputTexts.addPhoto" )}
              </Text>
            </View>
            <View style={styles.contentWrap}>
              <TouchableOpacity
                style={styles.libraryWrap}
                onPress={() => requestCameraParmission()}
              >
                <CameraButtonIcon
                  fillColor={AppColors.bg_primary}
                  strokeColor={AppColors.primary}
                  iconColor={AppColors.primary}
                />
                <Text style={styles.libraryText}>
                  { t("imageInputTexts.takePhoto" )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.libraryWrap}
                onPress={() => requestGalleryParmission()}
              >
                <GalleryButtonIcon
                  fillColor="#EBF9FF"
                  strokeColor="#2267ED"
                  iconColor="#2267ED"
                />
                <Text style={styles.libraryText}>
                  { t("imageInputTexts.fromGallery" )}
                </Text>
              </TouchableOpacity>
            </View>
            <AppTextButton
              style={styles.cancelButton}
              title={ t("imageInputTexts.cancelButtonTitle" )}
              onPress={() => {
                setModalVisible((modalVisible) => !modalVisible);
                closePhotoModal();
              }}
              textStyle={{ color: AppColors.text_dark, fontWeight: "bold" }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  activeOverlay: {
    height: "100%",
    width: "100%",
    backgroundColor: AppColors.bg_primary,
    opacity: 0.3,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 6,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#e5e5e5",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    height: deviceWidth * 0.2,
    width: deviceWidth * 0.2,
    marginRight: deviceWidth * 0.04,
  },
  contentWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteImgWrap: {
    position: "absolute",
    height: 18,
    width: 18,
    borderRadius: 9,
    top: "20%",
    right: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.red,
  },
  titleImgWrap: {
    position: "absolute",
    height: 18,
    width: 18,
    borderRadius: 9,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.green,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  libraryText: {
    fontSize: 14.5,
    color: AppColors.text_gray,
    marginVertical: 10,
  },
  libraryWrap: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: AppColors.text_dark,
    marginBottom: 15,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 25,
    alignItems: "center",
  },
});

export default ImageInput;
