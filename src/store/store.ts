import { configureStore } from "@reduxjs/toolkit";
import materialReducer from "./materialSlice";

export const store = configureStore({
  reducer: {
    material: materialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
