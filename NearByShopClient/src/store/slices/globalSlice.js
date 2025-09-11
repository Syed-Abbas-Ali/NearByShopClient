import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isFilterPopupOpen: false,
  isChatbotOpen: false,
  userLocation: null,
  searchQuery: '',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFilterPopupOpen: (state, action) => {
      state.isFilterPopupOpen = action.payload;
    },
    setChatbotOpen: (state, action) => {
      state.isChatbotOpen = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setLoading,
  setFilterPopupOpen,
  setChatbotOpen,
  setUserLocation,
  setSearchQuery,
} = globalSlice.actions;

export default globalSlice.reducer;