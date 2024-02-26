import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: width(90),
    borderRadius: height(0.5),
    paddingHorizontal: height(2),
    paddingVertical: height(1),
    margin: height(.3),
    alignItems: "center",
    alignSelf: "center",
  },
  imageStyle: {
    width: height(3),
    height: height(3),
  },
  textStyle:{
    fontSize:height(1.8),
    fontWeight:'500',
    paddingHorizontal:width(6),
    width:width(70),
  }
});
export default styles;
