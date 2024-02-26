import { Platform, StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    width: width(95),
    marginVertical:height(.3),
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
  },
  imageview: {
    width: width(40),
    height: height(18),
  },
  image: {
    flex: 1,
    borderRadius: width(2),
  },
  detail: {
    width: width(28),
    justifyContent: "space-between",
    padding: width(2),
    alignItems: "flex-start",
  },
  icons: {
    paddingVertical: width(2),
    width: width(25),
    alignItems: "flex-end",
  },
  titletext: {
    color: AppColors.black,
    fontWeight: "bold",
    fontSize: height(2),
    paddingBottom: width(3),
  },
  categoryview: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height(.5),
  },
  textcategory: {
    color: AppColors.black,
    fontSize: height(1.5),
    marginLeft: width(2),
    width: width(35),
  },
  eur: {
    fontSize: height(1.5),
    color: "grey",
    fontWeight: "bold",
  },
  chf: {
    fontSize: height(2),
    color: AppColors.primary,
    fontWeight: "bold",
    paddingBottom: width(1),
  },
  cfpview: {
    backgroundColor: AppColors.grey,
    padding: width(2),
    borderRadius: width(1),
    width: width(32),
  },
  cfp: {
    fontSize: height(1.5),
    color: AppColors.primary,
    fontWeight: "bold",
  },
});
export default styles;
