import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";
const styles = StyleSheet.create({
  container: {
    width: width(30),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: width(3),
    flexDirection: "row",
  },
  text: {
    color: AppColors.black,
    fontSize: width(3.2),
    marginLeft: width(2),
    fontWeight: "bold",
  },
  image: { width: width(20), height: width(20), borderRadius: width(10) },
});
export default styles;
