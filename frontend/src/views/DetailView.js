import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import timeDifferenceForDate from '../utils/timeFormat';
import Loading from '../components/Loading';

// 'DetailView' query name is arbitrary, and has one variable 'id'
const GET_MESSAGE = gql`
query DetailView($id: ID!) {
  message(id: $id) {
    __typename
    id
    message
    creationDate
    user {
      nick
    }
    userLiked
    likes {
      totalCount
      edges {
        node {
          id
        }
      }
    }
  }
}
`;

const CREATE_LIKE = gql`
mutation createLike($input: CreateLikeMutationInput!) {
  createLike(input: $input) {
    likesNumber
    message {
      __typename
      id
      message
      creationDate
      likes {
        totalCount
        edges {
          node {
            id
          }
        }
      }
    }
  }
}
`;

const DetailView = () => {
  const { id } = useParams();
  // const location = useLocation();
  // const history = useHistory();

  const { loading, error, data } = useQuery(GET_MESSAGE, {
    variables: { id },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [createLike] = useMutation(CREATE_LIKE,
  );

  const handleClick = e => {
    const newCount = data.message.likes.totalCount + 1;
    createLike({
      variables: { input: { messageId: data.message.id } },
      optimisticResponse: {
        __typename: 'CreateLikeMutation',
        createLike: {
          __typename: 'CreateLikeMutationPayload',
          likesNumber: newCount,
          message: data.message
        }
      },
      // temporary solution, makes additional request
      refetchQueries: [
        {
          query: GET_MESSAGE,
          variables: { id }
        }
      ],
      update: (cache, { data: { createLike } }) => {
        // const { message } = cache.readQuery({ query: GET_MESSAGE });
        const newLike = { node: { ...createLike } };
        cache.writeQuery({
          query: GET_MESSAGE,
          variables: { id },
          data: { ...data, likes: { totalCount: createLike.likesNumber, edges: [...data.message.likes.edges, newLike] } }
        });
      },
    });
  };

  if (loading || error) return <Loading />;
  // if (error) return `Error! ${error.message}`;

  return (
    <div className="row">
      <div className="col-md-8 m-auto">
        <div className="card mb-3">
          <h2 className="card-header text-center">Meaasage</h2>
          <div className="card-body">
            <h3 className="card-title text-center">{`"${data.message.message}"`}</h3>
            <h4 className="card-subtitle text-muted">
              <span className="font-weight-lighter">by: </span>
              {data.message.user.nick}
            </h4>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Likes: {data.message.likes.totalCount}</li>
            <li className="list-group-item">
              <button type="button" className="btn btn-primary" disabled={data.message.userLiked} onClick={handleClick}>
                {data.message.userLiked ? 'Liked' : 'Like'}
              </button>
            </li>
          </ul>
          <div className="card-footer text-muted">
            {timeDifferenceForDate(data.message.creationDate)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
