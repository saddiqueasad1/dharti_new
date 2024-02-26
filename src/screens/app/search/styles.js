import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: width(95),
    borderRadius: height(1),
    paddingHorizontal: height(2),
    paddingVertical: height(1),
    margin: height(0.3),
    alignItems: "center",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  imageStyle: {
    width: height(5),
    height: height(5),
  },
  textStyle: {
    fontSize: height(1.8),
    fontWeight: "500",
    paddingHorizontal: width(8),
    width: width(67),
  },
});
export default styles;
