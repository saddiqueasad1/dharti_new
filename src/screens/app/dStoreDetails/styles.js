import { StyleSheet, Dimensions } from "react-native";
import { height, width } from "../../../utills/Dimension";
import AppColors from "../../../utills/AppColors";
const { width: windowWidth } = Dimensions.get("window");


const styles = StyleSheet.create({
  banner: {
    height: windowWidth * 0.94 * 0.35,
    width: windowWidth * 0.94,
    resizeMode: "cover",
  },
  bannerWrap: {
    width: windowWidth * 0.94,
    height: windowWidth * 0.94 * 0.35,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: "hidden",
  },
  callText: {
    fontSize: 20,
    color: AppColors.text_dark,
    textAlign: "center",
  },
  closedText: {
    color: AppColors.red,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    flex: 1,
  },
  dayContentWrap: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 14,

    textTransform: "capitalize",
  },
  dayWrap: {
    paddingVertical: 5,

    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  expiredText: {
    fontSize: 15,
    fontWeight: "bold",
    color: AppColors.gray,
    textAlign: "center",
    marginVertical: 15,
  },
  expiredWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: "3%",
  },
  goBackButton: {
    width: "40%",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "100%",
    backgroundColor: AppColors.primary,
  },
  headerBackButton: {
    position: "absolute",
    left: "3%",
    elevation: 2,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 20,
    alignItems: "center",
  },
  listingCardDetailContent: {
    flex: 1,
  },
  listingCardDetailLeft: {
    flex: 1,
  },
  listingCardDetailRight: {},
  listingCardDetailWrap: {
    flex: 1,

    width: windowWidth * 0.74,
  },
  listingCardImage: {
    height: 80,
    width: 80,
    resizeMode: "cover",
  },
  listingCardImageWrap: {
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 5,
  },
  listingCardPrice: {
    fontWeight: "bold",
    color: AppColors.primary,
  },
  listingCardText: {
    fontSize: 12,
    color: AppColors.text_gray,
  },
  listingCardTitle: {
    fontWeight: "bold",
    fontSize: 13,
    color: AppColors.text_dark,
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
    flex: 1,
  },
  logo: {
    height: windowWidth * 0.94 * 0.21,
    width: windowWidth * 0.94 * 0.21,
    resizeMode: "contain",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  phone: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  phoneText: {
    color: AppColors.primary,
    fontWeight: "bold",
    fontSize: 18,
  },
  rating: {
    fontSize: 15,
    fontWeight: "bold",
    color: AppColors.white,

    lineHeight: 18,
  },
  screenTitle: {
    fontSize: 20,
    color: AppColors.white,
    fontWeight: "bold",
    elevation: 2,
  },
  storeBottom: {
    width: "100%",
    flex: 1,
  },
  storeContactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    width: "45.5%",
    height: 32,
    marginHorizontal: "1.5%",
  },
  storeContactButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  storeContactWrap: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  storeDetailMidrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  storeDetailMidrowIconWrap: {
    height: 16,
    width: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  storeDetailMidrowText: {
    fontSize: 14,
    color: AppColors.text_dark,
  },
  storeDetailTopRight: {
    flex: 1,

    width: windowWidth * 0.724,
  },
  storeDetatilTopWrap: {
    alignItems: "center",
  },
  storeDetailWrap: {
    backgroundColor: AppColors.white,
    width: windowWidth * 0.94,
    borderRadius: 10,
    elevation: 2,
    shadowColor: AppColors.gray,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    zIndex: 1,
    marginTop: windowWidth * 0.03,
    alignItems: "center",
  },
  storeListingCardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    // paddingHorizontal: "3%",
  },
  storeLogo: {
    height: windowWidth * 0.94 * 0.21,
    width: windowWidth * 0.94 * 0.21,
    overflow: "hidden",
    borderRadius: windowWidth * 0.94 * 0.11,
  },
  storeRatingWrap: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: AppColors.orange,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  storeSlogan: {
    fontSize: 15,
    color: AppColors.text_gray,
    marginBottom: 5,
    lineHeight: 18,
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.text_dark,
    lineHeight: 25,
  },
  storeTitleRow: {
    alignItems: "center",
  },
  storeTop: {
    width: "100%",
    alignItems: "center",
  },
  viewMoreDetailsButton: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 5,
  },
  viewMoreDetailsButtonText: {
    color: AppColors.primary,
    fontSize: 16,
    marginRight: 5,
    lineHeight: 20,
  },
  text: {
    textAlign: 'justify',
    color: AppColors.text_gray,
    lineHeight: 25,
    // Add other styles as per your theme
  },
  showMoreButton: {
    color: AppColors.link_color,
    marginTop: 5,
    // Add other styles as per your theme
  },
});

export default styles;

