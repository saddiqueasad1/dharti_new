import { configureStore } from '@reduxjs/toolkit';
import { configSliceReducer } from './slices/config';
import { userSliceReducer } from './slices/user';
import {languageSliceReducer} from './slices/language'
import { appBaseCofigSliceReducer } from './slices/appConfig';

export const store = configureStore({
    reducer: {
        user:userSliceReducer,
        config: configSliceReducer,
        language: languageSliceReducer,
        appBaseCofig : appBaseCofigSliceReducer
    },
});