import { StyleSheet, Platform } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    alignItems: "center",
    padding: height(1),
    backgroundColor: AppColors.white,
  },
  searchbox: {
    backgroundColor: AppColors.grey,
    width: width(90),
    borderRadius: width(1),
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
  container: {
    backgroundColor: AppColors.white,
    width: width(95),
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
    width: width(87),
    alignSelf: "flex-start",
    fontWeight: "normal",
  },
  dropdown: { borderRadius: width(1), width: width(90) },
});
export default styles;
