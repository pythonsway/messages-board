import React from 'react';
import { NavLink } from 'react-router-dom';

import { useAuth0 } from '../utils/react-auth0-spa';

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, user, logout } = useAuth0();

  const authMenu = (
    <>
      <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
        <li className="nav-item">
          <NavLink to="/messages/create" className="nav-link" activeClassName="active">
            Create Message
          </NavLink>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle font-italic" href="/#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {isAuthenticated && user.nickname}
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <NavLink to="/external-api" className="dropdown-item" activeClassName="active">
              ExternalAPI
            </NavLink>
            <NavLink to="/profile" className="dropdown-item" activeClassName="active">
              Profile
            </NavLink>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={() => logout()}>Logout</button>
          </div>
        </li>
      </ul>
    </>
  );

  const guestMenu = (
    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
      <li className="nav-item">
        <button onClick={() => loginWithRedirect({})} className="btn btn-secondary">
          Login
        </button>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-5">
      <div className="container">
        <NavLink className="navbar-brand" exact={true} to="/">
          Message Board
        </NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarToggler">
          {isAuthenticated ? authMenu : guestMenu}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
