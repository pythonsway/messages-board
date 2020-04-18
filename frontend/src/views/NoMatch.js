import React from 'react';
import { Link } from 'react-router-dom';

const NoMatch = () => (
  <div className="row">
    <div className="col mx-auto">
      <div className="card bg-light card-body mt-5">
        <h2 className="mb-4">Oops, something went wrong</h2>
        <p>No match for <code>{window.location.pathname}</code></p>
      </div>
      <div className="m-4">
        <Link className="btn btn-outline-secondary" to="/">Go home</Link>
      </div>
    </div>
  </div>
);

export default NoMatch;