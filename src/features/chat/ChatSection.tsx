import React, { useEffect } from 'react';
import FriendsSidebar  from './FriendsSidebar';
import Messages from './Messages';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, signOutReduce } from '../auth/authSlice';
import { User } from '../../models/User';
import { Message, addMessage } from './chatSlice';
import socketIOClient from 'socket.io-client';
import MessageReply from './MessageReply';
import { Button } from 'antd';
import history from '../../shared/history';

const socket = socketIOClient('http://localhost:5000');

export default function ChatSection() {
  const authUser: User = useSelector(selectAuthUser)!;

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('message-received', (receivedMessage: Message) => {
      if(receivedMessage.sendingUser.id !== authUser.id) {
        dispatch(addMessage(receivedMessage));
      }
    });
  }, [authUser, dispatch]);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div className="titlebar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid rgba(0, 0, 0, .10)'}}>
        <h1 style={{margin: 0}}>Welcome, {authUser.username}</h1>  

        <Button htmlType="submit" type="primary" size="large" onClick={() => {
          localStorage.removeItem('authUser');
          dispatch(signOutReduce());
          history.push('/auth');
        }}>Sign out</Button>
      </div>
      <div className="main-chat-section" style={{display: 'flex', height: '100%'}}>
        <FriendsSidebar />
        <div className="chat-section">
          <Messages />

          <MessageReply socket={socket} />
        </div>
      </div>
    </div>
  );
}