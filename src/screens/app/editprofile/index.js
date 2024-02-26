import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

import { FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  FilePickerModal,
  Head,
  Input,
  NumberInput,
  ScreenWrapper,
} from "../../../components";

import { useTranslation } from "react-i18next";
import { updateProfile } from "../../../backend/auth";
import { setAppLoader } from "../../../redux/slices/config";
import { selectUserMeta, setUserMeta } from "../../../redux/slices/user";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";
import { errorMessage } from "../../../utills/Methods";

export default function EditProfile({ navigation, route }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userdata = useSelector(selectUserMeta);
  const imageRef = useRef(null);
  const [image, setImage] = React.useState([userdata?.image]);
  const [firstName, setFirstName] = React.useState(userdata?.firstName || null);
  const [lastName, setLastName] = React.useState(userdata?.lastName || null);

  const [userName, setUserName] = React.useState(userdata?.userName || null);
  const [email, setEmail] = React.useState(userdata?.email || null);
  const [whatsapp, setWhatsapp] = React.useState(userdata?.whatsapp || "");
  const [viber, setViber] = React.useState(userdata?.viber || "");
  const [whatsappChannel, setWhatsappChannel] = React.useState(
    userdata?.whatsappChannel || ""
  );
  const [phoneNumber, setPhoneNumber] = React.useState(
    userdata?.phoneNumber || null
  );
  const update = async () => {
    try {
      dispatch(setAppLoader(true));
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("viber", viber);
      formData.append("whatsapp", whatsapp);
      formData.append("whatsappChannel", whatsappChannel);
      formData.append("file", {
        name: `image`,
        type: "image/jpeg", // Adjust the type if needed
        uri: image[0],
      });

      let d = await updateProfile(userdata?._id, formData);
      if (d) {
        dispatch(setUserMeta(d)), navigation.goBack();
      } else {
        errorMessage(t(`flashmsg.profileupdateerrormsg`), t(`flashmsg.error`));
      }
      dispatch(setAppLoader(false));
    } catch (error) {
      console.error("update", error);
      dispatch(setAppLoader(false));
    }
  };
  return (
    <ScreenWrapper
      headerUnScrollable={() => (
        <>
          <Head headtitle={"editprofile.headtitle"} navigation={navigation} />
          <View style={{ width: width(100), backgroundColor: AppColors.white }}>
            <View style={styles.imageiner}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => imageRef.current.show()}>
                  <Image style={styles.avatar} source={{ uri: image[0] }} />
                  <View
                    style={{
                      position: "absolute",
                      top: height(9),
                      left: height(12),
                      backgroundColor: AppColors.primary,
                      padding: width(2),
                      borderRadius: width(5),
                    }}
                  >
                    <FontAwesome
                      name="camera"
                      size={height(2)}
                      color={AppColors.white}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{ paddingLeft: width(3) }}>
                  <Text
                    style={{
                      fontSize: height(2),
                      fontWeight: "bold",
                      color: AppColors.black,
                      width: width(55),
                    }}
                  >
                    {firstName} {lastName}
                  </Text>

                  <Text
                    style={{
                      fontSize: height(1.5),
                      fontWeight: "bold",
                      marginTop: height(1),
                      color: AppColors.primary,
                    }}
                  >
                    {userdata?.userName}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
      scrollEnabled
    >
      <View style={styles.mainViewContainer}>
        <View style={{ paddingVertical: width(5) }}>
          <Input
            title={"editprofile.firstNameTitle"}
            placeholder={"editprofile.firstNamePlaceholder"}
            value={firstName}
            setvalue={setFirstName}
          />
          <Input
            title={"editprofile.lastNameTitle"}
            placeholder={"editprofile.lastNamePlaceholder"}
            value={lastName}
            setvalue={setLastName}
          />
          <Input
            title={"editprofile.emailTitle"}
            placeholder={"editprofile.emailPlaceholder"}
            value={email}
            setvalue={setEmail}
            editable={false}
            keyboardType="email-address"
          />
          <NumberInput
            title={"editprofile.phoneNumberTitle"}
            value={phoneNumber}
            setvalue={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <NumberInput
            title={"WhatsApp"}
            value={whatsapp}
            setvalue={setWhatsapp}
            keyboardType="phone-pad"
          />
          <Input
            title={"WhatsApp Channel"}
            placeholder={"whatsapp.com/channel/xxxxx"}
            value={whatsappChannel}
            setvalue={setWhatsappChannel}
          />
          <NumberInput
            title={"editprofile.viberTitle"}
            value={viber}
            setvalue={setViber}
            keyboardType="phone-pad"
          />

          <Button
            containerStyle={styles.button}
            onPress={update}
            title={"editprofile.update"}
          />
        </View>
      </View>
      <FilePickerModal
        ref={imageRef}
        onFilesSelected={(img) => {
          const selectedImages = img.map((imageUri) => {
            return Platform.OS === "android"
              ? imageUri.uri
              : imageUri.uri.replace("file://", "");
            //}
          });
          setImage(selectedImages);
        }}
      />
    </ScreenWrapper>
  );
}
