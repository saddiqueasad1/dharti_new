import languageSlice from "./slice";
export const languageSliceReducer = languageSlice.reducer;

export const { setLanguage } = languageSlice.actions;

export const selectCurrentLanguage = (state) => state.language.selectedLanguage;
