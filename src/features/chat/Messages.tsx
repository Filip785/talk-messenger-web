import React from 'react';
import { useSelector } from 'react-redux';
import { selectMessages, Message } from './chatSlice';
import { Comment, Avatar } from 'antd';
import { User } from '../../models/User';
import { selectAuthUser } from '../auth/authSlice';

export default function  Messages() {
  const messages: Message[] = useSelector(selectMessages);
  const authUser: User = useSelector(selectAuthUser);

  return (
    <div className="messages">
      {messages.map(message => <Comment
        key={message.id}
        className={authUser.id === message.sendingUser.id ? 'message-current' : 'message-friend'}
        author={<a href={`/profile/${message.sendingUser.id!}`}>{message.sendingUser.name}</a>}
        avatar={
          <Avatar
            src={message.sendingUser.avatar}
            alt={message.sendingUser.name}
          />
        }
        content={
          <p>
            {message.content}
          </p>
        }
      />)}
    </div>
  );
};