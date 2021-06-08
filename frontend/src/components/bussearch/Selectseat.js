import React, { useState } from "react";

import { useHistory, withRouter } from "react-router-dom";
import "./home.css";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import {
  Card,
  Image,
  CardColumns,
  Jumbotron,
  Col,
  Container,
  Form,
  Button
} from "react-bootstrap";
const Gender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" }
];

const Selectseat = props => {
  const history = useHistory();
  const selectedseats = [];
  const [bookSeat, setbookSeat] = useState("");
  const [name, setname] = useState("");
  const [gender, setgender] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [chooseemail, setChooseemail] = useState("");
  const [seatSealcted, setseatsealcted] = useState("");
  const [error, setError] = useState("");
  const displaySeats = props.seatdetail;
  const numberOfseats = props.busDetail[0].numberOfseats;
  const busId = props.busDetail[0]._id;
  const openSeat = displaySeats[0];
  const openseatNumber = [];
  openSeat.map(ticket => {
    openseatNumber.push(ticket.seatNo);
  });
  let seatList = [];
  for (let i = 1; i <= numberOfseats; i++) {
    if (openseatNumber.includes(i)) {
      seatList.push(
        <Image
          className={seatSealcted === i ? "active" : ""}
          src={"https://static.thenounproject.com/png/661611-200.png"}
          alt=""
          style={{
            width: "10%"
          }}
          key={i}
          onClick={() => inputChangeHandler(i)}
        />
      );
    } else {
      seatList.push(
        <Image
          src={"https://static.thenounproject.com/png/661611-200.png"}
          alt=""
          className="img-responsive"
          style={{
            width: "10%",
            border: "5px solid red"
          }}
          key={i}
        />
      );
    }
  }
  const inputChangeHandler = i => {
    setseatsealcted(i);
    openSeat.map(ticket => {
      if (i === ticket.seatNo) {
        // selectedseats.push(i);
        setbookSeat(i);
      }
    });
  };
  const handleChangePassemail = () => {
    setEmail(localStorage.getItem("email"));
  };
  const data = [
    {
      seatNo: bookSeat,
      name,
      gender,
      isBooked: true,
      phoneNo,
      email
    }
  ];
  const fromSubmitHandler = async () => {
    try {
       if (name.length === 0 || gender.length === 0 || gender.length === 0) {
         setError("Please fill all the fields");
         return false;
       }
      var pattern = new RegExp(/^[0-9\b]+$/);
      if (phoneNo.length === 10 && pattern.test(phoneNo)) {
        var pattern = new RegExp(
          /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        );
        if (!pattern.test(email)) {
          setError("Please enter valid Email");
          return false;
        }
        const response = await axios.put(
          "api/book/" + busId,
          { data },
          {
            headers: {
              "x-auth-token": localStorage.getItem("login")
            }
          }
        );
        if (response) {
          props.history.push({
            pathname: "/ticketdetail",
            state: { detail: response.data.ticketList }
          });
          return true;
        }
      }
      else {
        setError("Please enter valid phone number"); 
      }
    }
    catch (err)
    {
     return false 
    }
  }
    
  return (
    <div>
      <div className="divbody">
        <div className="cardbody">
          <Card
            border="Primary"
            style={{
              width: "60%",
            }}
          >
            <div
              style={{
                display: "flex",
              }}
            >
              <div>
                <Card.Img
                  src="https://static.thenounproject.com/png/790455-200.png"
                  style={{
                    marginTop: "200%",
                    width: "150%",
                  }}
                />
              </div>
              <div className="busseats">{seatList}</div>
            </div>
          </Card>
        </div>
        <div>
          {bookSeat && (
            <Card className="container p-5">
              <div className="bookingdata">
                <input
                  className="data"
                  type="text"
                  placeholder="Enter Name"
                  autoComplete="off"
                  name="name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
              </div>
              <div className="bookingdata">
                <Select
                  className="selectbox"
                  type="text"
                  placeholder="Gender"
                  autoComplete="off"
                  name="gender"
                  options={Gender}
                  onChange={(e) => setgender(e.value)}
                />
              </div>{" "}
              <div className="bookingdata">
                <input
                  className="data"
                  type="text"
                  name="phoneNo"
                  autoComplete="off"
                  placeholder="Enter the phone No"
                  value={phoneNo}
                  onChange={(e) => setphoneNo(e.target.value)}
                />
              </div>
              <div>Email</div>
              <div>
                <label>
                  <input
                    type="radio"
                    value={email}
                    name="email"
                    onClick={() => handleChangePassemail()}
                  />
                  Default Email
                </label>
                <label>
                  <input
                    className="data"
                    type="radio"
                    name="email"
                    onClick={() => setChooseemail(true)}
                  />
                  another Email
                </label>
                {chooseemail && (
                  <div className="bookingdata">
                    <input
                      className="data"
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
              </div>
              {error && <div style={{ color: `red` }}>{error}</div>}
              <Button type="button" onClick={() => fromSubmitHandler()}>
                Book
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Selectseat);
