import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import history from '../utils/history';
import Message from '../components/Message';
import Loading from '../components/Loading';

export const GET_MESSAGES = gql`
query ListViewSearch($search: String, $cursor: String) {
  allMessages(orderBy: "-creation_date", first: 10, message_Icontains: $search, after: $cursor) @connection(key: "allMessages", filter: ["search"]){
    totalCount
    edges {
      node {
        id
        message
        user {
          nick
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
`;

// custom hook that builds on useLocation to parse query string
const useSearch = () => {
  return new URLSearchParams(useLocation().search);
};

const ListView = () => {
  const searchString = useSearch();
  const searchInputRef = useRef(null);
  // const [searchQuery, setSearchQuery] = useState('');
  // const history = useHistory();
  // const location = useLocation();
  const { loading, error, data, fetchMore } = useQuery(GET_MESSAGES, {
    variables: { search: searchString.get('search') || '', },
    // variables: { search: searchQuery, },
    // refresh every 60s
    // pollInterval: 60000,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const handleSubmit = e => {
    e.preventDefault();
    const query = `?search=${searchInputRef.current.value}`;
    history.push(`/${query}`);
    // setSearchQuery(searchInputRef.current.value);
  };

  const handleReset = e => {
    e.preventDefault();
    searchInputRef.current.value = '';
    history.push(`/`);
  };

  const loadMore = () => {
    fetchMore({
      variables: {
        cursor: data.allMessages.pageInfo.endCursor,
      },
      // updateQuery: (prev, next) => {
      updateQuery: (previousResult, { fetchMoreResult, variables }) => {
        const newEdges = fetchMoreResult.allMessages.edges;
        const pageInfo = fetchMoreResult.allMessages.pageInfo;
        return newEdges.length
          ? {
            // new messages at the end of the list,
            // update `pageInfo`: new `endCursor`, `hasNextPage`
            allMessages: {
              // '__typename': a meta field to get the name of the object type (Relay?)
              __typename: previousResult.allMessages.__typename,
              edges: [...previousResult.allMessages.edges, ...newEdges],
              pageInfo,
            },
          }
          : previousResult;
      }
    });
  };

  if (loading || error) return <Loading />;
  // if (error) return `Error! ${error.message}`;

  return (
    <>
      <div className="row">
        <div className="col">
          <h1 className="mb-4 text-center">Messages</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h2 className="mt-4 font-weight-light">Search:</h2>
          <div className="col-md-8 m-auto">
            <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit} onReset={handleReset}>
              <input
                className="form-control mr-sm-2 border-secondary"
                type="search"
                ref={searchInputRef} />
              <div className="btn-group" role="group">
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Go</button>
                <button className="btn btn-outline-danger my-2 my-sm-0" type="reset">Reset</button>
              </div>
            </form>
          </div>
          <h2 className="mt-4 font-weight-light">Feed:</h2>
          <div className="col-md-8 m-auto">
            <div className="list-group">
              {data.allMessages.edges.map(item => (
                <Message
                  key={item.node.id}
                  item={item.node} />
              ))}
            </div>
            <div className="m-3">
              {data.allMessages.pageInfo.hasNextPage &&
                <button onClick={loadMore} className="btn btn-outline-primary">Load more...</button>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListView;
