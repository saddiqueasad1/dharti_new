import { Platform, StyleSheet } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";


const styles = StyleSheet.create({
  adCategory: {
    marginBottom: 5,
  },
  adType: {},
  authButton: {
    borderRadius: 3,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  authButtonWrap: {
    marginVertical: 20,
    width: "100%",
  },
  button: {
    width: "45%",
  },
  buttonWrap: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: "3%",
    marginTop: "5%",
  },
  categoryChangeWrap: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: "3%",
    marginHorizontal: "3%",
    elevation: 0.5,
    borderRadius: 6,
    shadowColor: AppColors.border_light,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    backgroundColor: AppColors.white,
    marginVertical: 5,
  },
  categoryPickerFieldText: {
    textTransform: "capitalize",
  },
  categoryPickerFieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: AppColors.gray,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: "3%",
    marginVertical: 10,
  },
  categoryPickerOptions: {
    backgroundColor: AppColors.bg_dark,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 6,
    marginHorizontal: 4,
    borderRadius: 3,
  },
  categoryPickerOptionsText: {
    fontSize: 13.5,
    color: AppColors.text_gray,
  },
  categoryPickerWrap: {},
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: AppColors.text_dark,
  },
  categoryRoute: {
    fontSize: 15,
    color: AppColors.text_gray,
  },
  categoryTitleWrap: {
    paddingVertical: 15,
  },
  categoryWrap: {
    paddingHorizontal: "3%",
    backgroundColor: AppColors.white,
    margin: "3%",
    elevation: 0.5,
    borderRadius: 6,
    shadowColor: AppColors.border_light,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  changeCategory: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginTop: 10,
    borderRadius: 3,
    backgroundColor: AppColors.primary,
  },
  changecategoryText: {
    color: AppColors.white,
    paddingRight: 5,
  },
  changeCategoryWrap: {
    marginTop: 5,
    marginBottom: 15,
  },
  checkWrap: {
    alignItems: "center",
    marginVertical: "10%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  displayNone: {
    display: "none",
  },
  flashMessage: {
    position: "absolute",
    backgroundColor: "green",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    bottom: 0,
    zIndex: 2,
  },
  formSeparator: {
    width: "100%",
  },
  freeAdText: {
    backgroundColor: AppColors.light_green,
    width: "80%",
    textAlign: "center",
    color: AppColors.dark_green,
    borderRadius: 3,
    paddingVertical: 8,
    fontSize: 16,
  },
  freeAdWrap: {
    paddingHorizontal: "3%",
    alignItems: "center",
    marginVertical: 15,
  },
  locationSelector: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 3,
    backgroundColor: AppColors.rating_star,
    // backgroundColor: "#FBAC00",
    flexDirection: "row",
  },
  locationSelectorText: {
    color: AppColors.white,
    fontWeight: "bold",
    fontSize: 13,
  },
  internalSeparator: {
    marginVertical: 10,
    width: "100%",
  },
  locationWrap: {
    marginVertical: 10,
    marginHorizontal: "3%",
    padding: "3%",
    backgroundColor: AppColors.white,
    elevation: 0.5,
    shadowColor: AppColors.border_light,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    borderRadius: 6,
  },
  mainWrap: {},
  mandatory: {
    color: AppColors.red,
    fontSize: 16,
  },
  remainingAdsText: {
    fontSize: 16,
    marginVertical: "2%",
    paddingHorizontal: "3%",
    textAlign: "center",
  },
  routeArrow: {
    color: AppColors.text_gray,
  },
  separator: {
    width: "100%",
    backgroundColor: AppColors.border_light,
    marginTop: 15,
  },

  typePickerFieldWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  typePickerOptions: {
    marginVertical: 8,
  },
  types: {
    color: AppColors.text_gray,
    fontSize: 15,
  },
  typePickerWrap: {
    paddingVertical: 10,
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: AppColors.text_dark,
  },
  typeTitleWrap: {
    paddingTop: 10,
    paddingBottom: 15,
  },
  typeWrap: {
    paddingHorizontal: "3%",
    marginHorizontal: "3%",
    backgroundColor: AppColors.white,
    borderRadius: 6,
    elevation: 0.5,
    shadowColor: AppColors.border_light,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    flex: 1,
  },
  notEligible: {
    alignItems: "center",
    marginVertical: "10%",
  },
  noUserMessage: {
    fontSize: 16,
  },
  noUserTitle: {
    fontSize: 20,
  },
  noUserTitleWrap: {
    alignItems: "center",
  },
  noUserViewWrap: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    padding: "3%",
    borderRadius: 3,
    marginVertical: 5,
  },
  selectedCategoryText: {
    fontSize: 13,
    fontWeight: "bold",
  },
});
export default styles;
