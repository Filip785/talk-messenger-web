import React, { useEffect } from 'react';
import { List, Avatar, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectFriends, getFriends, selectFriend, FriendConversation, selectFriendsFetched, selectInitMessages } from './chatSlice';
import { selectAuthUser } from '../auth/authSlice';
import { User } from '../../models/User';
import { Dispatch } from '@reduxjs/toolkit';

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
      <List.Item key={item.friend.id} onClick={() => props.dispatch(selectFriend(item.conversationId, item.friend.id, false))} className={item.active ? 'active' : ''}>
        <List.Item.Meta
          avatar={
            <Avatar src={item.friend.avatar} />
          }
          title={<a href="https://ant.design">{item.friend.username}</a>}
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget dolor nunc. In eu pulvinar velit. Nullam molestie id nunc vel facilisis. Mauris sed odio id turpis interdum vulputate. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent et varius nisl."
        />
        <div>Content</div>
      </List.Item>
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
      dispatch(getFriends(authUser.id!));
    }
    
    // fetch the initial conversation after logging in
    if(friendsFetched && !initMessages && friends.length > 0) {
      dispatch(selectFriend(friends[0].conversationId, friends[0].friend.id, true));
    }
  }, [dispatch, authUser.id, friendsFetched, friends, initMessages]);

  return (
    <>
      {friends.length > 0 ? <FriendsList friends={friends} authUser={authUser} dispatch={dispatch} /> : <FriendsListSkeleton />}
    </>
  );
};