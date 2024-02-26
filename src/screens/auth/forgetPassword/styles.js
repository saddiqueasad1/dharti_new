import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    backgroundColor: AppColors.white,
    flex:1
  },
  imageiner: {
    height: height(25),
    justifyContent: "flex-end",
    marginLeft: width(10),
  },
  logintext: {
    fontSize: height(3.7),
    color: AppColors.white,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: AppColors.primary,
    width: width(80),
    margin: width(3),
  },
  bg: { width: width(100), height: height(28) },
  forget: {
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  text: { color: AppColors.primary, fontWeight: "bold" },
});
export default styles;
