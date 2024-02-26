import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  categorytext: {
    fontSize: height(2),
    fontWeight: "bold",
    color: AppColors.black,
  },
  textseeall: {
    fontSize: height(1.3),
    fontWeight: "bold",
    marginTop: 8,
    color: "grey",
  },
  titleview: {
    justifyContent: "space-between",
    padding: width(1),
    flexDirection: "row",
    width: width(95),
  },
  listicon: {
    borderRadius: width(2),
  },
});
export default styles;
