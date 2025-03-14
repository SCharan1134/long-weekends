import { configureStore } from "@reduxjs/toolkit";
import longWeekendReducer from "./slices/longWeekendSlice";

const store = configureStore({
  reducer: {
    longWeekend: longWeekendReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
