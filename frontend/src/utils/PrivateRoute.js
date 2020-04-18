import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';

import { useAuth0 } from './react-auth0-spa';

// A wrapper for <Route> that redirects to the login screen
// if you're not yet authenticated
const PrivateRoute = ({ children, path, loacation, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path }
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = loaction => (isAuthenticated === true ? children : null);

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;