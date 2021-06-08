/** @format */

import React, { useState } from "react";
import Navbars from "./Navbars";
import Ticketpdf from "./Ticketpdf";
import { Card, Table, Container } from "react-bootstrap";
import "./home.css";
const Ticketdetail = (props) => {
  const ticketInfo = props.location.state.detail;
  return (
    <div className="contaire">
      <Container>
        <Navbars />
      </Container>
      {ticketInfo &&
        ticketInfo.map((ticket, index) => {
          const journeyDate = new Date(ticket.busId.arrivalDate).toDateString();
          const departureTiming = new Date(
            ticket.busId.departureTiming
          ).toLocaleString("en-US", { hour: "numeric", hour12: true });
          const seatNo = ticket.seatNo;
          return (
            <div className="Ticketpage">
              <h4>Ticket Booked successfully</h4>
              <Card className="container p-5">
                <p>Your Ticket Detail </p>
                <Table bordered size="sm">
                  <tbody>
                    <tr>
                      <td colSpan="2">
                        <b>
                          <span>
                            {ticket.busId.startCity} to {ticket.busId.endCity}
                          </span>
                          <span>{journeyDate}</span>
                          <span>
                            {ticket.busId.name} Bus({ticket.busId.description})
                          </span>
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td>Passenger Name</td>
                      <td>{ticket.passenger[index].name} </td>
                    </tr>
                    <tr>
                      <td>Phone Number</td>
                      <td>{ticket.passenger[index].phoneNo} </td>
                    </tr>
                    <tr>
                      <td>Seat Number</td>
                      <td>{seatNo} </td>
                    </tr>
                    <tr>
                      <td>Total Fare</td>
                      <td>{ticket.busId.costOfticket} </td>
                    </tr>
                    <tr>
                      <td>Bus Number</td>
                      <td>{ticket.busId.busNumber} </td>
                    </tr>
                    <tr>
                      <td>Departure Timing</td>
                      <td>{departureTiming} </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
              <p>
                <i>
                  <b>
                    Now,Your ticket also available on your email, please check
                    your Email !
                    <Ticketpdf bookedTicket={ticketInfo}></Ticketpdf>
                  </b>
                </i>
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default Ticketdetail;
