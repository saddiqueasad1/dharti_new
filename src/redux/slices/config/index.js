import configSlice from "./slice";
export const configSliceReducer = configSlice.reducer;
export const {
  setAppLoader,
  setTopAds,
  setCategoryList,
  setShowViber,
  setShowWhatsapp,
  setNewChat,
  setFilter,
  setFilterAddress,
  setFilterCategory,
  setFilterSubCategory,
  setFilterCondition,
  setFilterTitle,
  setFilterBrand,
  setFilterModel,
  setFilterYear,
  setFilterType,
  setFilterMinPrice,
  setFilterMaxPrice,
  setFilterSortBy,
  setFilterKm,
  setFilterBodyShape,
  setFilterGearBox,
  setFilterFuelType,
} = configSlice.actions;
export const selectLoader = (state) => state.config.appLoader;
export const selectTopAds = (state) => state.config.topads;
export const selectCategoryList = (state) => state.config?.categoryList;
export const selectShowWhatsapp = (state) => state.config.showWhatsapp;
export const selectShowViber = (state) => state.config?.showViber;
export const selectNewChat = (state) => state.config?.newChat;
export const selectFilter = (state) => state.config?.filter;
export const selectAddress = (state) => state.config?.filter.address;
export const selectCategory = (state) => state.config?.filter.category;
export const selectSubCategory = (state) => state.config?.filter.subCategory;
export const selectCondition = (state) => state.config?.filter.condition;
export const selectTitle = (state) => state.config?.filter.title;
export const selectBrand = (state) => state.config?.filter.brand;
export const selectModel = (state) => state.config?.filter.model;
export const selectYear = (state) => state.config?.filter.year;
export const selectType = (state) => state.config?.filter.type;
export const selectMinPrice = (state) => state.config?.filter.minPrice;
export const selectMaxPrice = (state) => state.config?.filter.maxPrice;
export const selectSortBy = (state) => state.config?.filter.sortBy;
export const selectKm = (state) => state.config?.filter.km;
export const selectBodyShape = (state) => state.config?.filter.bodyShape;
export const selectGearBox = (state) => state.config?.filter.gearBox;
export const selectFuelType = (state) => state.config?.filter.fuelType;
