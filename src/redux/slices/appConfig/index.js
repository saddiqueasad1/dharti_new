import appBaseCofigSlice from "./sllice";

export const { updateAppState } = appBaseCofigSlice.actions;
export const appBaseCofigSliceReducer = appBaseCofigSlice.reducer; 
export const selectAppState = (state) => state.appBaseCofig;
