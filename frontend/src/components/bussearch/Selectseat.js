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
  console.log(chooseemail);
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
  };
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
