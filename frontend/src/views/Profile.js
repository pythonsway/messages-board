import React from 'react';

import { useAuth0 } from '../utils/react-auth0-spa';
import timeDifferenceForDate from '../utils/timeFormat';
import Loading from '../components/Loading';

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) return <Loading />;

  return (
    <div className="row">
      <div className="col-md-8 m-auto">
        <div className="card mb-3">
          <h2 className="card-header text-center">Profile</h2>
          <div className="card-body">
            <h3 className="card-title text-center">{user.name}</h3>
          </div>
          <img src={user.picture} className="mx-auto my-2 img-thumbnail" width="120px" alt="Profile"></img>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><span className="font-weight-bolder">e-mail: </span>{user.email}</li>
            <li className="list-group-item"><span className="font-weight-bolder">nickname: </span>{user.nickname}</li>
            <li className="list-group-item"><span className="font-weight-bolder">updated: </span>{timeDifferenceForDate(user.updated_at)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
