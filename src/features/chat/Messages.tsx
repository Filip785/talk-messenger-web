import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMessages, selectFriend, selectConversationId, updateMessageSeenStatus } from './chatSlice';
import { Comment, Avatar } from 'antd';
import { User } from '../../models/User';
import { selectAuthUser } from '../auth/authSlice';
import { useParams } from 'react-router';

interface Props {
  socket: SocketIOClient.Socket;
}

export default function Messages(props: Props) {
  const params: { id: string } = useParams();
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const authUser: User = useSelector(selectAuthUser);
  const conversationId = useSelector(selectConversationId);

  useEffect(() => {
    dispatch(selectFriend(authUser.id!, Number(params.id), false, authUser.api_token!));
  }, [dispatch, authUser.id, authUser.api_token, params.id]);

  useEffect(() => {
    const lastMessage = messages.items[messages.items.length - 1];

    if(!props.socket.hasListeners('message-seen-update')) {
      props.socket.on('message-seen-update', () => {
        dispatch(updateMessageSeenStatus());
      });
    }

    if(lastMessage) {
      if(lastMessage.isSeen === 0 && lastMessage.Sender.id !== authUser.id) {
        // send socket signal to update
        props.socket.emit('message-seen', lastMessage.id, conversationId);
      }
    }
  }, [dispatch, props.socket, conversationId, messages.items, authUser.id]);

  return (
    <div className="messages" id="messages">
      {messages.items.map((message, index, itemsArray) => {
          const isAvatar = ((itemsArray[index+1] && ((itemsArray[index+1].Sender.id !== message.Sender.id))) || !(itemsArray[index+1]));
          let messageClassName = message.isSystem ? 'message-system' : authUser.id === message.Sender.id ? 'message-current' : 'message-friend';
          messageClassName = !isAvatar ? `${messageClassName} has-no-avatar` : messageClassName;

          return <Comment
            key={message.id}
            className={messageClassName}
            author={<a href={`/profile/${message.Sender.id!}`}>{message.Sender.username}</a>}
            avatar={
              <>
                {
                  isAvatar && <Avatar
                  src={message.Sender.avatar}
                  alt={message.Sender.username}
                />
                }
              </>
            }
            content={
              <>
                <p>
                  {message.message}
                </p>
                {(messages.items.length - 1 === index) && <p className="read-info">
                  {message.isSeen ? <span>Seen at {message.isSeenAt}</span> : <span>Delivered on {message.isSeenAt}</span>}
                </p>}
              </>
            }
          />;
        }
      )}
    </div>
  );
};