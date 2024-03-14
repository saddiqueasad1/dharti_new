import { StyleSheet, Dimensions } from "react-native";
import AppColors from "../../utills/AppColors";

import { height, width } from "../../utills/Dimension";
const { width: screenWidth } = Dimensions.get("screen");

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    width: width(93),
    borderRadius: width(2),
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageview: {
    width: height(10),
  },
  image: {
    width: height(8),
    height: height(8),
    borderRadius: width(10),
    borderWidth: width(0.3),
    borderColor: AppColors.primary,
  },
  detail: {
    alignItems: "flex-start",
    width: width(50),
    marginTop: height(1),
  },
  icons: {
    alignItems: "flex-end",
    paddingVertical: height(1),
    marginHorizontal: width(1),
    width: width(20),
  },
  addTitle: {
    color: AppColors.primary,
  },
  bgWhite: {
    backgroundColor: AppColors.white,
    flex: 1,
  },
  bgDark: {
    backgroundColor: AppColors.bg_dark,
    flex: 1,
  },
  chatDetails: {
    display: "flex",
    flex: 1,
  },
  chatImage: {
    height: 60,
    width: 60,
    resizeMode: "cover",
  },
  chatImageContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  chatListWrap: {
    flex: 1,
  },
  chatLogIn: {
    width: "60%",
    paddingVertical: 10,
    borderRadius: 3,
    marginVertical: 40,
  },
  chatTitle: {
    fontSize: 15,
    color: AppColors.text_dark,
    fontWeight: "bold",
  },
  deleteLoading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    flex: 1,
    height: "100%",
    width: "100%",
  },
  deleteLoadingContentWrap: {
    paddingHorizontal: "3%",

    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    flex: 1,
  },
  message: {
    flexDirection: "row",
    alignItems: "center",
    padding: screenWidth * 0.03,
    marginVertical: 3,
    elevation: 3,
    shadowColor: AppColors.black,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  noChatIcon: {
    marginVertical: 30,
    alignItems: "center",
  },
  noChatMessage: {
    color: AppColors.text_gray,
  },
  noChatTitle: {
    fontSize: 16,
    color: AppColors.text_dark,
  },
  noChatWrap: {
    paddingVertical: 40,
    backgroundColor: AppColors.white,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  noUserMessage: {
    textAlign: "center",
    fontSize: 17,
    color: AppColors.text_gray,
    marginTop: 20,
  },
  noUserWrap: {
    paddingTop: 40,
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
  },
  noInternet: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  shadow: {
    width: 110,
    resizeMode: "contain",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
});
export default styles;
