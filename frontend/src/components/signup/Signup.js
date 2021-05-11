import React, { Component } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import "./signup.css";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      gender: "",
      email: "",
      phoneNo: "",
      password: "",
      confirmPassword: "",
      error: ""
    };
  }

  isAnyFieldEmpty = () => {
    const userName = this.state.name;
    const userGender = this.state.gender;
    const userEmail = this.state.email;
    const userPhone = this.state.phoneNo;
    const userPassword = this.state.password;
    const userConfirmpassword = this.state.password;
    if (
      userName.length === 0 ||
      userGender.length === 0 ||
      userEmail.length === 0 ||
      userPhone.length === 0 ||
      userPassword.length === 0 ||
      userConfirmpassword.length === 0
    ) {
      this.setState({ error: true });
      return true;
    }
  };
  isNameValid = () => {
    const userNewname = this.state.name;
    if (userNewname.trim().length < 3) {
      return false;
    }
    return true;
  };
  isFromValid() {
    if (this.isAnyFieldEmpty() === true) {
      this.setState({ error: "Please fill all the fields." });
      return false;
    } else if (this.isNameValid !== true) {
      this.setState({ error: "Name should atleast be 3 characters long." });
      return false;
    } else {
      return true;
    }
  }

  formSubmitHandler() {
    if (this.isFromValid() === true) {
      const newUser = {
        name: this.state.name,
        gender: this.state.gender,
        email: this.state.email,
        phoneNo: this.state.phoneNo,
        password: this.state.password
      };
      console.log(newUser);
      const resp = axios.post("api/singup", newUser);
      if (resp) {
        console.log(resp.token);
      }
    }
  }
  render() {
    let error = null;
    if (this.state.error !== "") {
      error = <span>{this.state.error}</span>;
    }
    return (
      <div className="mainbox">
        <div className="singupbox">
          <from className="singupform">
            <h2>Sing Up</h2>
            <p>Please fill this form to create an account!</p>
            <hr></hr>
            <div className="singuprow">
              <input
                className="singupinfo"
                type="text"
                name="name"
                placeholder="Enter name"
                required="required"
                autoComplete="off"
                onChange={e => {
                  this.setState({ name: e.target.value });
                }}
              />
              <input
                className="singupinfo"
                type="text"
                name="gender"
                placeholder="Gender"
                required="required"
                autoComplete="off"
                onChange={e => {
                  this.setState({ gender: e.target.value });
                }}
              />
              <input
                className="singupinfo"
                type="email"
                placeholder="Enter email"
                name="email"
                required="required"
                autoComplete="off"
                onChange={e => {
                  this.setState({ email: e.target.value });
                }}
              />
              <input
                type="tel"
                className="singupinfo"
                name="phoneNo"
                placeholder="Enter Phone Number"
                required="required"
                autoComplete="off"
                onChange={e => {
                  this.setState({ phoneNo: e.target.value });
                }}
              />
              <input
                type="password"
                className="singupinfo"
                name="password"
                placeholder="Password"
                required="required"
                onChange={e => {
                  this.setState({ password: e.target.value });
                }}
              />
              <input
                type="password"
                className="singupinfo"
                name="password"
                placeholder="Re-enter Password"
                required="required"
                onChange={e => {
                  this.setState({ password: e.target.value });
                }}
              />
              <div className="errorMsg">{error}</div>
              <button
                className="signupbutton"
                type="submit"
                onClick={() => this.formSubmitHandler()}
              >
                Signup
              </button>
              <div className="linkcontainer">
                Already have an account?
                <Link exact to="/">
                  <span> </span>
                  Login-Here
                </Link>
              </div>
            </div>
          </from>
        </div>
      </div>
    );
  }
}

export default Signup;
