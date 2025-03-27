import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isChatActive: false,
  roomId: null,
};

const chatSlice = createSlice({
  name: "chatState",
  initialState,
  reducers: {
    toggleChatActive: (state) => {
      state.isChatActive = !state.isChatActive;
      state.roomId = null;
    },
    setRoomChat: (state,action) => {
      state.roomId = action.payload;
    },
    setRoomChatAndActive: (state,action) => {
      state.roomId = action.payload;
      state.isChatActive = true;
    },
  },
});

export const { toggleChatActive, setRoomChat, setRoomChatAndActive } =
  chatSlice.actions;
export default chatSlice.reducer;
