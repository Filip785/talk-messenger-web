import React from 'react';
import { List, Avatar } from 'antd';

const data = [
  {
    id: 0,
    title: 'User 1',
  },
  {
    id: 1,
    title: 'User 2',
  },
  {
    id: 2,
    title: 'User 3',
  },
  {
    id: 3,
    title: 'User 4',
  },
];

export default function FriendsSidebar() {
  return (
    <>
      <List
        dataSource={data}
        renderItem={item => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={<a href="https://ant.design">{item.title}</a>}
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget dolor nunc. In eu pulvinar velit. Nullam molestie id nunc vel facilisis. Mauris sed odio id turpis interdum vulputate. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent et varius nisl."
            />
            <div>Content</div>
          </List.Item>
        )}
      >
      </List>
    </>
  );
};