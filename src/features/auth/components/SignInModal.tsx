import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { attemptLogin, selectLoginError, attemptLoginFailureEnd } from '../authSlice';

interface Props {
  visible: boolean;
  closeSignInModal: Function;
  hasRegistered: boolean;
}

export default function SignInModal(props: Props) {
  const [form] = Form.useForm();
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const loginError = useSelector(selectLoginError);
  const dispatch = useDispatch();

  useEffect(() => {
    if(loginError) {
      form.setFields([
        {
          name: 'password',
          errors: ['Username or password incorrect.']
        }
      ]);
      setDisabledSubmit(true);
    } else {
      form.setFields([
        {
          name: 'password',
          errors: []
        }
      ]);
      setDisabledSubmit(false);
    }
  }, [form, loginError]);

  return (
    <Modal
      title={props.hasRegistered ? 'Great, now you can Sign in' : 'Sign in'}
      visible={props.visible}
      footer={null}
      onCancel={() => props.closeSignInModal()}
      getContainer={false}
    >
      <Form
        name="sign-in"
        onFinish={() => dispatch(attemptLogin(form.getFieldValue('username'), form.getFieldValue('password')))}
        form={form}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input onChange={() => {
            if(loginError) {
              dispatch(attemptLoginFailureEnd());
            }
          }} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          
        >
          <Input.Password style={{ width: '384px', marginLeft: '3px' }} onChange={() => {
            if(loginError) {
              dispatch(attemptLoginFailureEnd());
            }
          }} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 17 }}>
          <div style={{ display: 'flex' }}>
            <div>
              <Button type="default" htmlType="button" style={{ width: '100%' }} onClick={() => {
                form.setFieldsValue({ username: '', password: '' });
                if(loginError) {
                  dispatch(attemptLoginFailureEnd());
                  setDisabledSubmit(false);
                }
              }}>
                Clear
              </Button>
            </div>
            <div>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={disabledSubmit}>
                Sign in
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal >
  );
}