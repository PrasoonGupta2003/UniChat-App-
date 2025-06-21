import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      // Accepts array
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // Adds one message safely
      state.messages.push(action.payload);
    }
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
