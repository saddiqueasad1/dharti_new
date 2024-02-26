import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    width: width(100),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: height(2),
    alignItems: "center",
  },
  menuicon: {},
  image: {
    width: height(6),
    height: height(6),
    borderRadius: height(1),
    marginVertical: height(0.5),
  },
  image2: {
    width: height(16.5),
    height: height(2),
    marginHorizontal: height(1),
  },
  headerTitle: {
    borderRadius: height(1),
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    color: AppColors.primary,
    fontSize: height(2.5),
    fontWeight: "bold",
    paddingHorizontal: height(1),
    fontStyle: "italic",
  },
});
export default styles;
