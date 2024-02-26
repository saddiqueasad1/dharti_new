import { Platform, StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  main: {
    width: width(95),
    padding: width(2),
    backgroundColor: AppColors.white,
    borderRadius: width(1),
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
    margin: height(0.5),
    justifyContent: "space-between",
  },
  imageview: {
    flex: 1,
    backgroundColor: AppColors.transparent,
    alignSelf: "center",
    borderRadius: width(3),
    marginBottom: height(1),
  },
  image: {
    height: height(23),
    width: width(87),
    borderRadius: height(2),
    resizeMode: "contain",
  },
  detail: {
    width: width(93),
    justifyContent: "space-between",
    padding: height(0.5),
  },
  cfpview: {
    backgroundColor: AppColors.grey,
    padding: height(0.5),
    borderRadius: width(1),
  },
  cfp: {
    fontSize: height(1.8),
    color: AppColors.primary,
    fontWeight: "bold",
  },
  detailinerview: {
    paddingBottom: width(2),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chf: {
    fontSize: height(2.2),
    color: AppColors.primary,
    fontWeight: "bold",
  },
  eur: {
    fontSize: height(1.8),
    color: "grey",
    fontWeight: "bold",
  },
  icons: {
    width: width(20),
    justifyContent: "space-between",
    flexDirection: "row",
    padding: width(2),
    alignItems: "center",
  },
  titletext: {
    color: AppColors.black,
    fontSize: height(2),
    marginVertical: height(0.5),
    fontWeight: "bold",
  },
  categoryview: { flexDirection: "row", alignItems: "center" },
  categorytext: {
    fontSize: height(1.5),
    marginLeft: height(0.6),
    width: width(65),
    color: "grey",
  },
  cics: {
    resizeMode: "cover",
    height: height(30),
    alignItems: "center",
    alignSelf: "center",
  },
});
export default styles;
