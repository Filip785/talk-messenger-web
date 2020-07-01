import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import axios from 'axios';

export interface ErrorObject {
  errorMessage: string;
  errorCode: number;
  errorDescription: string;
  errorUrl: string;
  browser: string;
}

interface ErrorState {
  errorReportDialogVisible: boolean;
  errorObject: ErrorObject;
  errorReportSent: boolean;
}

const initialState: ErrorState = {
  errorReportDialogVisible: false,
  errorObject: {
    errorMessage: '',
    errorCode: 0,
    errorDescription: '',
    errorUrl: '',
    browser: ''
  },
  errorReportSent: false
};

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    showErrorReportDialogReduce(state) {
      state.errorReportDialogVisible = !state.errorReportDialogVisible;

      // cleanup
      if(!state.errorReportDialogVisible) {
        state.errorObject = {
          errorMessage: '',
          errorCode: 0,
          errorDescription: '',
          errorUrl: '',
          browser: ''
        };
        state.errorReportSent = false;
      }
    },
    setErrorObjectReduce(state, action: PayloadAction<ErrorObject>) {
      state.errorObject = action.payload;
    },
    sendErrorReportReduce(state) {
      state.errorReportSent = true;
    }
  },
});

export const { showErrorReportDialogReduce, setErrorObjectReduce } = errorSlice.actions;

const { sendErrorReportReduce } = errorSlice.actions;

export const sendErrorReport = (errorObject: ErrorObject): AppThunk => async dispatch => {
  try {
    await axios.post<ErrorObject>('http://localhost:5000/api/errors/send-report', { errorObject });
    
    dispatch(showErrorReportDialogReduce());
    dispatch(sendErrorReportReduce());
  } catch (err) {
    // error sending report
    console.log('Error while sending report: ', err);
  }
};

export const selectErrorReportDialogVisible = (state: RootState) => state.error.errorReportDialogVisible;
export const selectErrorObject = (state: RootState) => state.error.errorObject;
export const selectErrorReportSent = (state: RootState) => state.error.errorReportSent;

export default errorSlice.reducer;