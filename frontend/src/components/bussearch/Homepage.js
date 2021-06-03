import React, { useState } from "react";
import "./home.css";
import Cards from "./Cards";
import Selectseat from "./Selectseat";
import axios from "axios";
import Select from "react-select";
import Navbars from "./Navbars";
import {
  Card,
  CardColumns,
  Jumbotron,
  Col,
  Container,
  Form,
  Button
} from "react-bootstrap";
const cities = [
  { label: "pune", value: "pune" },
  { label: "Nanded", value: "nanded" },
  { label: "Mumbai", value: "mumbai" },
  { label: "Banglore", value: "banglore" },
  { label: "Indore", value: "indore" },
  { label: "Stara", value: "himachal" },
  { label: "Nashik", value: "Nashik" },
  { label: "Banaras", value: "banaras" },
  { label: "Latur", value: "Latur" }
];

const Homepage = () => {
  const list = [];
  const seatInfo = [];
  const closedSeatlist = [];
  const [endCity, setEndcity] = useState("");
  const [startCity, setStartcity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [error, setError] = useState("");
  const [searchResults, setsearchResults] = useState("");
  const [seatsData, setseatsData] = useState("");
  const [seatInformation, setseatInformation] = useState("");
  const [avaliableSeat, setavaliableSeat] = useState("");
  const [closedSeat, setclosedSeat] = useState("");
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
      let today = new Date().toISOString().slice(0, 10);
      if (departureDate < today) {
        setError("Invalid Date");
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
        if (busData) {
          for (var i = 0; i < busData.length; i++) {
            const busId = busData[i]._id;
            const res = await axios.post("api/open", { busId });
            const respons = await axios.post("api/closed", { busId });
            const bookedSeat = respons.data.tickets;
            const bus = res.data.tickets;
            list.push(bus.length);
            closedSeatlist.push(bookedSeat);
            seatInfo.push(bus);
          }
          setseatInformation(seatInfo, closedSeat);
          setavaliableSeat(list);
          setclosedSeat(closedSeatlist);
          return true;
        }
      }
    } catch (error) {
      setError(true);
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
                {" "}
                <Select
                  type="text"
                  placeholder="startCity"
                  autoComplete="off"
                  align="center"
                  options={cities}
                  onChange={e => setStartcity(e.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Select
                  type="text"
                  placeholder="endCity"
                  defaultValue=""
                  autoComplete="off"
                  align="center"
                  options={cities}
                  onChange={e => setEndcity(e.value)}
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
      {error == false && (
        <div>
          {searchResults &&
            searchResults.map((bus, index) => {
              const journeyDate = new Date(bus.departureDate).toDateString();

              return (
                <Card
                  className="shadow p-3 mb-5 bg-white rounded"
                  border="Primary"
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
                        <h5>SeatAvailable</h5>
                        {avaliableSeat[index]}
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
                  {seatsData ? (
                    <div>
                      <Selectseat
                        seatCardOn={seatsData}
                        busDetail={searchResults}
                        seatdetail={seatInformation}
                      ></Selectseat>
                    </div>
                  ) : null}
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};
export default Homepage;
