import React from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";
import { Navbar, Nav, Form } from "react-bootstrap";
const Navbars = () => {
  return (
    <div>
      {" "}
      <Navbar
        expand="lg"
        fixed="top"
        bg="primary"
        variant="dark"
        classname="Navbar"
        style={{ width: "100%", height: "10%" }}
      >
        <img
          alt=""
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3G82LYc9STO2TjyhFF_5dfoLqEo7MqSM51A&usqp=CAU"
          width="100"
          height="55"
          className="mr-auto"
        />
        <h5>
          <Link exact to="/">
            <p style={{ color: "white" }}>Logout</p>
          </Link>
        </h5>
      </Navbar>
    </div>
  );
};

export default Navbars;
