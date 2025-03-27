import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: sessionStorage.getItem("user") ? true : false,
};

const authSlice = createSlice({
  name: "authState",
  initialState,
  reducers: {
    setLogin: (state) => {
      state.isAuthenticated = true;
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
