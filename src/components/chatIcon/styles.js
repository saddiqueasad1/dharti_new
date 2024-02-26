import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";
import { he } from "date-fns/locale";

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    width: width(93),
    borderRadius: width(2),
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageview: {
    width: height(10),
  },
  image: {
    width: height(8),
    height: height(8),
    borderRadius: width(10),
    borderWidth: width(0.3),
    borderColor: AppColors.primary,
  },
  detail: {
    alignItems: "flex-start",
    width:width(50),
    marginTop: height(1),
  },
  icons: {
    alignItems:'flex-end',
    paddingVertical: height(1),
    marginHorizontal: width(1),
    width:width(20)
  },
});
export default styles;
