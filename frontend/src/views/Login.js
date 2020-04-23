import React from 'react';

import { useAuth0 } from '../utils/react-auth0-spa';
import Loading from '../components/Loading';

const Profile = () => {
  const { loading, user, loginWithRedirect } = useAuth0();

  if (loading) return <Loading />;

  return (
    <div className="row">
      <div className="col-md-6 m-auto">
        <div className="card mb-3">
          <h2 className="card-header text-center">Login</h2>
          <div className="card-body">
            <h3 className="card-title text-center">{}</h3>
          </div>
          <button onClick={() => loginWithRedirect({})} className="btn btn-secondary">
            Login
        </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
