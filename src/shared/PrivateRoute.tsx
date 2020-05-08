import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface AdditionalPropType {
  type: string;
}

interface LoggedInObject {
  status: boolean;
  fromAuth: boolean;
}

interface Props {
  component: React.ComponentType<any>;
  loggedIn: LoggedInObject;
  additionalProps?: AdditionalPropType;
  path: string[] | string;
  exact?: boolean;
}

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => rest.loggedIn.status ? ( <Component {...props} {...rest.additionalProps} /> ) : (<Redirect to="/auth" />) } />
);

export default PrivateRoute; 