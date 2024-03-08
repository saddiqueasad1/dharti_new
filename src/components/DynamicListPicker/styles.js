import { StyleSheet } from "react-native";
import AppColors from "../../utills/AppColors";

const styles = StyleSheet.create({
  centeredModalview: {
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  container: {},
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalText: {
    fontSize: 17,
    paddingBottom: 12,
  },
  modalView: {
    width: "94%",
    backgroundColor: "white",
    borderRadius: 3,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerFieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    borderWidth: 0.7,
    borderColor: AppColors.border_light,
    height: 32,
    borderRadius: 3,
    backgroundColor: AppColors.white,
  },
  pickerOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  pickerOptionsText: {
    fontSize: 16,
    color: AppColors.text_dark,
    textTransform: "capitalize",
    flex: 1,
  },
});

export default styles;
