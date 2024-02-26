import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  main: {
    width: width(75),
    borderRadius: height(1),
    padding: height(0.5),
    flexDirection: "row",
    borderWidth: height(0.05),
    alignItems: "center",
  },
  serachBtn: {
    flex: 1,
    padding: height(0.1),
    paddingVertical: height(0.2),
    backgroundColor: AppColors.primary,
    borderRadius: height(0.2),
    marginVertical: height(0.2),
  },
  searchTxt:{
    fontSize: height(1.5),
    margin: height(0.1),
    padding: height(0.1),
  },
  flatcontainer: {
    padding: height(0.2),
    margin: height(0.2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: height(1),

  },
  flatView:{
    backgroundColor: "white",
    maxHeight: height(25),
    width: width(95),
    flexDirection: "row",
    marginVertical:height(1)
  }
});
export default styles;
