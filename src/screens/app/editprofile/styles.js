import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  imageiner: {
    padding: width(3),
  },
  avatar: {
    width: height(14),
    height: height(14),
    borderRadius: width(30),
    marginLeft: width(5),
    borderColor: AppColors.primary,
    borderWidth: height(0.4),
  },
  card: {
    width: width(95),
    margin: width(1),
    borderRadius: width(2),
    alignSelf: "center",
    backgroundColor: AppColors.white,
    padding: width(4),
  },
  container: {
    backgroundColor: AppColors.white,
    width: width(90),
    justifyContent: "flex-start",
    paddingVertical: width(5),
    marginVertical: width(2),
    borderRadius: width(1),
  },
  texticon: {
    color: AppColors.black,
    width: width(70),
    alignSelf: "flex-start",
    marginLeft: width(4),
  },
  wishlistview: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  wcontainer: {
    backgroundColor: AppColors.white,
    flexDirection: "column",
    padding: width(1),
  },
  wtexticon: {
    color: AppColors.black,
    fontSize: 12,
    marginTop: width(2),
  },
  button: {
    backgroundColor: AppColors.primary,
    width: width(80),
    margin: width(5),
    borderRadius: width(1),
  },
});
export default styles;
