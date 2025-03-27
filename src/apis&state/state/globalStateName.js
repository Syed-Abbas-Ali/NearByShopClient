// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const globalStateSlice = createSlice({
  name: "globalStateSlice",
  initialState: {
    isFilterPopupOpen: false,
    isChatbotOpen: false,
    globalFilter: {
      location: "",
      verified: ["verified"],
      shopRatings: [],
      discounts: [],
      shopsRadius: "",
      priceRange: "",
      isLowToHigh: "lowToHigh",
    },
    userCurrentLocationDetails: {
      lattitude: "",
      longitude: "",
      userAddress: "",
    },
  },
  reducers: {
    setIsFilterPopupOpen: (state) => {
      state.isFilterPopupOpen = !state.isFilterPopupOpen;
    },
    setIsChatbotOpen: (state) => {
      state.isChatbotOpen = !state.isChatbotOpen;
    },
    setGlobalFilter: (state, action) => {
      state.globalFilter = { ...state.globalFilter, ...action.payload };
    },
    setUserCurrentLocationDetails: (state, action) => {
      state.userCurrentLocationDetails = {
        ...state.userCurrentLocationDetails,
        ...action.payload,
      };
    },
  },
});

export const {
  setIsFilterPopupOpen,
  setIsChatbotOpen,
  setGlobalFilter,
  setUserCurrentLocationDetails,
} = globalStateSlice.actions;
export default globalStateSlice.reducer;
