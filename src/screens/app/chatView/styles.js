import { StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";

const styles = StyleSheet.create({
  chatBoxWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:  AppColors.white,
    marginHorizontal: "2%",
    marginVertical: 5,
    borderRadius: 30,
  },
  chatInput: {
    minHeight: 40,
    backgroundColor:  AppColors.white,
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 11 : 0,
    borderRadius: 30,
    paddingHorizontal: 15,
  },

  container: {
    backgroundColor: "#ededed",
    flex: 1,
  },
  deletedMessageWrap: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
  },
  deletedMessage: {
    color:  AppColors.text_dark,
  },
  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 1,
    backgroundColor:  AppColors.bg_dark,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    flex: 1,
  },
  mainWrap: {
    backgroundColor:  AppColors.bg_dark,
    paddingVertical: 10,
    elevation: 2,
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor:  AppColors.white,
    flex: 1,
  },
  sendButton: {
    padding: 6,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:  AppColors.bg_primary,
    borderRadius: 20,
  },
});

export default styles;
