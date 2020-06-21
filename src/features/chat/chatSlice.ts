import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { User } from '../../models/User';
import axios from 'axios';

export interface Message {
  id: number;
  sendingUser: User;
  content: string;
  is_system: boolean;
}

interface FriendRequestUser {
  id: number;
  username: string;
  avatar: string;
}

interface FriendRequest {
  id: number;
  User1: FriendRequestUser;
}

export interface Requests {
  didInit: boolean;
  count: number;
  friendRequests: FriendRequest[];
}

interface UserList {
  id: number;
  username: string;
}

interface FriendRequestResponse {
  addingId: number;
  friend?: FriendRequestUser;
}

export interface Friend {
  id: number;
  username: string;
  avatar: string;
}

export interface FriendConversation {
  conversationId: number;
  friend: Friend;
  lastMessage: { message: string, createdAtTime: string, createdAt: string };
  active: boolean;
}

export interface ConversationMessage {
  id: number;
  conversationId: number;
  message: string;
  createdAtTime: string;
  createdAt: string;
  Sender: User;
  Receiver: User;
}

interface ChatState {
  value: number;
  messages: { items: ConversationMessage[], fetchDone: boolean };
  requests: Requests;
  possibleFriends: UserList[];
  friendAdded: boolean;
  friends: FriendConversation[];
  currentConversationId: number;
  currentReceiverId: number;
  friendsFetched: boolean;
  initMessages: boolean;
  hasFriends: boolean;
}

const initialState: ChatState = {
  value: 0,
  requests: {count: 0, friendRequests: [], didInit: false},
  messages: { items: [], fetchDone: false },
  possibleFriends: [],
  friendAdded: false,
  friends: [],
  currentConversationId: 0,
  currentReceiverId: 0,
  friendsFetched: false,
  initMessages: false,
  hasFriends: false
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessageReduce(state, action: PayloadAction<ConversationMessage>) {
      state.messages = { ...state.messages, items: [ ...state.messages.items, action.payload ] };
      state.friends = state.friends.map(
        item => item.conversationId === action.payload.conversationId ? 
                item = { 
                  ...item, 
                  lastMessage: { 
                    message: action.payload.message, 
                    createdAtTime: action.payload.createdAtTime, 
                    createdAt: action.payload.createdAt 
                  } 
                } : item
      );
    },
    getFriendRequestsReduce(state, action: PayloadAction<Requests>) {
      state.requests = {
        ...action.payload,
        didInit: true
      };
    },
    getPossibleFriendsReduce(state, action: PayloadAction<UserList[]>) {
      state.possibleFriends = action.payload;
    },
    addFriendReduce(state) {
      state.friendAdded = !state.friendAdded;
    },
    acceptFriendReduce(state, action: PayloadAction<FriendRequestResponse>) {
      state.requests.count = state.requests.count - 1;
      state.requests.friendRequests = state.requests.friendRequests.filter(item => item.User1.id !== action.payload.addingId);
      // TO FIX!
      //state.friends = [ ...state.friends, action.payload! ];
    },
    denyFriendReduce(state, action: PayloadAction<FriendRequestResponse>) {
      state.requests.count = state.requests.count - 1;
      state.requests.friendRequests = state.requests.friendRequests.filter(item => item.User1.id !== action.payload.addingId);
    },
    getFriendsReduce(state, action: PayloadAction<FriendConversation[]>) {
      state.friends = action.payload;
      state.friendsFetched = true;
      state.hasFriends = state.friends.length > 0;
    },
    updateMessagesReduce(state, action: PayloadAction<{messages: ConversationMessage[], currentConversationId: number, receiverId: number, initMessages: boolean}>) {
      state.messages = { items: action.payload.messages, fetchDone: true };
      state.currentConversationId = action.payload.currentConversationId;
      state.currentReceiverId = action.payload.receiverId;
      if(!state.initMessages) {
        state.initMessages = true;
      }

      state.friends = state.friends.map(item => {
        if (item.conversationId !== action.payload.currentConversationId) {
          return {
            ...item,
            active: false
          };
        }

        return {
          ...item,
          active: true
        };
      });
    },
    signOutCleanupChat(state) {
      state.friends = [];
      state.friendAdded = false;
      state.requests = {
        count: 0,
        friendRequests: [],
        didInit: false
      };
      state.possibleFriends = [];
      state.messages = { items: [], fetchDone: false };
      
      state.friendsFetched = false;
      state.initMessages = false;
    },
  },
});

export const { addMessageReduce, signOutCleanupChat } = chatSlice.actions;

const { getFriendRequestsReduce, getPossibleFriendsReduce, addFriendReduce, acceptFriendReduce, denyFriendReduce, getFriendsReduce, updateMessagesReduce } = chatSlice.actions;

export const getPossibleFriends = (id: number): AppThunk => async dispatch => {
  try {
    const response = await axios.get('http://localhost:5000/api/friends/possible-friends', {
      params: {
        currentUserId: id
      }
    });

    dispatch(getPossibleFriendsReduce(response.data));
  } catch (err) {
    console.log('Get possible friends error', err);
  }
};

export const getFriendRequests = (id: number): AppThunk => async dispatch => {
  try {
    const response = await axios.get('http://localhost:5000/api/friends/friend-requests', {
      params: {
        currentUserId: id
      }
    });
    
    dispatch(getFriendRequestsReduce(response.data));
  } catch (err) {
    console.log('Get friend requests error', err);
  }
};

export const addFriend = (addingId: number, friendId: number): AppThunk => async dispatch => {
  try {
    await axios.post('http://localhost:5000/api/friends/add-friend', { addFriendData: { addingId, friendId } });

    dispatch(addFriendReduce());
  } catch (err) {
    console.log('Get friend requests error', err);
  }
};

export const acceptFriend = (addingId: number, friendId: number, friend: FriendRequestUser): AppThunk => async dispatch => {
  try {
    await axios.post('http://localhost:5000/api/friends/accept-friend', { addFriendData: { addingId, friendId } });

    dispatch(acceptFriendReduce({ addingId, friend }));
  } catch (err) {
    console.log('Accept friend requests error', err);
  }
};

export const denyFriend = (addingId: number, friendId: number): AppThunk => async dispatch => {
  try {
    await axios.post('http://localhost:5000/api/friends/deny-friend', { addFriendData: { addingId, friendId } });

  dispatch(denyFriendReduce({ addingId }));
  } catch (err) {
    console.log('Deny friend requests error', err);
  }
};

export const getFriends = (currentUserId: number): AppThunk => async dispatch => {
  try {
    const response = await axios.get('http://localhost:5000/api/friends/get-friends', {
      params: {
        currentUserId
      }
    });

    dispatch(getFriendsReduce(response.data));
  } catch (err) {
    console.log('Get friends requests error', err);
  }
};

export const selectFriend = (authUserId: number, receiverId: number, initMessages: boolean): AppThunk => async dispatch => {
  try {
    const response = await axios.get<{
      items: ConversationMessage[],
      conversationId: number
    }>('http://localhost:5000/api/friends/select-friend', {
      params: {
        authUserId,
        receiverId
      }
    });

    dispatch(updateMessagesReduce({messages: response.data.items, currentConversationId: response.data.conversationId, receiverId, initMessages}));
  } catch (err) {
    console.log('Select friend error', err);
  }
};

export const selectMessages = (state: RootState) => state.chat.messages;
export const selectFriendRequests = (state: RootState) => state.chat.requests;
export const selectPossibleFriends = (state: RootState) => state.chat.possibleFriends;
export const selectFriendAdded = (state: RootState) => state.chat.friendAdded;
export const selectFriends = (state: RootState) => state.chat.friends;
export const selectConversationId = (state: RootState) => state.chat.currentConversationId;
export const selectReceiverId = (state: RootState) => state.chat.currentReceiverId;
export const selectFriendsFetched = (state: RootState) => state.chat.friendsFetched;
export const selectHasFriends = (state: RootState) => state.chat.hasFriends;
export const selectInitMessages = (state: RootState) => state.chat.initMessages;

export default chatSlice.reducer;
