import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Comment, Avatar, Button, Form, Input } from 'antd';
import { selectAuthUser } from '../auth/authSlice';
import { Message, addMessage } from './chatSlice';

const { TextArea } = Input;

interface Props {
  socket: SocketIOClient.Socket;
}

const MessageReply = (props: Props) => {
  const authUser = useSelector(selectAuthUser);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  return (
    <div className="reply-section">
      <Comment
        avatar={
          <Avatar
            src={authUser.avatar}
            alt={authUser.name}
          />
        }
        content={
          <>
            <Form.Item>
              <TextArea rows={4} placeholder="Enter your message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </Form.Item>
            <Form.Item className="buttonItem">
              <Button htmlType="submit" type="primary" onClick={() => {
                const messageSend: Message = { id: 1251, sendingUser: authUser, content: message };

                props.socket.emit('message-sent', messageSend);
                dispatch(addMessage(messageSend));
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

export default MessageReply;