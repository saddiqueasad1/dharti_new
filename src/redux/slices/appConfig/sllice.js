import { createSlice } from "@reduxjs/toolkit";

const defaultLng = "en";
const listViewConfig = {
  defaultListViewStyle: true,
};

const initialState = {
  ios: true, // Assuming Platform is imported and Platform.OS is used here
  push_token: null,
  appSettings: {
    lng: defaultLng,
    notifications: ["listing_approved", "listing_expired", "chat"],
    listView: listViewConfig?.defaultListViewStyle || true,
  },
  auth_token: null,
  user: null,
  newListingScreen: false,
  search_categories: [],
  search_locations: [],
  listing_locations: null,
  cat_name: "",
  button_hidden: false,
  chat_badge: null,
  is_connected: true,
  rtl_support: false,
  config: {
    currency: {
      id: "USD",
      symbol: "&#36;",
      position: "left",
      separator: {
        decimal: ".",
        thousand: ",",
      },
    },
    payment_currency: {
      id: "USD",
      position: "right",
      separator: {
        decimal: ".",
        thousand: ",",
      },
      symbol: "&#36;",
    },
    promotions: {
      _bump_up: "Bump Up",
      _top: "Top",
      featured: "Featured",
    },
    location_type: "local",
    mark_as_sold: false,
    radius_search: {
      max_distance: 1000,
      units: "miles",
    },
    store_enabled: false,
    store: {
      time_options: {
        showMeridian: true,
      },
    },
    week_days: [
      { id: 1, name: "Monday" },
      { id: 2, name: "Tuesday" },
      { id: 3, name: "Wednesday" },
      { id: 4, name: "Thursday" },
      { id: 5, name: "Friday" },
      { id: 6, name: "Saturday" },
      { id: 0, name: "Sunday" },
    ],
    registered_only: {
      listing_contact: false,
      store_contact: false,
    },
    pn_events: [
      "listing_approved",
      "listing_expired",
      "chat",
      "listing_created",
      "order_created",
    ],
  },
};

const appBaseCofigSlice = createSlice({
  name: "appBaseCofig",
  initialState,
  reducers: {
    updateAppState: (state, action) => {
        // Merge the action payload (new values) into the state
        Object.assign(state, action.payload);
      },
  },
});

export default appBaseCofigSlice;
