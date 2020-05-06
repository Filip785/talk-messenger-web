import React, { useEffect } from 'react';
import FriendsSidebar  from './FriendsSidebar';
import Messages from './Messages';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from '../auth/authSlice';
import { User } from '../../models/User';
import { Message, addMessage } from './chatSlice';
import socketIOClient from 'socket.io-client';
import MessageReply from './MessageReply';

const ENDPOINT = 'http://localhost:5000';
const socket = socketIOClient(ENDPOINT);

export default function ChatSection() {
  const authUser: User = useSelector(selectAuthUser);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('message-received', (receivedMessage: Message) => {
      if(receivedMessage.sendingUser.id !== authUser.id) {
        dispatch(addMessage(receivedMessage));
      }
    });
  }, [authUser, dispatch]);

  return (
    <>
      <FriendsSidebar />
      <div className="chat-section">
        <Messages />

        <MessageReply socket={socket} />
      </div>
    </>
  );
}