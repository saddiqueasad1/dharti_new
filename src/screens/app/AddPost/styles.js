import { Platform, StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    alignItems: "center",
    padding: height(2),
    backgroundColor: AppColors.white,
    flexBasis: "auto",
  },
  title: {
    fontSize: height(1.8),
    paddingVertical: width(2),
    paddingLeft: width(2),
    fontWeight: "bold",
    color: AppColors.black,
  },
  searchbox: {
    width: width(90),
    borderRadius: width(1),
    height: height(6),
    // borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dropdown: {
    borderRadius: width(1),
    width: width(90),
  },
  price: {
    backgroundColor: AppColors.greybackground,
    borderBottomWidth: 0,
    borderRadius: width(1),
  },
  container: {
    backgroundColor: AppColors.white,
    width: width(90),
    justifyContent: "flex-start",
    paddingVertical: width(3),
    borderRadius: width(0),
    alignSelf: "center",
    paddingHorizontal: height(0),

    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  texticon: {
    color: AppColors.black,
    width: width(80),
    alignSelf: "flex-start",
  },
  require: {
    color: "red",
    fontSize: height(1.3),
    paddingHorizontal: width(3),
  },
  required: {
    borderWidth: 1,
    borderColor: "red",
    borderBottomWidth: 1,
  },
});
export default styles;
