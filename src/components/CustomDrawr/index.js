import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenNames from "../../routes/routes";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";
import IconButton from "../Iconbutton";
import { ScrollView } from "react-native-gesture-handler";
const CustomDrawer = ({ navigation }) => {
  const shareContent = async () => {
    try {
      const result = await Share.share({
        message: "Hello, this is the content to share!",
      });

      if (result.action === Share.sharedAction) {
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Image
          source={require("../../../assets/splash.png")}
          style={{
            width: height(35),
            height: height(30),
            tintColor: AppColors.primary,
            alignSelf: "center",
          }}
        />
      </View>
      <View
        style={{
          flex: 2.7,
        }}
      >
        <ScrollView>
          <IconButton
            title={"drawr.faq"}
            containerStyle={styles.container}
            onPress={() => {
              navigation.navigate(ScreenNames.FAQ), navigation.closeDrawer();
            }}
            textStyle={styles.text}
            icon={
              <AntDesign
                name="questioncircle"
                style={styles.icon}
                size={height(2)}
              />
            }
          />
          <IconButton
            title={"drawr.HTSF"}
            onPress={() => {
              navigation.navigate(ScreenNames.HTSF), navigation.closeDrawer();
            }}
            containerStyle={styles.container}
            textStyle={styles.text}
            icon={
              <AntDesign name="tags" style={styles.icon} size={height(2)} />
            }
          />
          <IconButton
            title={"drawr.aboutus"}
            onPress={() => {
              navigation.navigate(ScreenNames.ABOUTUS),
                navigation.closeDrawer();
            }}
            containerStyle={styles.container}
            textStyle={styles.text}
            icon={
              <AntDesign
                name="infocirlce"
                style={styles.icon}
                size={height(2)}
              />
            }
          />
          <IconButton
            title={"drawr.privacyPolicy"}
            onPress={() => {
              navigation.navigate(ScreenNames.PP), navigation.closeDrawer();
            }}
            containerStyle={styles.container}
            textStyle={styles.text}
            icon={
              <Ionicons
                name="shield-checkmark-sharp"
                style={styles.icon}
                size={height(2)}
              />
            }
          />
          <IconButton
            title={"drawr.TermsAndCondition"}
            onPress={() => {
              navigation.navigate(ScreenNames.TNC), navigation.closeDrawer();
            }}
            containerStyle={styles.container}
            textStyle={styles.text}
            icon={
              <Entypo name="open-book" style={styles.icon} size={height(2)} />
            }
          />
          <IconButton
            title={"drawr.contactUs"}
            containerStyle={styles.container}
            textStyle={styles.text}
            onPress={() => Linking.openURL("https://eidcarosse.ch/contact-us")}
            icon={
              <AntDesign name="contacts" style={styles.icon} size={height(2)} />
            }
          />
          <IconButton
            title={"drawr.appSetting"}
            containerStyle={styles.container}
            textStyle={styles.text}
            icon={
              <Ionicons name="settings" style={styles.icon} size={height(2)} />
            }
            onPress={() => {
              navigation.navigate(ScreenNames.SETTING),
                navigation.closeDrawer();
            }}
          />

          <IconButton
            title={"drawr.SNTU"}
            onPress={() => {
              navigation.navigate(ScreenNames.SNTU), navigation.closeDrawer();
            }}
            containerStyle={styles.container}
            textStyle={styles.text}
            icon={<AntDesign name="car" style={styles.icon} size={height(2)} />}
          />
          <IconButton
            title={"drawr.RFRN"}
            onPress={() => {
              navigation.navigate(ScreenNames.REPAIR), navigation.closeDrawer();
            }}
            containerStyle={styles.container}
            textStyle={styles.text}
            icon={
              <FontAwesome name="wrench" style={styles.icon} size={height(2)} />
            }
          />
          {/* <IconButton
          title={"drawr.share"}
          onPress={shareContent}
          containerStyle={styles.container}
          textStyle={styles.text}
          icon={<Entypo name="share" style={styles.icon}  size={height(2)} />}
        /> */}
          <View style={styles.bottomview}>
            <Text style={styles.textbuttom}>
              Copyright © 2023. All rights reserved by
              <Text
                style={{
                  color: AppColors.primary,
                  fontWeight: "bold",
                  fontSize: height(1.5),
                }}
              >
                {" "}
                Eidcarosse.ch
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
// E5E8E8
export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    width: width(75),
    margin: width(2),
    marginLeft: -width(3),
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    justifyContent: "flex-start",
  },
  icon: {
    color: AppColors.white,
    marginHorizontal: width(1),
  },
  text: {
    fontSize: height(1.8),
  },
  textbuttom: {
    alignSelf: "center",
    fontSize: height(1.5),
    color: AppColors.black,
  },
  bottomview: {
    height: height(5),
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
  },
});
