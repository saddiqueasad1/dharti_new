import { StyleSheet } from "react-native";
import AppColors from "../../../utills/AppColors";
import { height, width } from "../../../utills/Dimension";

const styles = StyleSheet.create({
  mainViewContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  imageiner: {
    height: height(15),
    justifyContent: "flex-end",
    marginLeft: width(10),
  },
  logintext: {
    fontSize: height(4),
    color: AppColors.white,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: AppColors.primary,
    width: width(80),
    margin: width(2),
  },
  dbutton: {
    backgroundColor: "grey",
    width: width(80),
    margin: width(2),
  },
  image: { width: width(100), height: height(22) },
  checkview: { flexDirection: "row", padding: width(4) },
  tandc: { color: AppColors.primary, fontWeight: "bold",fontSize:height(1.6) },
  already: {
    alignSelf: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  signin: { color: AppColors.primary, fontWeight: "bold",fontSize:height(1.5) },
});
export default styles;
