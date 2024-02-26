import { Platform, StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    width: width(95),
    backgroundColor: AppColors.white,
    borderRadius: width(2),
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
    marginVertical: width(1),
  },
  titletext: {
    fontWeight: "bold",
    fontSize: height(2),
    paddingBottom: width(1),
    color: AppColors.black,
  },
  categoryview: { flexDirection: "row", alignItems: "center" },
  detailtext: {
    fontSize: height(1.3),
    marginLeft: width(2),
    width: width(34),
    marginVertical: width(0.5),
    color: AppColors.black,
  },
  chf: {
    fontSize: height(1.8),
    color: AppColors.primary,
    fontWeight: "bold",
  },
  eur: {
    fontSize: height(1.5),
    color: "grey",
    fontWeight: "bold",
  },
  cfpview: {
    backgroundColor: AppColors.grey,
    padding: height(1),
    borderRadius: width(1),
    width: width(38),
  },
  cfp: {
    fontSize: height(1.5),
    color: AppColors.primary,
    fontWeight: "bold",
  },
  space: { paddingVertical: width(1) },
  imageview: {
    width: width(45),
  },
  image: {
    width: width(45),
    height: height(20),
    borderRadius: width(2),
  },
  detail: {
    width: width(38),
    justifyContent: "space-between",
    padding: width(2),
    alignItems: "flex-start",
  },
  icons: {
    width: width(10),
    alignItems: "flex-end",
    paddingVertical: width(2),
    height: height(10),
  },
  textcategory: {
    fontSize: height(1.5),
    marginLeft: width(2),
    width: width(35),
  },
});
export default styles;
