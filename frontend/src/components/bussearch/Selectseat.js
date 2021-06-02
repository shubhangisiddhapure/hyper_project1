import React, { useState } from "react";
import "./home.css";
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
const bookingstatus = [
  { value: "true", label: "True" },
  { value: "false", label: "false" }
];
const Selectseat = props => {
  const selectedseats = [];
  const [bookSeat, setbookSeat] = useState("");
  const [name, setname] = useState("");
  const [gender, setgender] = useState("");
  const [isBooked, setisBooked] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [seatSealcted, setseatsealcted] = useState("");
  const displaySeats = props.seatdetail;
  const displayBookedseats = props.bookedseats;
  const numberOfseats = props.busDetail[0].numberOfseats;
  const busId = props.busDetail[0]._id;
  console.log(busId);
  const openSeat = displaySeats[0];
  const openseatNumber = [];
  openSeat.map(ticket => {
    openseatNumber.push(ticket.seatNo);
  });
  console.log(openSeat[0].isBooked);
  const seat = i => {
    setseatsealcted(i);
    openSeat.map(ticket => {
      if (i === ticket.seatNo) {
        // selectedseats.push(i);
        // setseatsealcted(true);
        setbookSeat(i);
      }
    });
  };
  const data = [
    {
      seatNo: bookSeat,
      name,
      gender,
      isBooked,
      phoneNo,
      email
    }
  ];
  const bookTicket = async () => {
    const response = await axios.put(
      "api/book/" + busId,
      { data },
      {
        headers: {
          "x-auth-token": localStorage.getItem("login")
        }
      }
    );
    console.log(response);
    if (response) {
      alert("seat is booked");
    }
  };
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
          onClick={() => seat(i)}
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
  return (
    <div>
      <div
        border="None"
        style={{
          width: "100%",
          backgroundColor: "gainsboro",
          padding: "4%"
        }}
      >
        <div className="cardbody">
          <Card
            border="Primary"
            style={{
              width: "60%"
            }}
          >
            <div
              style={{
                display: "flex"
              }}
            >
              <div>
                <Card.Img
                  src="https://static.thenounproject.com/png/790455-200.png"
                  style={{
                    marginTop: "200%",
                    width: "150%"
                  }}
                />
              </div>
              <div className="busseats">{seatList}</div>
            </div>
          </Card>
        </div>
      </div>

      {bookSeat && (
        <Card
          border="Primary"
          style={{
            width: "30%"
          }}
        >
          {" "}
          <input
            type="text"
            placeholder="Enter Name"
            autoComplete="off"
            name="name"
            value={name}
            onChange={e => setname(e.target.value)}
          />
          <Select
            type="text"
            placeholder="Gender"
            autoComplete="off"
            name="gender"
            options={Gender}
            onChange={e => setgender(e.value)}
          />{" "}
          <Select
            type="text"
            name="isBooked"
            autoComplete="off"
            placeholder="bookingstatus"
            options={bookingstatus}
            onChange={e => setisBooked(e.value)}
          />
          <input
            type="text"
            name="phoneNo"
            autoComplete="off"
            placeholder="Enter the phone No"
            value={phoneNo}
            onChange={e => setphoneNo(e.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            autoComplete="off"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="button" onClick={() => bookTicket()}>
            Book
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Selectseat;
