import * as ImagePicker from "expo-image-picker";
// import * as Permissions from "expo-permissions";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import DropDownMenu from "../dorpdownmenu";

const FilePickerModal = ({ onFilesSelected, multi = false }, ref) => {
  const { t } = useTranslation();
  const [isVisible, setVisible] = useState(false);

  // const requestPermissions = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //   await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  //   await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);
  //   if (status !== "granted") {
  //     alert("Permission to access camera or camera roll denied!");
  //   }
  // };

  useEffect(() => {
    // requestPermissions();
  }, []);
  useImperativeHandle(ref, () => ({
    show: function () {
      setVisible(true);
    },
    hide: function () {
      setVisible(false);
    },
    cleanTempImages: () => {
      ImagePicker.cleanTempImages()
        .then(() => {
          console.log("removed all tmp images from tmp directory");
        })
        .catch(console.log);
    },
  }));
  const openCamera = async () => {
    try {
      await ImagePicker.launchCameraAsync({
        quality: .5,
      })
        .then((a) => onFilesSelected(a.assets))
        .catch((e) => console.log("my log", e));
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };
  const openGallery = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: multi,
      selectionLimit: 7,
      aspect: [4, 3],
      quality: .5,
    })
      .then((a) => onFilesSelected(a.assets))
      .catch((e) => console.log("my log", e));
  };

  function openPicker(type = 0) {
    setVisible(false);
    setTimeout(type == 0 ? openCamera : openGallery, 400);
  }
  return (
    <DropDownMenu
      isVisible={isVisible}
      firstBtnText={t("addPost.takephoto")}
      secondBtnText={t("addPost.choosefromgallery")}
      onPressFirstBtn={() => openPicker(0)}
      onPressSecondBtn={() => openPicker(1)}
      onClose={() => setVisible(false)}
    />
  );
};
export default forwardRef(FilePickerModal);
