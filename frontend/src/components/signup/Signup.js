import React, { Component } from "react";
import Select from "react-select";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import "./signup.css";
const Gender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" }
];
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      gender: null,
      email: "",
      phoneNo: "",
      password: "",
      confirmPassword: "",
      error: "",
      signUpdone: false
    };
  }
  handleChange = gender => {
    this.setState({ gender });
    // console.log("Option selected:", selectedGender);
  };
  isAnyFieldEmpty = () => {
    const userName = this.state.name;
    const userGender = this.state.gender;
    const userEmail = this.state.email;
    const userPhone = this.state.phoneNo;
    const userPassword = this.state.password;
    const userConfirmpassword = this.state.confirmPassword;
    if (
      userName.length === 0 ||
      userGender.length === 0 ||
      userEmail.length === 0 ||
      userPhone.length === 0 ||
      userPassword.length === 0 ||
      userConfirmpassword.length === 0
    ) {
      console.log(this.state.gender);
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
  isphoneNoValid = () => {
    var pattern = new RegExp(/^[0-9\b]+$/);
    const phoneNo = this.state.phoneNo;
    if (phoneNo.length === 10 && pattern.test(phoneNo)) {
      return true;
    }
    return false;
  };
  isEmailvalid = () => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    const userNewemail = this.state.email;
    if (!pattern.test(userNewemail)) {
      return false;
    }
    return true;
  };
  isPasswordvalid = () => {
    const userNewpassword = this.state.password;
    if (userNewpassword.trim().length < 5) {
      return false;
    }
    return true;
  };
  doesPasswordmatches = () => {
    const password = this.state.password;
    const newConfirmpassword = this.state.confirmPassword;
    if (password === newConfirmpassword) {
      return true;
    }
    return false;
  };
  isFromValid = () => {
    if (this.isAnyFieldEmpty() === true) {
      this.setState({ error: "Please fill all the fields." });
      return false;
    } else if (this.isNameValid() === false) {
      this.setState({ error: "Name should atleast be 3 characters long." });
      return false;
    } else if (this.isphoneNoValid() !== true) {
      this.setState({ error: "Please enter valid phone number" });
      return false;
    } else if (this.isEmailvalid() !== true) {
      this.setState({ error: "Please enter valid Email" });
      return false;
    } else if (this.isPasswordvalid() !== true) {
      this.setState({ error: "Please enter valid password" });
      return false;
    } else if (this.doesPasswordmatches() !== true) {
      this.setState({ error: "Please enter valid password" });
      return false;
    } else {
      return true;
    }
  };

  async formSubmitHandler() {
    try {
      if (this.isFromValid() === true) {
        const newUser = {
          name: this.state.name,
          gender: JSON.stringify(this.state.gender.value),
          email: this.state.email,
          phoneNo: this.state.phoneNo,
          password: this.state.password
        };
        console.log(newUser);
        const resp = await axios.post("api/signup", newUser);
        let data = resp.data;
        if (data) {
          alert("Account Crated successfully");
          this.setState({ signUpdone: true });
          return true;
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert("User alreay exist !");
      }
    }
  }
  render() {
    const { gender } = this.state;
    let error = null;
    if (this.state.error !== "") {
      error = <span>{this.state.error}</span>;
    }
    if (this.state.signUpdone === true) {
      return <Redirect to="/" />;
    }
    return (
      <div className="mainbox">
        <div className="singupbox">
          <from className="singupform">
            <h2>Sign Up</h2>
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
              <Select
                className="singdrop"
                options={Gender}
                placeholder="Gender"
                value={gender}
                onChange={this.handleChange}
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
                type="text"
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
                name="confirmPassword"
                placeholder="Re-enter Password"
                required="required"
                onChange={e => {
                  this.setState({ confirmPassword: e.target.value });
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
