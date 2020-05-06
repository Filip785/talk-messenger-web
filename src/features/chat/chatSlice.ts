import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { User } from '../../models/User';

export interface Message {
  id: number;
  sendingUser: User;
  content: string;
}

interface ChatState {
  value: number;
  messages: Message[];
}

const initialState: ChatState = {
  value: 0,
  messages: [
    {
      id: 3,
      sendingUser: {
        id: 'f121e64a-4af6-4275-8b47-ca78cb1aca5d',
        name: 'Filip Djuricic',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      content: 'Hi Han Solo'
    },
    {
      id: 25,
      sendingUser: {
        id: 'f121e64a-4af6-4275-8b47-ca78cb1aca5d',
        name: 'Filip Djuricic',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      content: 'Let me know if you would like to know more about our business.'
    },
    {
      id: 4,
      sendingUser: {
        id: '5eae8fa4-8f18-44f9-b6c5-baeb41ca0aa0',
        name: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      content: 'Hi Filip, please give me short description about your business.'
    },{
      id: 5,
      sendingUser: {
        id: 'f121e64a-4af6-4275-8b47-ca78cb1aca5d',
        name: 'Filip Djuricic',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    }
  ]
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;

export default chatSlice.reducer;
