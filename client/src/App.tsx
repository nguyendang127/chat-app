import NotFound from 'components/NotFound/NotFound';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import HeaderChat from 'features/headerChat/HeaderChat';
import Login from 'features/auth/login/Login';
import Register from 'features/auth/register/Register';
import SiderChat from 'features/siderChat/SiderChat';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { Spin } from 'antd';
import { lazy, Suspense, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ContentChat = lazy(() => import('./features/contentChat/ContentChat'));
const socket = io('http://localhost:4000');
function App() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    socket.emit('user_connection', { id: localStorage.getItem('access_token') , username: localStorage.getItem('username')});
  }, []);

  return (
    <div className="App">
      <Suspense fallback={<Spin spinning={loading} tip="Loading..." size="large" />}>
        {/* <Spin spinning={loading} tip="Loading..." size="large"> */}
        <Redirect to="/t" />
        <Switch>
          <PrivateRoute isAuthenticated={isAuthenticated} authenticationPath="/login" path="/t">
            <HeaderChat socket={socket} />
            <div style={{ display: 'flex', width: '100%' }}>
              <SiderChat onLoading={() => setLoading(true)} offLoading={() => setLoading(false)} />
              <Switch>
                <Route path="/t/:room">
                  <ContentChat socket={socket} />
                </Route>
              </Switch>
            </div>
          </PrivateRoute>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
        {/* </Spin> */}
      </Suspense>
    </div>
  );
}

export default App;
