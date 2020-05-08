import { RootState, AppThunk } from "../../app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/User";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const authUser = JSON.parse(localStorage.getItem('authUser')!);

interface AuthState {
  user: {
    loggedIn: { status: boolean, fromAuth: boolean },
    authUser: User
  },
  registered: boolean,
  loginError: boolean,
  registerError: boolean
}

let id = localStorage.getItem('userId');

if (!id) {
  let generatedId = uuidv4();
  localStorage.setItem('userId', generatedId);
  id = generatedId
}

const initialState: AuthState = {
  user: authUser ? {
    loggedIn: { status: true, fromAuth: false },
    authUser
  } : {
    loggedIn: { status: false, fromAuth: false },
    authUser
  },
  registered: false,
  loginError: false,
  registerError: false
  // authUser: {
  //   id: id,
  //   username: 'Filip Djuricic',
  //   avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  // }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    attemptLoginReduce(state, action: PayloadAction<User>) {
      state.user = {
        loggedIn: { status: true, fromAuth: true },
        authUser: action.payload
      };
    },
    attemptLoginFailure(state) {
      state.loginError = true;
    },
    attemptLoginFailureEnd(state) {
      state.loginError = false;
    },
    attemptRegisterReduce(state) {
      state.registered = true;
    },
    attemptRegisterFailure(state) {
      state.registerError = true;
    },
    attemptRegisterFailureEnd(state) {
      state.registerError = false;
    },
    signOutReduce(state) {
      state.user = {
        loggedIn: { status: false, fromAuth: false },
        authUser: { id: '', username: '', avatar: '', api_token: '' }
      }
    }
  },
});

export const { attemptLoginFailureEnd, attemptRegisterFailureEnd, signOutReduce } = authSlice.actions;

const { attemptLoginReduce, attemptRegisterReduce, attemptLoginFailure, attemptRegisterFailure } = authSlice.actions;

export const attemptLogin = (username: string, password: string): AppThunk => async dispatch => {
  try {
    const response = await axios.post<User>('http://localhost:5000/api/users/login', { loginData: { username, password } });
    
    dispatch(attemptLoginReduce(response.data));
    localStorage.setItem('authUser', JSON.stringify(response.data));
  } catch (err) {
    console.log('Attempt Login error: ', err.response.status);
    dispatch(attemptLoginFailure());
  }
};

export const attemptRegister = (username: string, password: string): AppThunk => async dispatch => {
  try {
    await axios.post('http://localhost:5000/api/users/create', { userData: { username, password } });

    dispatch(attemptRegisterReduce());
  } catch (err) {
    console.log('Attempt Register error: ', err.response.data);
    dispatch(attemptRegisterFailure());
  }
};

export const selectLoginError = (state: RootState) => state.auth.loginError;
export const selectRegisterError = (state: RootState) => state.auth.registerError;
export const selectLoggedIn = (state: RootState) => state.auth.user.loggedIn;
export const selectAuthUser = (state: RootState) => state.auth.user.authUser;
export const selectRegistered = (state: RootState) => state.auth.registered;

export default authSlice.reducer;
