import React, { useEffect, Dispatch } from 'react';
import { ConversationMessage, addMessageReduce, getFriendRequests, selectFriendRequests, acceptFriend, denyFriend, Requests } from './chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../models/User';
import { selectAuthUser } from '../auth/authSlice';
import { Popover, Badge, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface Props {
  socket: SocketIOClient.Socket;
}

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

const FriendRequests = React.memo((props: Props) => {
  const authUser: User = useSelector(selectAuthUser)!;
  const requests = useSelector(selectFriendRequests);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!requests.didInit) {
      props.socket.on('message-received', (receivedMessage: ConversationMessage) => {
        dispatch(addMessageReduce(receivedMessage));
      });

      dispatch(getFriendRequests(authUser.id!));
    }
  });

  return (
    <Popover content={requests.count === 0 ? (<h1>No content</h1>) : <FriendRequestsContent requests={requests} dispatch={dispatch} authUserId={authUser.id!} />} title="Current Friend Requests" trigger="click">
      <Badge count={requests.count}>
        <UserOutlined style={{ fontSize: 32 }} />
      </Badge>
    </Popover>
  );
});

export default FriendRequests;