import React, { useState } from 'react';
import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { sendErrorReport, selectErrorObject } from './errorSlice';
import ReactJsonSyntaxHighlighter from 'react-json-syntax-highlighter';
import frontendLogout from '../../shared/error-helper';

export default function ErrorReportModal() {
  const [loading, setLoading] = useState(false);
  const errorObject = useSelector(selectErrorObject);

  const dispatch = useDispatch();

  const handleSend = () => {
    setLoading(true);
    dispatch(sendErrorReport(errorObject));
  };
  const handleDontSend = () => frontendLogout(dispatch, true);

  return (
    <Modal
      closable={false}
      visible={true}
      title="An error occurred..."
      footer={[
        <Button key="back" disabled={loading} onClick={handleDontSend}>
          Don't Send Report
              </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSend}>
          Send Report
              </Button>,
      ]}
    >
      <p>This  is the data that we would like to collect:</p>
      <ReactJsonSyntaxHighlighter obj={errorObject} />
      <p>We will never collect your IP address or any other personally identifying information (emails, username, location etc.).</p>
      <p>Sending this report is not required, it's completely optional, but doing so would help us make the application better.</p>
      <p>If you click Don't Send button, all of this data will be discarded and you will be redirected to the login page where you can login again.</p>
    </Modal>
  );
}