import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import { useAuth0 } from './utils/react-auth0-spa';
import PrivateRoute from './utils/PrivateRoute';
import NavBar from './components/NavBar';
import Loading from './components/Loading';
import Footer from './components/Footer';
import NoMatch from './views/NoMatch';
import ExternalApi from './views/ExternalApi';
import CreateView from './views/CreateView';
import DetailView from './views/DetailView';
import Profile from './views/Profile';
import ListView from './views/ListView';
import Login from './views/Login';

const App = () => {
  // const history = useHistory();
  const { loading, getTokenSilently, isAuthenticated } = useAuth0();

  const httpLink = new BatchHttpLink({
    // const httpLink = createHttpLink({
    // const httpLink = new HttpLink({
    uri: '/gql',
    credentials: 'same-origin',
  });

  const authMiddleware = setContext(async (_, { headers }) => {
    if (isAuthenticated) {
      const token = await getTokenSilently();
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        }
      };
    } else {
      return {
        headers
      };
    }
  });

  const link = authMiddleware.concat(httpLink);
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    link,
    cache,
  });

  if (loading) return <Loading />;

  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <NavBar />
        <div className="container">
          <Switch>
            <Route exact path='/'>
              <ListView />
            </Route>
            <Route exact path='/login'>
              <Login />
            </Route>
            <PrivateRoute exact path='/profile'>
              <Profile />
            </PrivateRoute>
            <PrivateRoute exact path='/external-api'>
              <ExternalApi />
            </PrivateRoute>
            <PrivateRoute exact path='/messages/create'>
              <CreateView />
            </PrivateRoute>
            <PrivateRoute exact path='/messages/:id'>
              <DetailView />
            </PrivateRoute>
            <Redirect exact from='/messages' to='/' />
            <Route >
              <NoMatch />
            </Route>
          </Switch>
          <Footer />
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
