import { Platform, StyleSheet, Dimensions } from "react-native";
import AppColors from "../../utills/AppColors";
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const styles = StyleSheet.create({
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#e5e5e5",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
  },
  libraryText: {
    fontSize: 14.5,
    color: AppColors.text_gray,
    marginVertical: 10,
  },
  libraryWrap: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  contentWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: AppColors.text_dark,
    marginBottom: 15,
  },
  bHContentWrap: {
    marginHorizontal: "3%",
  },
  bHDayLeftWrap: {
    flex: 1,
  },
  bHDayName: {
    fontSize: 14,
    fontWeight: "bold",
    color: AppColors.text_gray,
    textTransform: "capitalize",
  },
  bHDayRightWrap: {
    flex: 3,
  },
  bHDayWrap: {
    flexDirection: "row",
    marginVertical: 8,
  },
  bHToggleBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: AppColors.text_gray,
  },
  bHToggleBtnWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  bHToggleNoteWrap: {
    marginTop: 5,
    marginBottom: 15,
  },
  bHWrap: {},
  btnWrap: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 20,
  },
  commonField_Text: {
    backgroundColor: AppColors.white,
    borderWidth: 0.7,
    borderColor: AppColors.border_light,
    borderRadius: 3,
    paddingHorizontal: 5,
    minHeight: 32,
  },

  contactTitleWrap: {
    paddingHorizontal: "3%",
  },
  container: {
    marginBottom: screenHeight * 0.1,
    // backgroundColor: AppColors.white,
  },
  deviceLocationButton: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 40 * 0.25,
    top: screenWidth * 0.8 - 40 * 1.25,
    zIndex: 5,
  },
  errorMessage: {
    color: AppColors.red,
    fontSize: 12,
  },
  errorWrap: {
    minHeight: 17,
  },
  geoCoderFailMessage: {
    color: AppColors.red,
  },
  geoCoderFailTitle: {
    marginBottom: 20,
    fontSize: 15,
    fontWeight: "bold",
    color: AppColors.text_gray,
  },
  geoCoderFailWrap: {
    padding: "3%",
    alignItems: "center",
    width: "100%",
    height: screenWidth * 0.6,
    borderWidth: 1,
    borderColor: "#b6b6b6",
    borderRadius: 3,
    justifyContent: "center",
  },
  iconWrap: {
    height: 25,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imageInputNotes: {
    paddingVertical: 7,
  },
  imageInputNotesText: {
    fontSize: 14,
    color: AppColors.text_light,
  },
  imageInputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.text_dark,
  },
  imageInputTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageInputWrap: {
    marginBottom: 15,
    backgroundColor: AppColors.white,
    marginHorizontal: "3%",
    borderRadius: 6,
    elevation: 0.5,
    shadowColor: AppColors.border_light,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { height: 1, width: 1 },
    paddingHorizontal: "3%",
    paddingVertical: 10,
  },
  inputWrap: {
    paddingHorizontal: "3%",
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: AppColors.text_gray,
    marginBottom: 5,
  },
  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    flex: 1,
  },
  locationPrimaryPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: AppColors.gray,
    borderRadius: 3,
    height: 32,
  },
  mapCheckboxWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  mapDisplayInputWrap: {
    paddingHorizontal: "3%",
  },
  mapOverlay: {
    height: screenWidth * 0.8,
    width: "100%",
    backgroundColor: "rgba(0,0,0,.2)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  mapToggleTitle: {
    paddingLeft: 5,
  },
  mapViewButtonsWrap: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 5,
    right: 10,
    zIndex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 5,
  },
  mapViewButton: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  mapViewButtonTitle: {
    textTransform: "capitalize",
    fontSize: 12,
    fontWeight: "bold",
  },
  metaField: {
    paddingHorizontal: "3%",
  },
  metaField_Text: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: "#b6b6b6",
    borderRadius: 3,
    paddingHorizontal: 5,
    minHeight: 32,
  },
  metaField_TextArea: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: "#b6b6b6",
    borderRadius: 3,
    minHeight: screenHeight / 6.5,
    paddingHorizontal: 5,
  },
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
  openButtonWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  paraTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 5,
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
  priceTypePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#b6b6b6",
    borderRadius: 3,
    height: 32,
  },
  required: {
    color: "#ff6600",
  },
  separator: {
    width: "94%",
    marginVertical: 15,
    marginHorizontal: "3%",
    backgroundColor: AppColors.border_light,
    height: 0.7,
  },
  slotTimeWrap: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: AppColors.gray,
  },
  submitButton: {
    width: "100%",
    borderRadius: 3,
    marginTop: 10,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 5,
  },
  timeSlotToggleBtnWrap: {
    flexDirection: "row",
    marginTop: 10,
  },
  timeSltEndWrap: {
    flex: 2,
  },
  timeSltStartWrap: {
    flex: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.text_dark,
  },
  titleWrap: {},
  tnCClose: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.primary,
    height: screenHeight / 20,
  },
  tnCCloseText: {
    color: AppColors.white,
    fontSize: 17,
    fontWeight: "bold",
  },
  tncModal: {
    backgroundColor: AppColors.white,
    flex: 1,
    alignItems: "center",
  },
  tnCModalContent: {
    marginHorizontal: "3%",
    marginBottom: screenHeight / 20,
  },
  tnCModalText: {
    color: AppColors.text_dark,
    fontSize: 15,
  },
  tncParaWrap: {
    marginBottom: 20,
  },
  tncText: {
    color: "#ff6600",
  },
  tnCToggle: {
    flexDirection: "row",
    paddingHorizontal: screenWidth * 0.03,
    alignItems: "flex-start",
    marginVertical: 10,
  },
  tnCToggleText: {},
});

export default styles;
