import React from "react";
import { Card } from "react-bootstrap";
const Selectseat = () => {
  return (
    <div className="col d-flex justify-content-center">
      <Card
        className="shadow p-3 mb-5 bg-white rounded"
        border="Primary"
        style={{
          width: "80%"
        }}
      >
        <Card.Body>
          <b>available seats</b>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Selectseat;
