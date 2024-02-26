import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    backgroundColor: AppColors.white,
  },

  button: {
    backgroundColor: AppColors.primary,
    width: width(80),
    margin: width(5),
    borderRadius: width(1),
  },
  logoutcontainer: {
    backgroundColor: AppColors.white,
    width: width(90),
    justifyContent: "center",
    borderWidth:1,
    borderColor:AppColors.primary,
    borderRadius:width(1),
    margin:height(1)
  },
  deletecontainer: {
    width: width(90),
    justifyContent: "center",
    borderColor:AppColors.primary,
    borderRadius:width(1),
    paddingVertical:height(1),
    margin:width(2)
  },
});
export default styles;
