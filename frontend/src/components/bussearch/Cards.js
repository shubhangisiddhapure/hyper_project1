import React from "react";

import { Card } from "react-bootstrap";
const Cards = () => {
  return (
    <div className="col d-flex justify-content-center">
      {" "}
      <Card
        className="shadow p-3 mb-5 bg-white rounded"
        border="Primary"
        style={{
          width: "30%"
        }}
      >
        <Card.Img variant="top" src="https://www.redbus.in/images/no_bus.png" />
        <Card.Body>
          <b>Oops! No buses found.</b>
          <p>No routes available</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Cards;
