import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  container: {
    backgroundColor:AppColors.white,
    width: width(100),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuicon: {
    paddingLeft: width(5),
    flexDirection: "row",
    alignItems: "center",
  },
  textdetail: {
    color: AppColors.black,
    fontWeight: "bold",
    fontSize: height(2.5),
    marginLeft: width(3),
  },
});
export default styles;
