import userSlice from "./slice";
export const userSliceReducer = userSlice.reducer;
export const {
  setIsLoggedIn,
  setUserMeta,
  setToken,
  setUserAds,
  setAdsFav,
  setChatRooms,
  setChatRedux,
} = userSlice.actions;
export const selectToken = (state) => state.user.token;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectUserMeta = (state) => state.user.userMeta;
export const selectUserAds = (state) => state.user.myAds;
export const selectFavAds = (state) => state.user.myFav;
export const selectChatRooms = (state) => state.user.chatRooms;
export const selectChatRedux = (state) => state.user.chat;
