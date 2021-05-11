import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import "./login.css";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: false,
      tokenError: false,
      formValidation: false,
      login: ""
    };
  }
  isFormValid = () => {
    const userEmail = this.state.email;
    const userPassword = this.state.password;
    if (userEmail.length === 0 || userPassword.length === 0) {
      this.setState({ error: true });
      return false;
    } else {
      this.setState({ error: false, formValidation: true });
      return true;
    }
  };
  islogin() {
    if (this.isFormValid() === true) {
      console.log("state", this.state);
      fetch("http://localhost:7900/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state)
      }).then(result => {
        result.json().then(resp => {
          console.log(resp.token);
          localStorage.setItem("login", JSON.stringify(resp.token));
          if (!resp.token) {
            console.log("Invalid input");
            return this.setState({ tokenError: true });
          } else {
            this.setState({ tokenError: false, login: true });
          }
        });
      });
    }
  }

  render() {
    if (this.state.login === true) {
      return <Redirect to="/homepage" />;
    }
    return (
      <div className="maincontaire">
        <div className="loginbox">
          <div className="loginfrom">
            <h2>Welcome to Shree Services</h2>
            <p>
              <b>Log-In Here</b>
            </p>
            <input
              className="email"
              type="email"
              placeholder="Enter email"
              onChange={e => {
                this.setState({ email: e.target.value });
              }}
            />
            <br></br>
            <input
              className="password"
              type="password"
              placeholder="Enter password"
              onChange={e => {
                this.setState({ password: e.target.value });
              }}
            />
            {this.state.error === true ? (
              <span className="validationError">
                Please fill all the fields.
              </span>
            ) : (
              ""
            )}
            {this.state.tokenError === true ? (
              <span className="validationError">Invalid credentials.</span>
            ) : (
              ""
            )}
            <br></br>
            <button
              className="loginbutton"
              type="submit"
              onClick={() => this.islogin()}
            >
              Login
            </button>
            <br></br>
            <div className="container">
              Don't have an account? <span></span>
              <Link exact to="/signup">
                Signup
              </Link>
            </div>
            <div className="container">
              <Link exact to="/frogetpassword">
                Forget Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
