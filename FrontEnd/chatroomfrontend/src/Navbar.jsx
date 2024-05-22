import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export class NavBar extends Component {
  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary p-2">
          <a className="navbar-brand" href="#">
            SplitIt
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              {this.props.isLoggedIn == false ? (
                <li className="nav-item active">
                  <NavLink to="/" className="nav-link">
                    Login <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
              ) : (
                ""
              )}

              {this.props.isLoggedIn == true ? (
                <li>
                  <NavLink to="/users" className="nav-link">
                    Users <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
              ) : (
                ""
              )}

              {this.props.isLoggedIn == true ? (
                <li>
                  <NavLink to="/cart" className="nav-link">
                    Split Now <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}