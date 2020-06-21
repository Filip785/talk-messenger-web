import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import Authentication from './features/auth/components/Authentication';
import ChatSection from './features/chat/ChatSection';
import { Router, Switch, Route } from 'react-router';
import history from './shared/history';
import PublicRoute from './shared/PublicRoute';
import { useSelector } from 'react-redux';
import { selectLoggedIn } from './features/auth/authSlice';
import PrivateRoute from './shared/PrivateRoute';

function App() {
  const loggedIn = useSelector(selectLoggedIn);

  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path="/auth">
            <PublicRoute loggedIn={loggedIn} component={Authentication} path='/auth' />
          </Route>
          <Route path="/">
            <PrivateRoute loggedIn={loggedIn} component={ChatSection} path='/' />
          </Route>
          <Route component={() => <h1>404!</h1>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
