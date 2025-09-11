import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import globalReducer from './slices/globalSlice';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import { apiSlice } from '../api/apiSlice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,
    chat: chatReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch);