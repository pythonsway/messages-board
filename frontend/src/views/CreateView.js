import React, { useRef } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import history from '../utils/history';
import { useAuth0 } from '../utils/react-auth0-spa';
import Loading from '../components/Loading';
import { GET_MESSAGES } from './ListView';

const CREATE_MESSAGE = gql`
mutation CreateView($input: CreateMessageMutationInput!) {
  createMessage(input: $input) {
    message {
      id
      message
    }
  }
}
`;

const CreateView = () => {
  const { user } = useAuth0();
  const messageInputRef = useRef(null);

  const [createMessage, { loading, error, data }] = useMutation(CREATE_MESSAGE,
    // Updating the cache after a mutation
    {
      refetchQueries: ['ListViewSearch']
    }
  );

  const handleSubmit = e => {
    e.preventDefault();
    // ref: instead 'e.target.value'
    createMessage({
      variables: {
        input: {
          message: messageInputRef.current.value,
          nick: user.nickname,
        }
      },
      optimisticResponse: {
        __typename: 'CreateMessageMutation',
        createMessage: {
          __typename: 'CreateMessageMutationPayload',
          message: messageInputRef.current.value,
          nick: user.nickname,
        }
      },
      update: (cache, { data: { createMessage } }) => {
        const { allMessages } = cache.readQuery({ query: GET_MESSAGES });
        const newMessage = { node: { ...createMessage.message } };
        cache.writeQuery({
          query: GET_MESSAGES,
          data: { ...data, allMessages: { edges: [...allMessages.edges, newMessage] } }
        });
      },
    });
    messageInputRef.current.value = '';
    history.push('/');
  };

  if (loading || error) return <Loading />;
  // if (error) return `Error! ${error.message}`;

  return (
    <div className="row">
      <div className="col-md-8 m-auto">
        <div className="card bg-light card-body mt-5">
          <h2 className="text-center">Create Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Message</label>
              <textarea
                required
                rows="3"
                type="text"
                className="form-control form-control-lg"
                ref={messageInputRef} />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-outline-primary">
                Add
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateView;