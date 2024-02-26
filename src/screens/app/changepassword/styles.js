import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    height:height(100),
    backgroundColor: AppColors.white,
  },
  
  button:
  {
    backgroundColor:AppColors.primary,
    width:width(80),
    margin:width(5),
    borderRadius:width(1)
  }
});
export default styles;
