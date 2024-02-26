import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  mainViewContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingBottom: height(2),
  },
  imageview: {
    width: width(100),
    backgroundColor: AppColors.transparent,
  },
  image: {
    width: width(95),
    height: height(30),
  },
  cfpview: {
    backgroundColor: AppColors.grey,
    padding: width(2),
    borderRadius: width(1),
  },
  cfp: {
    fontSize: width(3.5),
    color: AppColors.primary,
    fontWeight: "bold",
  },
  nameview: {
    padding: width(4),
    justifyContent: "space-between",
    borderBottomWidth: 0.3,
    borderColor: "grey",
  },
  detailview: {
    padding: width(4),
    paddingBottom: 0,
  },
  detailcard: {
    padding: width(4),
    backgroundColor: "#E5E8E84D",
    borderRadius: width(2),
  },
  cardrow: { flexDirection: "row", flex: 1, marginVertical: height(0.5) },
  cardelement: {
    fontSize: height(1.5),
    flex: 1,
    fontWeight: "bold",
    color: AppColors.black,
  },
  cardelement2: { fontSize: height(1.5), flex: 1, color: AppColors.black },
  profileview: { padding: width(4) },
  profilecard: {
    padding: width(2),
    backgroundColor: AppColors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: AppColors.greybackground,
  },
  profilecardin: {
    justifyContent: "space-between",
    alignItems: "center",
    alignItems: "flex-start",
  },
  profileimage: {
    width: height(7),
    height: height(7),
    borderRadius: width(10),
    borderColor: AppColors.black,
    borderWidth: height(0.1),
  },
  map: {
    height: height(30),
    width: width(90),
    alignSelf: "center",
    borderRadius: width(3),
  },
  contact: {
    paddingLeft: width(5),
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  modelImage: {
    flex: 1,
    width: width(100),
    height: "100%",
  },
  modelView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
export default styles;
