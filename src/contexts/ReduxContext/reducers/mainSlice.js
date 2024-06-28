import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requestType: ""
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setRequestType: (state, action) => {
      state.requestType = action.payload
    },
  },
});

export const { setRequestType } =
  mainSlice.actions;

export default mainSlice.reducer;
