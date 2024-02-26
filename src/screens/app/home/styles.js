import { Platform, StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    alignItems: "center",
    padding: height(1),
    paddingBottom: width(17),
    backgroundColor: AppColors.white,
  },
  title: {
    color: AppColors.black,
    fontWeight: "bold",
    fontSize: width(4),
    marginBottom: height(2),
  },
  searchinput: {
    width: width(90),
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: width(1),
    padding: width(2),
  },
  search: {
    width: width(95),
    borderRadius: height(1),
    flexDirection: "row",
    borderWidth: height(0.1),
    alignItems: "center",
    paddingVertical: height(.5),
  },
  titleview: {
    justifyContent: "space-between",
    padding: width(1),
    flexDirection: "row",
    width: width(95),
  },
  dropdown: { borderRadius: width(1), width: width(90), borderWidth: 0 },
  notfoundview: {
    width: width(90),
    height: height(55),
    alignItems: "center",
    justifyContent: "center",
  },
});
export default styles;
