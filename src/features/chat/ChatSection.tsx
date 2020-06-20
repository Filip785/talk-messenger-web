import React, { useEffect, useState, Dispatch } from 'react';
import FriendsSidebar from './FriendsSidebar';
import Messages from './Messages';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, signOutReduce } from '../auth/authSlice';
import { User } from '../../models/User';
import { selectFriendRequests, getFriendRequests, Requests, selectFriendAdded, acceptFriend, denyFriend, signOutCleanupChat, ConversationMessage, addMessageReduce } from './chatSlice';
import socketIOClient from 'socket.io-client';
import MessageReply from './MessageReply';
import { Button, Badge, Popover, Avatar, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import history from '../../shared/history';
import AddFriendModal from './AddFriendModal';

const socket = socketIOClient('http://localhost:5000');

interface FriendRequestsProps {
  requests: Requests;
  dispatch: Dispatch<any>;
  authUserId: number;
}

function FriendRequestsContent(props: FriendRequestsProps) {
  return (
    <div style={{ display: 'flex', width: 350, flexDirection: 'column' }}  className="friendRequestList">
      {props.requests.friendRequests.map(request => (
        <div className="friendRequest" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} key={request.id}>
          <div className="avatar-name" style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={request.User1.avatar} />
            <span>{request.User1.username} added you</span>
          </div>
          <div className="accept-deny-btns">
            <Button htmlType="submit" type="primary" size="large" onClick={() => props.dispatch(acceptFriend(request.User1.id, props.authUserId, request.User1))} style={{ marginRight: 16 }}>Accept</Button>
            <Button htmlType="submit" type="primary" size="large" onClick={() => props.dispatch(denyFriend(request.User1.id, props.authUserId))}>Deny</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatSection() {
  const authUser: User = useSelector(selectAuthUser)!;
  const requests = useSelector(selectFriendRequests);
  const friendAdded = useSelector(selectFriendAdded);

  const [visibleAddFriendModal, setVisibleAddFriendModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if(!requests.didInit) {
      socket.on('message-received', (receivedMessage: ConversationMessage) => {
        dispatch(addMessageReduce(receivedMessage));
      });

      dispatch(getFriendRequests(authUser.id!));
    }

    if(friendAdded) {
      setVisibleAddFriendModal(false);
    }
  }, [dispatch, friendAdded, requests, authUser.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div className="titlebar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid rgba(0, 0, 0, .10)' }}>
        <h1 style={{ margin: 0 }}>Welcome, {authUser.username}</h1>

        <div className="titlebar-buttons" style={{ display: 'flex' }}>
          <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Popover content={requests.count === 0 ? (<h1>No content</h1>) : <FriendRequestsContent requests={requests} dispatch={dispatch} authUserId={authUser.id!} />} title="Current Friend Requests" trigger="click">
              <Badge count={requests.count}>
                <UserOutlined style={{ fontSize: 32 }} />
              </Badge>
            </Popover>
          </div>

          <Button htmlType="submit" type="primary" size="large" onClick={() => setVisibleAddFriendModal(true)} style={{ marginRight: '20px' }}>Add Friend</Button>

          <Button htmlType="submit" type="primary" size="large" onClick={() => {
            localStorage.removeItem('authUser');
            dispatch(signOutReduce());
            dispatch(signOutCleanupChat());
            socket.removeAllListeners();
            history.push('/auth');
          }}>Sign out</Button>
        </div>
      </div>
      <div className="main-chat-section" style={{ display: 'flex', height: '100%' }}>
        <FriendsSidebar />
        <div className="chat-section">
          <Messages />

          <MessageReply socket={socket} />
        </div>
      </div>

      <AddFriendModal visible={visibleAddFriendModal} closeAddFriendModal={setVisibleAddFriendModal} />
      {friendAdded && <Alert message="User successfully added." type="success" closable />}
    </div>
  );
}