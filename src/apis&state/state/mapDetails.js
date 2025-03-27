import { createSlice } from "@reduxjs/toolkit";

const mapDetailsStateSlice = createSlice({
  name: "mapDetailsStateSlice",
  initialState: {
    userMapDetails: {
      locationAddress: "",
      latitude: "",
      longitude: "",
    },
    isUserMapOpen: false,
    isUserMapLocationOpen: false,
  },
  reducers: {
    setUserMapDetails: (state, action) => {
      state.userMapDetails = { ...state.userMapDetails, ...action.payload };
    },
    setUserMapOpen: (state) => {
      state.isUserMapOpen = !state.isUserMapOpen;
    },
    setUserMapLocationOpen: (state) => {
      state.isUserMapLocationOpen = !state.isUserMapLocationOpen;
    },
  },
});

export const { setUserMapDetails, setUserMapOpen, setUserMapLocationOpen } =
  mapDetailsStateSlice.actions;
export default mapDetailsStateSlice.reducer;
