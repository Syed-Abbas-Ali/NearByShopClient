import { createSlice } from "@reduxjs/toolkit";

// --- Helper function to get user data from localStorage (for web browsers) ---
const getUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem("user");
    return serializedUser ? JSON.parse(serializedUser) : null;
  } catch (e) {
    console.error("Failed to get user from localStorage", e);
    return null;
  }
};

// --- Helper function to save user data ---
// This is the most important new function.
const saveUserToStorage = (userData) => {
  // We assume your userData object looks something like: { name: "...", email: "...", token: "..." }
  const token = userData ? userData.token : null;

  if (token) {
    // 1. Save the token to the Android App if the bridge exists
    if (window.AndroidBridge && typeof window.AndroidBridge.saveToken === 'function') {
      window.AndroidBridge.saveToken(token);
    }
  }
  
  // 2. Always save the full user object to localStorage for the website to use immediately.
  try {
    const serializedUser = JSON.stringify(userData);
    localStorage.setItem("user", serializedUser);
  } catch (e) {
    console.error("Failed to save user to localStorage", e);
  }
};

// --- Helper function to clear user data on logout ---
const clearUserFromStorage = () => {
    // 1. Tell the Android App to clear its saved token
    if (window.AndroidBridge && typeof window.AndroidBridge.clearToken === 'function') {
      window.AndroidBridge.clearToken();
    }
    
    // 2. Remove user from the website's localStorage
    localStorage.removeItem("user");
}


// The initial state is now simpler: it only checks the browser's localStorage.
// The Android app will handle its own state when it starts up.
const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: getUserFromStorage() ? true : false,
};

const authSlice = createSlice({
  name: "authState",
  initialState,
  reducers: {
    // IMPORTANT: Create a new reducer to handle successful login
    loginSuccess: (state, action) => {
      const userData = action.payload; // The user object from your API response
      state.user = userData;
      state.isAuthenticated = true;
      // Call our helper function to save the data correctly
      saveUserToStorage(userData);
    },
    setLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Call our helper function to clear data from all places
      clearUserFromStorage();
    },
  },
});

export const { loginSuccess, setLogout } = authSlice.actions;
export default authSlice.reducer;