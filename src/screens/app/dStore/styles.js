import { StyleSheet, Dimensions } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";
const { width: windowWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  mainViewContainer: {
    alignItems: "center",
    padding: width(1),
    backgroundColor: AppColors.white,
  },
  imageview: {

    width: width(96),
    borderRadius: width(1),
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  image: {
    height: height(30),
    resizeMode: "contain"
  },
  title: {
    fontSize: width(4),
    fontWeight: "bold",
    color: AppColors.black,
    margin: width(5),
  },
  description: {
    fontSize: height(2),
  },
  button: {
    backgroundColor: AppColors.primary,
    width: width(96),
    borderRadius: width(1),
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
    flex: 1,
  },
  logo: {
    height: windowWidth * 0.17,
    width: windowWidth * 0.25,
    resizeMode: "contain",
  },
  logoWrap: {
    height: windowWidth * 0.17,
    width: windowWidth * 0.25,
    overflow: "hidden",
  },
  storeCardListingCount: {
    fontSize: 13,
    fontWeight: "bold",
    color: AppColors.text_gray,
  },
  storeCardTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginVertical: 5,
  },
  storeContent: {
    alignItems: "center",
    padding: 5,
  },
  storeWrap: {
    // height: (windowWidth * 0.88) / 3,
    width: (windowWidth * 0.88) / 3,
    marginHorizontal: windowWidth * 0.015,
    backgroundColor: AppColors.white,
    marginBottom: windowWidth * 0.03,
    borderRadius: 5,
    // overflow: "hidden",
    alignItems: "center",
    elevation: 3,
    shadowColor: AppColors.gray,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
});
export default styles;
