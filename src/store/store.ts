// src/store/store.ts
import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "../api/authApi";
import { profilesApi } from "../api/profileApi";
import { ordersApi } from "../api/ordersApi";
import { loadTypesApi } from "../api/loadTypesApi";
import { loadPackagesApi } from "../api/loadPackagesApi";
import { trucksApi } from "../api/trucksApi";
import { truckLoadTypesApi } from "../api/truckLoadTypesApi";
import { truckOptionsApi } from "../api/truckOptionsApi";
import { truckPricingTypesApi } from "../api/truckPricingTypesApi";
import { locationApi } from "../api/locationApi";
import languageReducer from "@/store/languageSlice";
import profileReducer, { clearProfile } from "./profileSlice";

export interface AuthState {
  token: string | null;
}

// Слайс только для хранения токена
const authTokenSlice = createSlice({
  name: "authToken",
  initialState: { token: null } as AuthState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = authTokenSlice.actions;

// 🔥 Полный логаут с очисткой всех данных
export const logout = () => (dispatch: any) => {
  // 1. Очищаем токен
  dispatch(clearToken());
  dispatch(clearProfile());

  // 2. Очищаем весь кеш RTK Query
  dispatch(authApi.util.resetApiState());
  dispatch(profilesApi.util.resetApiState());
  dispatch(ordersApi.util.resetApiState());
  dispatch(loadTypesApi.util.resetApiState());
  dispatch(loadPackagesApi.util.resetApiState());
  dispatch(trucksApi.util.resetApiState());
  dispatch(truckLoadTypesApi.util.resetApiState());
  dispatch(truckOptionsApi.util.resetApiState());
  dispatch(truckPricingTypesApi.util.resetApiState());
  dispatch(locationApi.util.resetApiState());
};

const persistConfig = {
  key: "authToken",
  storage,
  whitelist: ["token"],
  blacklist: ["profile"], // Don't persist profile
};

const profilePersistConfig = {
  key: "profile",
  storage,
  whitelist: [], // Don't persist any profile data
  blacklist: ["profile", "hasProfile", "profileFetched"], // Don't persist anything
};

const persistedAuthReducer = persistReducer(
  persistConfig,
  authTokenSlice.reducer
);
const persistedProfileReducer = persistReducer(
  profilePersistConfig,
  profileReducer
);

export const store = configureStore({
  reducer: {
    authToken: persistedAuthReducer,
    language: languageReducer,
    profile: persistedProfileReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profilesApi.reducerPath]: profilesApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [loadTypesApi.reducerPath]: loadTypesApi.reducer,
    [loadPackagesApi.reducerPath]: loadPackagesApi.reducer,
    [trucksApi.reducerPath]: trucksApi.reducer,
    [truckLoadTypesApi.reducerPath]: truckLoadTypesApi.reducer,
    [truckOptionsApi.reducerPath]: truckOptionsApi.reducer,
    [truckPricingTypesApi.reducerPath]: truckPricingTypesApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      profilesApi.middleware,
      ordersApi.middleware,
      loadTypesApi.middleware,
      loadPackagesApi.middleware,
      trucksApi.middleware,
      truckLoadTypesApi.middleware,
      truckOptionsApi.middleware,
      truckPricingTypesApi.middleware,
      locationApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
