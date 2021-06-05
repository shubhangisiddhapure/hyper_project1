const express = require("express");
const Ticket = require("../model/ticket.js");
const Bus = require("../model/Bus.js");
const User = require("../model/user.js");
const auth = require("../middleware/auth.js");
const { body } = require("express-validator");
const nodemailer = require("nodemailer");
const sendgridTransort = require("nodemailer-sendgrid-transport");
const process = require("process");
const apiKey = process.env.SENDGRIDSECRT;
const router = express.Router();
const transporter = nodemailer.createTransport(
  sendgridTransort({
    auth: {
      api_key: apiKey,
    },
  })
);

//Book the ticket
const selectedSeat = [];
router.put(
  "/book/:busId",
  auth,
  [
    body("setaNo")
      .not()
      .isEmpty()
      .withMessage("seatNo is required"),

    body("isBooked")
      .not()
      .isEmpty()
      .withMessage("isBooeed is required")
  ],
  async (req, res) => {
    try {
      const data = req.body;
      const newUser = data;
      const busId = req.params.busId;
      const businformation = await Ticket.find({ busId });
      // console.log(businformation.length)
      if (businformation.length === 0) {
        return res.status(400).json({ msg: "Ticket not found for this bus" });
      }
      const dataLength = newUser.data.length;
      const seat = [];
      const bookedSeatlist = [];
      const invalidSeatno = [];
      for (i = 0; i < dataLength; i++) {
        // checking the seat number is duplicate or not
        if (seat.includes(newUser.data[i].seatNo)) {
          const duplicateSeatNo = newUser.data[i].seatNo;
          return res.status(400).json({
            msg: "Entered seat is dupalicate,choose another seat",
            duplicateSeatNo
          });
        } else {
          seat.push(newUser.data[i].seatNo);
          // if(seat[i]<1 || seat[i]>businformation.length)
          // {
          //     invalidSeatno.push(seat[i])
          // }
          const seats = await Ticket.findOne({ busId, seatNo: { $in: seat } });
          if (!seats) {
            invalidSeatno.push(seat[i]);
          } else {
            if (seats.isBooked === true) {
              bookedSeatlist.push(seat[i]);
            }
          }
        }
      }
      if (invalidSeatno.length !== 0) {
        return res
          .status(400)
          .json({ msg: "Entered seat number is inavlid", invalidSeatno });
      }
      if (bookedSeatlist.length !== 0) {
        return res.status(400).json({
          msg: "This seats are booked,choose another seats",
          bookedSeatlist
        });
      }
      let userData = await User.findById(req.user.id);
      if (userData) {
        const ticketList = [];
        for (i = 0; i < seat.length; i++) {
          const newData = newUser.data[i];

          if (newData.name) {
            const passengers = [];
            const user = {};
            user.name = newUser.data[i].name;
            user.gender = newUser.data[i].gender;
            user.phoneNo = newUser.data[i].phoneNo;
            user.email = newUser.data[i].email;
            passengers.push(user);
            const ticketUpadation = {
              seatNo: newUser.data[i].seatNo,
              isBooked: newUser.data[i].isBooked,
              passenger: passengers
            };
            if (selectedSeat.includes(seat[i])) {
              return res.status(400).json({
                msg: "You can not book this seat,some one else using this seat",
                selectedSeat
              });
            } else {
              selectedSeat.push(seat[i]);
            }
            await Ticket.updateOne(
              { busId, seatNo: newUser.data[i].seatNo },
              { $set: ticketUpadation }
            );
            selectedSeat.pop(seat[i]);
          } else {
            const userId = userData._id;
            const passenger = [];
            const user = {};
            user.name = userData.name;
            user.gender = userData.gender;
            user.phoneNo = userData.phoneNo;
            user.email = userData.email;
            passenger.push(user);
            const ticketUpadations = {
              seatNo: newUser.data[i].seatNo,
              isBooked: newUser.data[i].isBooked,
              userId,
              passenger
            };
            if (selectedSeat.includes(seat[i])) {
              return res.status(400).json({
                msg: "we can not book this seat,some one else using this seat",
                selectedSeat
              });
            } else {
              selectedSeat.push(seat[i]);
            }
            await Ticket.updateOne(
              { busId, seatNo: newUser.data[i].seatNo },
              { $set: ticketUpadations }
            );
            selectedSeat.pop(seat[i]);
          }
          const bookedticket = await Ticket.findOne({
            busId,
            seatNo: newUser.data[i].seatNo
          }).populate("busId", []);
          ticketList.push(bookedticket);
          if (ticketList) {
             transporter.sendMail({
               to: newData.email,
               from: "siddhapureshubhangi@gmail.com",
               subject: "Ticket Detail",
               html: `
            <p>Hello</p>
            <p>Thanks for using app,Happy journey. </p>
            <p> Your Ticket Detail </p>
            <div> 
              <Card className="container p-5">
              <Table bordered size="sm">
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <b> From </b>${ticketList[0].busId.startCity}
                    </td>
                  </tr>
                   <tr>
                    <td colSpan="2">
                     <b> to </b> ${ticketList[0].busId.endCity}
                    </td>
                  </tr>
                  <tr>
                    <td><b> Date of journey</b> </td>
                    <td>${new Date(
                      ticketList[0].busId.arrivalDate
                    ).toDateString()}</td>
                  </tr>
                  <tr>
                    <td><b>Bus Name and Type</b></td>
                    <td>${ticketList[0].busId.name} Bus(${
                 ticketList[0].busId.description
               })</td>
                  </tr>
                  <tr>
                    <td><b>Passenger Name</b></td>
                    <td>${ticketList[0].passenger.name} </td>
                  </tr>
                  <tr>
                    <td><b>Phone Number</b></td>
                    <td>${ticketList[0].passenger.phoneNo} </td>
                  </tr>
                  <tr>
                    <td><b>Seat Number</b></td>
                    <td>${ticketList[0].seatNo} </td>
                  </tr>
                  <tr>
                    <td><b>Total Fare</b></td>
                    <td>${ticketList[0].busId.costOfticket} </td>
                  </tr>
                  <tr>
                    <td><b>Bus Number</b></td>
                    <td>${ticketList[0].busId.busNumber} </td>
                  </tr>
                  <tr>
                    <td><b>Departure Timing</b></td>
                    <td>${new Date(
                      ticketList[0].busId.departureTiming
                    ).toLocaleString("en-US", {
                      hour: "numeric",
                      hour12: true,
                    })} </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
              </div>
            `,
             });  
          }
        }
        return res.status(200).json({ msg: "Ticket Booked", ticketList });
      } else {
        return res
          .status(400)
          .send("User not found in user data base,Enter the valid Token");
      }
    } catch (err) {
      console.log(err);
      return res.status(404).json("server error");
    }
  }
);

// get list of all closed tickets
router.post("/closed", async (req, res) => {
  try {
    const busId = req.body.busId;
    let bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ msg: "Bus not exist" });
    } else {
      let tickets = await Ticket.find({ busId, isBooked: true });
      return res
        .status(200)
        .json({ msg: "List of all closed ticket", tickets });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("server error");
  }
}),
  // get list of all open tickets
  router.post("/open", async (req, res) => {
    try {
      const busId = req.body.busId;
      const bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({ msg: "Bus not exist" });
      } else {
        const tickets = await Ticket.find({ busId, isBooked: false });
        return res
          .status(200)
          .json({ msg: "List of all open tickets", tickets });
      }
    } catch (err) {
      console.log(err);
      res.status(404).json("server error");
    }
  }),
  //view ticket status
  router.get("/ticket/:busId/:_id", async (req, res) => {
    try {
      const busId = req.params.busId;
      const _id = req.params._id;

      const bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json("Bus not exist");
      }
      const tickets = await Ticket.find({ busId });
      if (tickets.length === 0) {
        return res.status(404).json({ msg: "Enter the valid BusId" });
      }
      const ticket = await Ticket.find({ busId, _id });
      console.log(ticket);
      if (ticket.length === 0) {
        console.log("Ticket not found");
        return res
          .status(404)
          .json({ msg: "Ticket not found,Enter the valid information" });
      }
      const isBooked = ticket[0].isBooked;
      console.log(isBooked);
      return res.status(200).json({ msg: "ticket status is", isBooked });
    } catch (err) {
      console.log("error", err);
      res.status(404).json("err");
    }
  });

//View Details of person owning the ticket.
router.get("/detail/:busId/:_id", auth, async (req, res) => {
  try {
    const busId = req.params.busId;
    const _id = req.params._id;
    const busNo = await Bus.findById(busId);
    if (!busNo) {
      return res.status(404).json("bus not exist");
    }

    const tickets = await Ticket.find({ busId });
    if (tickets.length === 0) {
      return res.status(404).json({ msg: "Enter the valid BusId" });
    }
    const user = await User.findById(req.user.id);
    const isAdmin = user.isAdmin;
    if (isAdmin === true) {
      const ticket = await Ticket.find({ busId, _id }).populate("userId", []);
      if (ticket.length === 0) {
        return res
          .status(404)
          .json({ msg: "Ticket not found,Enter the valid information" });
      }
      return res
        .status(200)
        .json({ msg: "Deatali of person owning the ticket", ticket });
    } else {
      const userid = user._id;
      let userdata = await User.findById(userid);
      if (!userdata) {
        return res.status(404).json("usre not exist");
      }
      const ticket = await Ticket.findById(_id);
      const userId = ticket.userId;
      if (userId.toString() === userid.toString()) {
        const ticketDetail = await Ticket.find(busId, _id).populate(
          "userId",
          []
        );
        return res
          .status(200)
          .json({ msg: "Deatali of person owning the ticket", ticketDetail });
      } else {
        return res.status(404).json("Enter the valid token");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(404).send("server error");
  }
}),
  (module.exports = router);
