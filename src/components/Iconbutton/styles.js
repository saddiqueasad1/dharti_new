import { Platform, StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: width(1),
    backgroundColor: AppColors.primary,
    alignSelf: "center",
    paddingVertical: height(1),
    paddingHorizontal: height(2),

    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
    flexDirection: "row",
  },
  text: {
    color: AppColors.white,
    fontSize: height(1.8),
    fontWeight: "bold",
    marginHorizontal: width(1),
  },
});
export default styles;
