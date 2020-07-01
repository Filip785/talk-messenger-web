import { Dispatch, AnyAction } from 'redux';
import { signOutCleanupChat } from '../features/chat/chatSlice';
import { signOutReduce } from '../features/auth/authSlice';
import { showErrorReportDialogReduce, setErrorObjectReduce } from '../features/error/errorSlice';
import history from './history';
import createErrorObject from './error-creator';

export default function frontendLogout(dispatch: Dispatch<AnyAction>, withErrorReporting: boolean) {
  localStorage.removeItem('authUser');
  
  dispatch(signOutReduce());
  dispatch(signOutCleanupChat());

  if(withErrorReporting) {
    dispatch(showErrorReportDialogReduce());
  }

  history.push('/auth');
}

export function handleAPIError(err: { response: { data: { error: string }, status: number, statusText: string, config: { url: string } } }, dispatch: Dispatch<AnyAction>) {
  if (err.response.data.error === 'jwt expired') {
    frontendLogout(dispatch, false);
    return;
  }

  const errorObject = createErrorObject(err.response.data.error, err.response.status, err.response.statusText, err.response.config.url);
  dispatch(setErrorObjectReduce(errorObject));
  frontendLogout(dispatch, true);
}