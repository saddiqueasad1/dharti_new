import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  container: {
    width: width(90),
    alignSelf: "center",
    alignContent:'center',
    justifyContent: "space-between",
    borderBottomWidth: width(0.2),
    margin:width(1),
    padding:width(1),
    
  },
  innerview: {
    flexDirection: "row",
    width: width(90),
    paddingLeft:width(2),
    alignItems:'center',
  },
});
export default styles;
