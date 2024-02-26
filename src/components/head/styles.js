import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    width: width(100),
    flexDirection: "row",
    alignItems: "center",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  menuicon: {
    paddingLeft: width(3),
  },
  headview: {
    paddingVertical: height(1),
    justifyContent: "center",
  },
  headtext: {
    color: AppColors.primary,
    fontSize: height(3),
    width: width(90),
    fontWeight: "bold",
  },
});
export default styles;
