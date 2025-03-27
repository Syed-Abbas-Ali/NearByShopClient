// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import globalStateReducer from "../apis&state/state/globalStateName";
import shopVerificationReducer from "../apis&state/state/shopVerification";
import authSliceReducer from "../apis&state/state/authSlice";
import chatSliceReducer from "../apis&state/state/chatState";
import { authenticationApiSlice } from "../apis&state/apis/authenticationApiSlice";
import { shopApiSlice } from "../apis&state/apis/shopApiSlice";
import { masterDataApiSlice } from "../apis&state/apis/masterDataApis";
import mapDetailsStateReducer from "../apis&state/state/mapDetails";
import { discountsApiSlice } from "../apis&state/apis/discounts";
import { chatApiSlice } from "../apis&state/apis/chat";
import { globalApiSlice } from "../apis&state/apis/global";

const store = configureStore({
  reducer: {
    globalState: globalStateReducer,
    shopVerificationState: shopVerificationReducer,
    mapDetailsState: mapDetailsStateReducer,
    authState: authSliceReducer,
    chatState: chatSliceReducer,
    [authenticationApiSlice.reducerPath]: authenticationApiSlice.reducer,
    [shopApiSlice.reducerPath]: shopApiSlice.reducer,
    [discountsApiSlice.reducerPath]: discountsApiSlice.reducer,
    [masterDataApiSlice.reducerPath]: masterDataApiSlice.reducer,
    [chatApiSlice.reducerPath]: chatApiSlice.reducer,
    [globalApiSlice.reducerPath]: globalApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authenticationApiSlice.middleware)
      .concat(shopApiSlice.middleware)
      .concat(discountsApiSlice.middleware)
      .concat(chatApiSlice.middleware)
      .concat(masterDataApiSlice.middleware)
      .concat(globalApiSlice.middleware),
});

export default store;
