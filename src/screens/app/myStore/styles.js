import { StyleSheet, Dimensions } from 'react-native';
import AppColors from '../../../utills/AppColors';

const { height: windowHeight } = Dimensions.get("window");


const styles = StyleSheet.create({
  bannerImage: {
    height: 170,
    width: "100%",
    resizeMode: "cover",
  },
  bannerWrap: {
    height: 170,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 8,
  },
  bannerButtonGroupWrap: {
    height: 80,
    justifyContent: "space-between",
    position: "absolute",
    right: 10,
    top: 10,
  },
  bannerButtonGroupWrapRtl: {
    height: 80,
    justifyContent: "space-between",
    position: "absolute",
    left: 10,
    top: 10,
  },
  bannerButton: {
    height: 36,
    width: 36,
    backgroundColor: AppColors.primary,
    borderRadius: 36 / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#e5e5e5",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: AppColors.white,
    flex: 1,
  },
  contentWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  createStoreMessage: {
    marginBottom: 15,
  },
  createStoreButton: {
    width: "60%",
  },
  dayOHPickerCheckBoxWrap: {
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dayOHPickerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayOHPickerText: {
    // textTransform: "capitalize",
  },
  dayOHPickerTextWrap: {
    justifyContent: "center",

    flex: 1,
  },
  dayOHPickerWrap: {
    padding: 10,
    borderWidth: 1,
    borderColor: AppColors.gray,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
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
  logoButton: {
    height: 26,
    width: 26,
    backgroundColor: AppColors.primary,
    borderRadius: 26 / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoButtonGroupWrap: {
    height: 60,
    // justifyContent: "space-between",
    position: "absolute",
    left: 150 - 26 - 10,
    top: 10,
  },
  logoButtonGroupWrapRtl: {
    height: 60,
    // justifyContent: "space-between",
    position: "absolute",
    left: 10,
    top: 10,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: "center",
  },

  radioButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: AppColors.text_dark,
  },
  radioButtonTextwrap: {},
  logoImage: {
    height: 150,
    width: 150,
    resizeMode: "cover",
  },
  logoWrap: {
    height: 150,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 8,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.text_dark,
    marginBottom: 15,
  },
  noStore: {
    flex: 1,
    paddingHorizontal: "3%",
    paddingBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  noStoreText: {
    fontSize: 18,
    marginBottom: 50,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonGroupWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
    justifyContent: "center",
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 12 / 2,

    backgroundColor: AppColors.primary,
  },
  radioOutLine: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    borderWidth: 1,

    borderColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    paddingHorizontal: "3%",
    paddingBottom: 20,
  },
  socialIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    width: 38,
    padding: 4,
  },
  star: { color: AppColors.red },
  storeInput: {
    borderWidth: 1,
    borderColor: AppColors.gray,
    height: 35,
    marginTop: 10,
    marginBottom: 3,
    paddingHorizontal: 10,
  },
  storeInputArea: {
    borderWidth: 1,
    borderColor: AppColors.gray,
    marginTop: 10,
    marginBottom: 3,
    paddingHorizontal: 10,
    minHeight: windowHeight / 10,
    paddingVertical: 8,
  },
  storeInputError: {
    fontSize: 12,
    fontWeight: "bold",
    color: AppColors.red,
  },
  storeInputErrorWrap: {
    height: 20,
  },
  storeInputTitle: {
    fontSize: 14.5,
    fontWeight: "bold",
    color: AppColors.text_dark,
  },
  storeSectionComponent: {
    marginBottom: 10,
  },
  storeSectionBottomText: {
    fontWeight: "bold",
    color: AppColors.text_gray,
  },
  storeSectionBottomWrap: {
    // flexDirection: "row",
    marginTop: 15,
  },
  storeSectionTitleTextWrap: {
    flex: 1,
    paddingHorizontal: 10,
  },
  storeSectionTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.text_dark,
  },
  storeSectionTitleIcon: {
    height: 25,
    width: 25,
  },
  storeSectionTitleIconWrap: {
    height: 25,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  storeSectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  storeSocialInputError: {
    fontSize: 10,
    fontWeight: "bold",
    color: AppColors.red,
  },
  storeSocialInputErrorWrap: {
    height: 15,
    justifyContent: "center",
  },
  storeSocialInput: {
    backgroundColor: AppColors.white,
    flex: 1,
    paddingHorizontal: 5,
  },
  storeSocialInputWrap: {
    flexDirection: "row",
    backgroundColor: "yellow",
    borderWidth: 1,
  },
  updateButtonWrap: {
    marginVertical: 20,
  },
});
export default styles;
