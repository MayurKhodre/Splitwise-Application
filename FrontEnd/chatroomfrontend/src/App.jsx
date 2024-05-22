import React, { Component } from "react";
import { NavBar } from "./Navbar";
import Login from "./Login";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  render() {
    return (
      <BrowserRouter>
        <NavBar isLoggedIn={this.state.isLoggedIn} />
        <div className="container-fluid">
          <Routes>
            <Route
              path="/"
              element={
                <Login updateIsLoggedInStatus={this.updateIsLoggedInStatus} />
              }
            />
            {/* <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="*" element={<NoMatchPage />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  updateIsLoggedInStatus = (status) => {
    this.setState({ isLoggedIn: status });
  };
}
