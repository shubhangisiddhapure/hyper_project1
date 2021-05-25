import React, { useState } from "react";
import "./home.css";
import Cards from "./Cards";
import Selectseat from "./Selectseat";
import axios from "axios";
import Navbars from "./Navbars";
import {
  Card,
  CardColumns,
  Jumbotron,
  CardDeck,
  Row,
  CardGroup,
  Col,
  Container,
  Form,
  Dropdown,
  Button
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();
  const [endCity, setEndcity] = useState("");
  const [startCity, setStartcity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [error, setError] = useState("");
  const [searchResults, setsearchResults] = useState("");
  const [seatsData, setseatsData] = useState("");
  const postData = async () => {
    console.log("endCity");
    try {
      if (
        endCity.length === 0 ||
        startCity.length === 0 ||
        departureDate.length === 0
      ) {
        setError("Please fill all the fields");
        return false;
      }
      const resp = await axios.post("api/busSearch", {
        endCity,
        startCity,
        departureDate
      });
      if (resp) {
        const data = resp.data;
        const busData = data.buses;
        setsearchResults(busData);
        setError("");
        return true;
      }
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };
  const seatData = () => {
    setseatsData(true);
  };
  return (
    <div>
      <Container>
        <Navbars />
      </Container>
      <Form>
        <Container>
          <div className="jumbotron" style={{ backgroundColor: "transparent" }}>
            <Form.Row className="rows">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Control
                  type="text"
                  name="startCity"
                  placeholder="Enter StartCity"
                  autoComplete="off"
                  value={startCity}
                  onChange={e => setStartcity(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Control
                  type="text"
                  name="ednCity"
                  autoComplete="off"
                  placeholder="Enter EndCity"
                  value={endCity}
                  onChange={e => setEndcity(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridZip">
                <Form.Control
                  type="date"
                  name="date"
                  autoComplete="off"
                  value={departureDate}
                  onChange={e => setDepartureDate(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            {error && <div style={{ color: `red` }}>{error}</div>}
            <Button variant="primary" type="button" onClick={() => postData()}>
              Search
            </Button>
          </div>
        </Container>
      </Form>
      {error == true && (
        <div style={{ color: `red` }}>
          <Cards />
        </div>
      )}
      {searchResults &&
        searchResults.map((bus, index) => {
          const journeyDate = new Date(bus.departureDate).toDateString();
          return (
            <Card
              className="shadow p-3 mb-5 bg-white rounded"
              border="success"
              style={{
                width: "100%"
              }}
            >
              <CardColumns>
                {
                  <Card.Img
                    variant="top"
                    src="http://cdn.cnn.com/cnnnext/dam/assets/200826183306-adventures-overlandimage-from-ios.jpg"
                  />
                }
                <Card.Title className="col d-flex justify-content-center">
                  Bus{index + 1}
                </Card.Title>
                <br></br>
                <Card.Body className="carddata">
                  <div className="rowdata">
                    <h5>BusName</h5>
                    {bus.name}
                  </div>
                  <div className="rowdata">
                    <h5>BusType</h5>
                    {bus.description}
                  </div>
                  <div className="rowdata">
                    <h5>BusNumber</h5>
                    {bus.busNumber}
                  </div>{" "}
                  <div className="rowdata">
                    <h5>From</h5>
                    {bus.startCity}
                  </div>
                  <div className="rowdata">
                    <h5> To</h5>
                    {bus.endCity}
                  </div>
                  <div className="rowdata">
                    <h5>DepartureDate</h5> {journeyDate}
                  </div>
                  <div className="rowdata">
                    <h5>Seats</h5> {bus.numberOfseats}
                  </div>
                  <div className="rowdata">
                    <h5>Fare</h5>
                    {bus.costOfticket}
                  </div>
                </Card.Body>
                <Button
                  variant="primary"
                  size="lg"
                  type="button"
                  onClick={() => seatData()}
                  className="cardbutton"
                >
                  VIEW SEATS
                </Button>
              </CardColumns>
            </Card>
          );
        })}
      {seatsData && (
        <div>
          <Selectseat></Selectseat>
        </div>
      )}
    </div>
  );
};
export default Homepage;
