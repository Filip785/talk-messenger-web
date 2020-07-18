import React, { useEffect, useState } from 'react';
import FriendsSidebar from './FriendsSidebar';
import Messages from './Messages';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser, signOutReduce } from '../auth/authSlice';
import { User } from '../../models/User';
import { selectFriendAdded, signOutCleanupChat, selectFriendsFetched, selectHasFriends } from './chatSlice';
import socketIOClient from 'socket.io-client';
import MessageReply from './MessageReply';
import { Button, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import history from '../../shared/history';
import AddFriendModal from './AddFriendModal';
import FriendRequests from './FriendRequests';
import { Route, Switch } from 'react-router';

const socket = socketIOClient('http://localhost:5000');

export default function ChatSection() {
  const authUser: User = useSelector(selectAuthUser)!;

  const friendsFetched = useSelector(selectFriendsFetched);
  const hasFriends = useSelector(selectHasFriends);
  const friendAdded = useSelector(selectFriendAdded);
  const [visibleAddFriendModal, setVisibleAddFriendModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if(friendAdded) {
      setVisibleAddFriendModal(false);
    }
  }, [dispatch, friendAdded]);

  return (
    <>
      <div className="titlebar">
        <h1 style={{ margin: 0 }}>Welcome, {authUser.username}</h1>

        <div className="titlebar-buttons" style={{ display: 'flex' }}>
          <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <FriendRequests socket={socket} />
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
      <div className="main-chat-section">
        <FriendsSidebar />
        <div className="chat-section">
          { !friendsFetched && <LoadingOutlined style={{ fontSize: 200 }} />}
          
          { (friendsFetched && !hasFriends) && (
            <h1 style={{marginLeft: 25, marginTop: 25}}>No friends. Add new friend by pressing button above.</h1> 
          )}
          
          { (friendsFetched && hasFriends) && (
            <>
              <Switch>
                <Route path='/c/:id'>
                  <Messages socket={socket} />
                </Route>
              </Switch>
              
              <MessageReply socket={socket} />
            </>
          )}
        </div>
      </div>

      <AddFriendModal visible={visibleAddFriendModal} closeAddFriendModal={setVisibleAddFriendModal} />
      {friendAdded && <Alert message="User successfully added." type="success" closable />}
    </>
  );
}