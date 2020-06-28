import React, { useEffect } from 'react';
import { Modal, Form, Button, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getPossibleFriends, selectPossibleFriends, addFriend } from './chatSlice';
import { selectAuthUser } from '../auth/authSlice';

const { Option } = Select;

interface Props {
  visible: boolean;
  closeAddFriendModal: Function;
}

export default function AddFriendModal(props: Props) {
  const [form] = Form.useForm();
  const authUser = useSelector(selectAuthUser);
  const possibleFriends = useSelector(selectPossibleFriends);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPossibleFriends(authUser.id!, authUser.api_token!));
  }, [form, dispatch, authUser.id, authUser.api_token]);

  return (
    <Modal
      title='Add new friend'
      visible={props.visible}
      footer={null}
      onCancel={() => props.closeAddFriendModal()}
      getContainer={false}
    >
      <Form
        name="sign-in"
        onFinish={() => dispatch(addFriend(authUser.id!, form.getFieldValue('usernameId'), authUser.api_token!))}
        form={form}
      >
        <Form.Item
          label="Username"
          name="usernameId"
          rules={[
            {
              required: true,
              message: 'Enter the username!',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select user"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {possibleFriends.map(item => <Option value={item.id} key={item.id}>{item.username}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 17 }}>
          <div>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Add
              </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal >
  );
}