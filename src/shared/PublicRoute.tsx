import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface LoggedInObject {
  status: boolean;
  fromAuth: boolean;
}

interface Props {
  component: React.ComponentType<any>;
  loggedIn: LoggedInObject;
  path: string[] | string;
}

const PublicRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { loggedIn } = rest;
  let to: string = '/';

  return (
    <Route {...rest} render={props => loggedIn.status ? (<Redirect to={to} />) : ( <Component {...props} /> )} />
  );
};

export default PublicRoute;