import React, { useEffect } from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';

import { useAuth0 } from './react-auth0-spa';

// A wrapper for <Route> that redirects to the login screen
// if you're not yet authenticated
const PrivateRoute = ({ children, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: window.location.pathname }
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);
  
  return (
    <Route
      path={path}
      {...rest}
      render={routeProps => (
        isAuthenticated ? children : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: routeProps.location }
            }}
          />
        )
      )}
    />
  );
};

export default PrivateRoute;