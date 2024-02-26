import { Platform, StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingBottom: height(7),
  },
  imageiner: {
    padding: height(1),
  },
  verticalLine: {
    height: height(4),
    width: 1,
    backgroundColor: AppColors.greybackground,
    alignSelf:'flex-end'
  },

  avatar: {
    width: height(15),
    height: height(15),
    borderRadius: width(20),
    borderWidth: height(0.5),
    borderColor: AppColors.white,
    alignSelf: "center",
    position: "absolute",
    top: -height(8.1),
    zIndex: 1,
    backgroundColor: "white",
  },

  container: {
    backgroundColor: AppColors.white,
    width: width(100),
    justifyContent: "space-between",
    paddingVertical: height(2),
    marginVertical: height(0),
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  texticon: {
    color: AppColors.black,
    width: width(75),
    alignSelf: "flex-start",
    marginLeft: height(2),
    fontSize: height(1.8),
  },
  wishlistview: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    justifyContent: "center",
    padding: height(1),
    borderBottomWidth: 1,

    borderColor: AppColors.greybackground,
    paddingVertical: height(3),
    marginVertical: height(1),
  },
  wcontainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
  },
  wtexticon: {
    fontWeight: "bold",
    fontSize: height(1.8),
    textAlign: "center",
  },
  wtext: {
    fontWeight: "300",
    fontSize: height(1.5),
    textAlign: "center",
    textDecorationLine: "underline",
  },
  ptext: {
    fontSize: height(1.5),
    fontWeight: "bold",
    color: AppColors.black,
    margin: height(0.3),
  },
});
export default styles;
