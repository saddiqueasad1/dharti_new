import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appLoader: false,
  topads: [],
  categoryList: [],
  filter: {
    address: "",
    category: "",
    subCategory: "",
    condition: "",
    title: "",
    brand: "",
    model: "",
    year: "",
    type: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    km: "",
    bodyShape: "",
    gearBox: "",
    fuelType: "",
  },
  showWhatsapp: false,
  showViber: false,
  newChat: false,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setAppLoader: (state, action) => {
      state.appLoader = action.payload;
    },
    setTopAds: (state, action) => {
      state.topads = action.payload;
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
    setShowWhatsapp: (state, action) => {
      state.showWhatsapp = action.payload;
    },
    setShowViber: (state, action) => {
      state.showViber = action.payload;
    },
    setNewChat: (state, action) => {
      state.newChat = action.payload;
    },
    /////////
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setFilterAddress: (state, action) => {
      state.filter.address = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filter.category = action.payload;
    },
    setFilterSubCategory: (state, action) => {
      state.filter.subCategory = action.payload;
    },
    setFilterCondition: (state, action) => {
      state.filter.condition = action.payload;
    },
    setFilterTitle: (state, action) => {
      state.filter.title = action.payload;
    },
    setFilterBrand: (state, action) => {
      state.filter.brand = action.payload;
    },
    setFilterModel: (state, action) => {
      state.filter.model = action.payload;
    },
    setFilterYear: (state, action) => {
      state.filter.year = action.payload;
    },
    setFilterType: (state, action) => {
      state.filter.type = action.payload;
    },
    setFilterMinPrice: (state, action) => {
      state.filter.minPrice = action.payload;
    },
    setFilterMaxPrice: (state, action) => {
      state.filter.maxPrice = action.payload;
    },
    setFilterSortBy: (state, action) => {
      state.filter.sortBy = action.payload;
    },
    setFilterKm: (state, action) => {
      state.filter.km = action.payload;
    },
    setFilterBodyShape: (state, action) => {
      state.filter.bodyShape = action.payload;
    },
    setFilterGearBox: (state, action) => {
      state.filter.gearBox = action.payload;
    },
    setFilterFuelType: (state, action) => {
      state.filter.fuelType = action.payload;
    },
  },
});

export default configSlice;
