import React from 'react';
import { useSelector } from 'react-redux';
import { selectMessages, ConversationMessage } from './chatSlice';
import { Comment, Avatar } from 'antd';
import { User } from '../../models/User';
import { selectAuthUser } from '../auth/authSlice';

export default function  Messages() {
  const messages: ConversationMessage[] = useSelector(selectMessages);
  const authUser: User = useSelector(selectAuthUser);

  return (
    <div className="messages">
      {messages.map(message => <Comment
        key={message.id}
        className={authUser.id === message.Sender.id ? 'message-current' : 'message-friend'}
        author={<a href={`/profile/${message.Sender.id!}`}>{message.Sender.username}</a>}
        avatar={
          <Avatar
            src={message.Sender.avatar}
            alt={message.Sender.username}
          />
        }
        content={
          <p>
            {message.message}
          </p>
        }
      />)}
    </div>
  );
};