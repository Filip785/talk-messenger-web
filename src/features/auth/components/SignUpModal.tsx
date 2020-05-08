import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { attemptRegister, selectRegisterError, attemptRegisterFailureEnd } from '../authSlice';

interface Props {
  visible: boolean;
  closeSignUpModal: Function;
}

export default function SignUpModal(props: Props) {
  const [form] = Form.useForm();

  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const registerError = useSelector(selectRegisterError);
  const dispatch = useDispatch();

  useEffect(() => {
    if(registerError) {
      form.setFields([
        {
          name: 'username',
          errors: ['Username already exists. Try another one...']
        }
      ]);
      setDisabledSubmit(true);
    } else {
      form.setFields([
        {
          name: 'username',
          errors: []
        }
      ]);
      setDisabledSubmit(false);
    }
  }, [form, registerError]);

  return (
    <Modal
      title="Sign Up"
      visible={props.visible}
      footer={null}
      onCancel={() => props.closeSignUpModal()}
      getContainer={false}
    >
      <Form
        name="sign-up"
        onFinish={() => dispatch(attemptRegister(form.getFieldValue('username'), form.getFieldValue('password')))}
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
            if(registerError) {
              dispatch(attemptRegisterFailureEnd());
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
          <Input.Password style={{ width: '386px', marginLeft: '4px' }} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 17 }}>
          <div style={{ display: 'flex' }}>
            <div>
              <Button type="default" htmlType="button" style={{ width: '100%' }} onClick={() => {
                form.setFieldsValue({username: '', password: ''});
                if(registerError) {
                  dispatch(attemptRegisterFailureEnd());
                  setDisabledSubmit(false);
                }
              }}>
                Clear!
              </Button>
            </div>
            <div>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={disabledSubmit}>
                Sign up
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}