import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",alignSelf:'center'
  },
  containerStyle: {
    borderRadius: width(2),
    backgroundColor: AppColors.primary,
  },
  image: {
    width: width(75),
    alignSelf: "center",
    height: width(70),marginVertical:height(10)
  },
  text: { fontSize: height(2), margin: width(10), fontWeight: "bold" },
});
export default styles;
