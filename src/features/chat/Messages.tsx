import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMessages, selectFriend } from './chatSlice';
import { Comment, Avatar } from 'antd';
import { User } from '../../models/User';
import { selectAuthUser } from '../auth/authSlice';
import { useParams } from 'react-router';

export default function Messages() {
  const params: { id: string } = useParams();
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const authUser: User = useSelector(selectAuthUser);

  useEffect(() => {
    if(!messages.fetchDone) {
      dispatch(selectFriend(authUser.id!, Number(params.id), false));
    }
  }, [dispatch, authUser.id, params.id, messages.fetchDone]);

  return (
    <>
      {messages.fetchDone && <div className="messages">
        {messages.items.map(message => <Comment
          key={message.id}
          className={message.is_system ? 'message-system' : authUser.id === message.Sender.id ? 'message-current' : 'message-friend'}
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
      </div>}
    </>
  );
};