import { RootState } from "../../app/store";
import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../models/User";
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  authUser: User
}

let id = localStorage.getItem('userId');

if (!id) {
  let generatedId = uuidv4();
  localStorage.setItem('userId', generatedId);
  id = generatedId
}

const initialState: AuthState = {
  authUser: {
    id: id,
    name: 'Filip Djuricic',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

  },
});

export const selectAuthUser = (state: RootState) => state.auth.authUser;

export default authSlice.reducer;
