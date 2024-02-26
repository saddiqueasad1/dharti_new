import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";
import { height, width } from "../../utills/Dimension";

const styles = StyleSheet.create({
  container:{
    flexDirection:'row'
  },
  main: {
    justifyContent: "center",
    alignItems: "center",
  },
  categorytext: {
    fontSize: width(4),
    fontWeight: "bold",
    marginVertical: width(2),
  },
  textseeall: {
    fontSize: width(2.8),
    fontWeight: "bold",
    marginTop: height(2),
    color: "grey",
  },
  titleview: {
    justifyContent: "space-between",
    padding: width(1),
    flexDirection: "row",
    width: width(90),
    marginTop:height(3)
  },
  listicon: {
    borderRadius: width(2),
  },
  emptyview: {
    alignItems: "center",
  },
  emptyimage: { height: width(30), width: width(30) },
});
export default styles;
