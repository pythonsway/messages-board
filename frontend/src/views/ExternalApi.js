import React, { useState } from 'react';

import { useAuth0 } from '../utils/react-auth0-spa';

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const { getTokenSilently, user } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch('/api/private', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseData = await response.json();
      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="row">
      <div className="col mx-auto">
        <div className="card bg-light card-body mt-5">
          <h2 className="mb-4">External API</h2>
          <div className="card-body">
            Your profile
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><code>{JSON.stringify(user, null, 2)}</code></li>
          </ul>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <button type="button" className="btn btn-outline-info" onClick={callApi}>
                Ping API
          </button>
            </li>
            <li className="list-group-item">{showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExternalApi;
