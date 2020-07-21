import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { User } from '../../models/User';
import axios from 'axios';
import { createInitialConversationMessage } from '../../shared/message-helper';
import { handleAPIError } from '../../shared/error-helper';
import { animateScroll } from 'react-scroll';

export interface Message {
  id: number;
  sendingUser: User;
  content: string;
  isSystem: boolean;
}

interface FriendRequest {
  id: number;
  User1: Friend;
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
  friendConversation?: FriendConversation;
  systemMessage?: ConversationMessage;
}

export interface Friend {
  id: number;
  username: string;
  avatar: string;
}

export interface FriendConversation {
  conversationId: number;
  friend: Friend;
  lastMessage?: { message: string, createdAtTime: string, createdAt: string };
  active: boolean;
}

export interface ConversationMessage {
  id: number;
  conversationId: number;
  message: string;
  isSystem: number;
  isSeen: number;
  isSeenAt: string;
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
      if (state.currentConversationId === action.payload.conversationId) {
        state.messages = { ...state.messages, items: [ ...state.messages.items, action.payload ] };
      }

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
      
      // reset previous active
      state.friends = state.friends.map(item => ({ ...item, active: false }));
      state.friends = [ ...state.friends, action.payload.friendConversation! ];

      state.messages = { items: [ action.payload.systemMessage! ], fetchDone: true };

      if(!state.hasFriends) {
        state.hasFriends = true;
      }
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

      state.friends = state.friends.map(item => ({ ...item, active: item.conversationId === action.payload.currentConversationId }));
    },
    updateMessageSeenStatus(state, action: PayloadAction<string>) {
      const lastIndex = state.messages.items.length - 1;
      
      state.messages.items[lastIndex] = {
        ...state.messages.items[lastIndex],
        isSeen: 1,
        isSeenAt: action.payload
      };
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
      state.hasFriends = false;
    },
  },
});

export const { addMessageReduce, updateMessageSeenStatus, signOutCleanupChat } = chatSlice.actions;

const { getFriendRequestsReduce, getPossibleFriendsReduce, addFriendReduce, acceptFriendReduce, denyFriendReduce, getFriendsReduce, updateMessagesReduce } = chatSlice.actions;

export const getPossibleFriends = (id: number, apiToken: string): AppThunk => async dispatch => {
  try {
    const response = await axios.get('http://localhost:5000/api/friends/possible-friends', {
      params: {
        currentUserId: id
      },
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    dispatch(getPossibleFriendsReduce(response.data));
  } catch (err) {
    handleAPIError(err, dispatch);
  }
};

export const getFriendRequests = (id: number, apiToken: string): AppThunk => async dispatch => {
  try {
    const response = await axios.get('http://localhost:5000/api/friends/friend-requests', {
      params: {
        currentUserId: id
      },
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });
    
    dispatch(getFriendRequestsReduce(response.data));
  } catch (err) {
    handleAPIError(err, dispatch);
  }
};

export const addFriend = (addingId: number, friendId: number, apiToken: string): AppThunk => async dispatch => {
  try {
    await axios.post('http://localhost:5000/api/friends/add-friend', { addFriendData: { addingId, friendId } }, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    dispatch(addFriendReduce());
  } catch (err) {
    handleAPIError(err, dispatch);
  }
};

export const acceptFriend = (addingId: number, friendId: number, friend: Friend, apiToken: string): AppThunk => async dispatch => {
  try {
    const response = await axios.post('http://localhost:5000/api/friends/accept-friend', { addFriendData: { addingId, friendId } }, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    const friendConversation: FriendConversation = { 
      conversationId: response.data.conversationId, 
      friend,
      active: true 
    };

    dispatch(acceptFriendReduce({ addingId, friendConversation, systemMessage: createInitialConversationMessage(response.data.newConversationMessage) }));
  } catch (err) {
    handleAPIError(err, dispatch);
  }
};

export const denyFriend = (addingId: number, friendId: number, apiToken: string): AppThunk => async dispatch => {
  try {
    await axios.post('http://localhost:5000/api/friends/deny-friend', { addFriendData: { addingId, friendId } }, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

  dispatch(denyFriendReduce({ addingId }));
  } catch (err) {
    handleAPIError(err, dispatch);
  }
};

export const getFriends = (currentUserId: number, apiToken: string): AppThunk => async dispatch => {
  try {
    const response = await axios.get('http://localhost:5000/api/friends/get-friends', {
      params: {
        currentUserId
      },
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    dispatch(getFriendsReduce(response.data));
  } catch (err) {
    handleAPIError(err, dispatch);
  }
};

export const selectFriend = (authUserId: number, receiverId: number, initMessages: boolean, apiToken: string): AppThunk => async dispatch => {
  try {
    const response = await axios.get('http://localhost:5000/api/friends/select-friend', {
      params: {
        authUserId,
        receiverId
      },
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    response.data.items.unshift(createInitialConversationMessage(response.data.newConversationMessage));

    dispatch(updateMessagesReduce({messages: response.data.items, currentConversationId: response.data.conversationId, receiverId, initMessages}));

    animateScroll.scrollToBottom({
      containerId: 'messages',
      duration: 0
    });
  } catch (err) {
    handleAPIError(err, dispatch);
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
