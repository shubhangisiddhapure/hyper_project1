import React, { useState } from "react";
import "./home.css";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import {
  Card,
  CardColumns,
  Jumbotron,
  CardDeck,
  Row,
  Col,
  Container,
  Navbar,
  Nav,
  Form,
  Dropdown,
  Button,
  InputGroup,
  FormControl,
  DropdownButton
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { alignPropType } from "react-bootstrap/esm/DropdownMenu";
const Homepage = () => {
  const history = useHistory();
  const [endCity, setEndcity] = useState("");
  const [startCity, setStartcity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [error, setError] = useState("");
  const [searchResults, setsearchResults] = useState("");
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
      setError("Bus not available");
      console.log(error);
    }
  };

  return (
    <div>
      <Container>
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
      {searchResults &&
        searchResults.map((bus, index) => {
          const journeyDate = new Date(bus.departureDate).toDateString();
          return (
            <Card
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
                <Card.Title>Bus{index + 1}</Card.Title>
                <Card.Body>
                  <p>BusName:{bus.name}</p>
                  <p>Bus.Number:{bus.busNumber}</p>
                  <p> From:{bus.startCity}</p>
                  <p> To:{bus.endCity}</p>
                  <p>DepartureDate: {journeyDate}</p>
                  <Button variant="primary">Select</Button>
                </Card.Body>
              </CardColumns>
            </Card>
          );
        })}
    </div>
  );
};
export default Homepage;
