import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';
import authReducer from '../features/auth/authSlice';
import errorReducer from '../features/error/errorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    error: errorReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
