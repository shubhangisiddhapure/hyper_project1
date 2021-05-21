import React, { useState } from "react";
import "./home.css";
import {
  Jumbotron,
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
const Homepage = () => {
  const history = useHistory();
  const [endCity, setEndcity] = useState("");
  const [startCity, setStartcity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [error, setError] = useState("");
  const Postdata = async () => {
    try {
      if (
        endCity.length === 0 ||
        startCity.length === 0 ||
        departureDate.length === 0
      ) {
        setError("Please fill all the fields");
        return false;
      }
    } catch (error) {
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
        </Navbar>
      </Container>
      <Form>
        <Container>
          <div className="jumbotron">
            <Form.Row className="rows">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Control
                  type="text"
                  name="startCity"
                  placeholder="Enter StartCity"
                  value={startCity}
                  onChange={e => setStartcity(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Control
                  type="text"
                  name="ednCity"
                  placeholder="Enter EndCity"
                  value={endCity}
                  onChange={e => setEndcity(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridZip">
                <Form.Control
                  type="date"
                  name="date"
                  value={departureDate}
                  onChange={e => setDepartureDate(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Button variant="primary" type="submit" onClick={() => Postdata()}>
              Search
            </Button>
          </div>
        </Container>
      </Form>
    </div>
  );
};
export default Homepage;
