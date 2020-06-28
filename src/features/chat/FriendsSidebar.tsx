import React, { useEffect } from 'react';
import { List, Avatar, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectFriends, getFriends, FriendConversation, selectFriendsFetched, selectInitMessages, resetMessages } from './chatSlice';
import { selectAuthUser } from '../auth/authSlice';
import { User } from '../../models/User';
import { Dispatch } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import history from '../../shared/history';

interface FriendsListProps {
  friends: FriendConversation[];
  authUser: User;
  dispatch: Dispatch<any>;
}

const FriendsList = (props: FriendsListProps) => (
  <List
    className="friends-sidebar"
    dataSource={props.friends}
    renderItem={item => (
      <Link to={`/c/${item.friend.id}`}>
        <List.Item key={item.friend.id} className={item.active ? 'active' : ''}>
          <List.Item.Meta
            avatar={
              <Avatar src={item.friend.avatar} />
            }
            title={item.friend.username}
            description={item.lastMessage ? item.lastMessage.message : 'No messages'}
          />
          <div>
            <div style={{textAlign: 'center'}}>
              {item.lastMessage ? item.lastMessage.createdAtTime : ''}
            </div>
            <div>
              {item.lastMessage ? item.lastMessage.createdAt : ''}
            </div>
          </div>
        </List.Item>
      </Link>
    )}></List>
);

const FriendsListSkeleton = () => (
  <div style={{padding: '12px'}} className="ant-list">
    <ul className="ant-list-items">
      <li className="ant-list-item">
      <Skeleton avatar paragraph={{ rows: 1 }} />
      </li>
    </ul>
  </div>
);

export default function FriendsSidebar() {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const friends = useSelector(selectFriends);
  const friendsFetched = useSelector(selectFriendsFetched);
  const initMessages = useSelector(selectInitMessages);

  useEffect(() => {
    if(!friendsFetched) {
      dispatch(getFriends(authUser.id!, authUser.api_token!));
    }
    
    // fetch the initial conversation after logging in
    if(friendsFetched && !initMessages && friends.length > 0) {
      // to move
      history.listen((_location, _action) => {
        dispatch(resetMessages());
      });

      if(history.location.pathname !== `/c/${friends[0].friend.id}`) {
        history.push(`/c/${friends[0].friend.id}`);
      }
    }
  }, [dispatch, authUser.id, authUser.api_token, friendsFetched, friends, initMessages]);
  
  return (
    <>
      {friends.length > 0 ? <FriendsList friends={friends} authUser={authUser} dispatch={dispatch} /> : <FriendsListSkeleton />}
    </>
  );
};