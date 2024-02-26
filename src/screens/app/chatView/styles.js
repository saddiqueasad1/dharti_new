import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    padding: width(4),
    flex: 1,
    width: width(100),
    backgroundColor: AppColors.white,
  },
});
export default styles;
