import { LongWeekend } from "@/app/api/longweekends/route";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LongWeekendState {
  longWeekends: LongWeekend[];
}

const initialState: LongWeekendState = {
  longWeekends: [],
};

export const longWeekendSlice = createSlice({
  name: "longWeekend",
  initialState,
  reducers: {
    setLongWeekends: (state, action: PayloadAction<LongWeekend[]>) => {
      state.longWeekends = action.payload;
    },
    updateLongWeekend: (state, action: PayloadAction<LongWeekend>) => {
      const index = state.longWeekends.findIndex(
        (lw) => lw.id === action.payload.id
      );
      if (index !== -1) {
        state.longWeekends[index] = action.payload;
      }
    },
    replaceLongWeekends: (state, action: PayloadAction<LongWeekend[]>) => {
      state.longWeekends = action.payload; // ⚡ Completely replace old data
    },
  },
});

export const { setLongWeekends, updateLongWeekend, replaceLongWeekends } =
  longWeekendSlice.actions;
export default longWeekendSlice.reducer;
