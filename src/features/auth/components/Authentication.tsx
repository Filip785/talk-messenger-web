import React, { useState, useEffect } from 'react';
import { Row, Col, Button, message } from 'antd';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import { selectRegistered, selectJwtExpired } from '../authSlice';
import { useSelector } from 'react-redux';

export default function Authentication() {
  const registered = useSelector(selectRegistered);
  const jwtExpired = useSelector(selectJwtExpired);

  const [visibleSignInModal, setVisibleSignInModal] = useState(jwtExpired);
  const [visibleSignUpModal, setVisibleSignUpModal] = useState(false);

  useEffect(() => {
    if(registered) {
      setVisibleSignUpModal(false);
      setVisibleSignInModal(registered);
    }

    if(jwtExpired) {
      setVisibleSignInModal(jwtExpired);

      message.error('Session expired. Please login again below.')
    }
  }, [registered, jwtExpired]);

  return (
    <div className="auth-wrapper">
      <Row align="middle" justify="center" style={{width: '100%'}}>
        <Col>
          <h1>Sign in if you have an account, otherwise sign up for the new one instead</h1>
          <div className="auth-buttons-group">
            <Button htmlType="submit" type="primary" size="large" onClick={() => setVisibleSignInModal(!visibleSignInModal)}>Sign in</Button>
            {!registered && <Button htmlType="submit" type="primary" size="large" onClick={() => setVisibleSignUpModal(!visibleSignUpModal)}>Sign up</Button>}
          </div>
        </Col>
      </Row>

      <SignInModal visible={visibleSignInModal} closeSignInModal={setVisibleSignInModal} hasRegistered={registered} />
      <SignUpModal visible={visibleSignUpModal} closeSignUpModal={setVisibleSignUpModal} />
    </div>
  );
}