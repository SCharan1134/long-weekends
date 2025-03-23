import { configureStore } from "@reduxjs/toolkit";
import longWeekendReducer from "./slices/longWeekendSlice";
import holidayReducer from "./slices/holidaySlice";

const store = configureStore({
  reducer: {
    longWeekend: longWeekendReducer,
    holiday: holidayReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
