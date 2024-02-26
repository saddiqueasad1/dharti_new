import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  container: {
    width: width(90),
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "space-between",
    borderBottomWidth: width(0.2),
    margin: width(1),
    padding: width(1),
  },
  parent_View: {
    width: width(90),
    alignSelf: "center",
    marginTop: height(2),
  },
  text_Style: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: "1%",
  },
  phoneContainer: {
    width: width(80),
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.transparent,
    padding: 0,
    margin: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: height(5),
  },
  textInput: {
    padding: 0,
    margin: 0,
    fontSize: height(1.5),
    paddingVertical: 0,
    backgroundColor: AppColors.transparent,
    paddingHorizontal: 0,
  },
  inputStyle: {
    width: width(78),
    height: height(6),
    fontSize: 16,
  },
  iconStyle: {
    width: width(12),
    height: height(6),
    alignItems: "center",
    justifyContent: "center",
  },
  innerview: {
    flexDirection: "row",
    width: width(90),
    paddingLeft: width(2),
    alignItems: "center",
  },
});
export default styles;
