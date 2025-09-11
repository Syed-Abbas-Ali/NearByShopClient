import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeChat: null,
  chatList: [],
  messages: [],
  roomChat: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setRoomChat: (state, action) => {
      state.roomChat = action.payload;
    },
  },
});

export const {
  setActiveChat,
  setChatList,
  setMessages,
  addMessage,
  setRoomChat,
} = chatSlice.actions;

export default chatSlice.reducer;