// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const shopVerificationData = {
  locationAddress: "",
  shopName: "",
  shopVerificationDetails: {
    aadharNumber: "",
    aadharNumberImage: "",
    gstNumber: "",
    currentBillImage: "",
  },
  shopLocationMapDetails: {
    latitude: "",
    longitude: "",
    shopAddress: "",
  },
};

const shopVerificationSlice = createSlice({
  name: "shopVerificationSlice",
  initialState: shopVerificationData,
  reducers: {
    setShopVerificationData: (state, action) => {
      state = { ...state, ...action.payload };
    },
    setShopVerificationDetails: (state, action) => {
      state.shopVerificationDetails = {
        ...state.shopVerificationDetails,
        ...action.payload,
      };
    },
    setShopLocationMapDetails: (state, action) => {
      state.shopLocationMapDetails = {
        ...state.shopLocationMapDetails,
        ...action.payload,
      };
    },
  },
});

export const {
  setShopVerificationData,
  setShopVerificationDetails,
  setShopLocationMapDetails,
} = shopVerificationSlice.actions;
export default shopVerificationSlice.reducer;
