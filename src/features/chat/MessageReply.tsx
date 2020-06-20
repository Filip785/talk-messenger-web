import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Comment, Avatar, Button, Form, Input } from 'antd';
import { selectAuthUser } from '../auth/authSlice';
import { selectReceiverId, selectConversationId } from './chatSlice';

const { TextArea } = Input;

interface Props {
  socket: SocketIOClient.Socket;
}

export default function MessageReply(props: Props) {
  const conversationId = useSelector(selectConversationId);
  const authUser = useSelector(selectAuthUser);
  const receiverId = useSelector(selectReceiverId);
  const [message, setMessage] = useState('');

  return (
    <div className="reply-section">
      <Comment
        avatar={
          <Avatar
            src={authUser.avatar}
            alt={authUser.username}
          />
        }
        content={
          <>
            <Form.Item>
              <TextArea rows={4} placeholder="Enter your message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </Form.Item>
            <Form.Item className="buttonItem">
              <Button htmlType="submit" type="primary" onClick={() => {
                props.socket.emit('message-sent', {
                  senderId: authUser.id!,
                  receiverId: receiverId,
                  conversationId,
                  message,
                });
                setMessage('');
              }}>
                Send Message
                </Button>
            </Form.Item>
          </>
        }
      />
    </div>
  );
};