import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Holiday {
  id: string;
  name: string;
  description: string;
  countryId: string;
  country: string;
  date: Date | string;
  year: number;
  month: number;
  day: number;
  createdAt: Date | string;
}

interface HolidayState {
  holidays: Holiday[];
}

const initialState: HolidayState = {
  holidays: [],
};

export const holidaySlice = createSlice({
  name: "holiday",
  initialState,
  reducers: {
    addHoliday: (state, action: PayloadAction<Holiday>) => {
      state.holidays.push(action.payload);
    },
    deleteHoliday: (state, action: PayloadAction<string>) => {
      state.holidays = state.holidays.filter(
        (holiday) => holiday.id !== action.payload
      );
    },
    addHolidays: (state, action: PayloadAction<Holiday[]>) => {
      state.holidays = [...state.holidays, ...action.payload];
    },
    updateHoliday: (state, action: PayloadAction<Holiday>) => {
      const index = state.holidays.findIndex(
        (holiday) => holiday.id === action.payload.id
      );
      if (index !== -1) {
        state.holidays[index] = action.payload;
      }
    },
    replaceHolidays: (state, action: PayloadAction<Holiday[]>) => {
      state.holidays = action.payload; // ⚡ Completely replace old data
    },
  },
});

export const {
  addHoliday,
  deleteHoliday,
  addHolidays,
  updateHoliday,
  replaceHolidays,
} = holidaySlice.actions;

export default holidaySlice.reducer;
