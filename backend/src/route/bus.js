const express = require("express");
const Bus = require("../model/Bus.js");
const User = require("../model/user.js");
const Ticket = require("../model/ticket.js");
const auth = require("../middleware/auth.js");
const validation = require("../validation/busvalidation.js");
const busValidation = validation.busValidation;
const validations = require("../validation/ticketvalidation.js");
const ticketValidation = validations.ticketValidation;
const { check, validationResult } = require("express-validator/check");

const router = express.Router();

router.post("/bus", auth, async (req, res) => {
  let [result, data] = busValidation(req.body);
  if (!result) return res.status(400).json({ data });
  try {
    const user = await User.findById(req.user.id);
    let isAdmin = user.isAdmin;
    if (isAdmin === true) {
      const bus = new Bus(req.body);
      const newbus = await bus.save();
      if (newbus) {
        const busId = bus.id;
        return res.status(200).json({ msg: "Bus Id is", busId });
      }
    } else {
      return res.status(400).json({ msg: "enter the valid admin token" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send({ error: "Bus number has to be unique" });
  }
}),
  //get searched bus
  router.post(
    "/busSearch",
    [
      check("startCity", "please enter start city")
        .not()
        .isEmpty(),
      check("endCity", "please enter end city")
        .not()
        .isEmpty(),
      check("departureDate", "please enter departure date").isDate()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      try {
        const startCity = req.body.startCity;
        const endCity = req.body.endCity;
        const departureDate = req.body.departureDate;
        const buses = await Bus.find({
          startCity,
          endCity,
          departureDate: { $gte: new Date(departureDate) }
        });
        // console.log(buses);
        if (buses.length === 0) {
          return res.status(404).json({ msg: "Bus not found" });
        }
        return res.status(200).json({ msg: "Avalibale buses are", buses });
      } catch (err) {
        console.log(err);
        res.status(400).json("sever error");
      }
    }
  );

//create ticket
router.post("/tickets", auth, async (req, res) => {
  let [result, data] = ticketValidation(req.body);
  if (!result) return res.status(400).json({ data });

  try {
    const user = await User.findById(req.user.id);
    const isAdmin = user.isAdmin;
    if (isAdmin === true) {
      const busId = req.body.busId;
      let bus = await Bus.findById(busId);
      if (!bus) {
        return res.status(404).json({ msg: "bus not found" });
      }
      let busid = await Ticket.findOne({ busId });
      if (busid) {
        return res
          .status(404)
          .json({ msg: "Tickets aleardy created for this bus" });
      } else {
        const numberOfseats = bus.numberOfseats;
        const ticketlist = [];
        for (i = 1; i <= numberOfseats; i++) {
          const ticketObj = {};
          ticketObj.seatNo = i;
          ticketObj.isBooked = false;
          ticketObj.busId = req.body.busId;
          ticketlist.push(ticketObj);
        }
        await Ticket.insertMany(ticketlist);
        return res.status(200).json({ msg: "Ticket created succesfully" });
      }
    } else {
      return res.status(400).json({ msg: "Enter the valid token" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json("sever error");
  }
});

//reset the ticket using busId
router.put("/reset/:busId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isAdmin = user.isAdmin;
    if (isAdmin === true) {
      const busId = req.params.busId;
      let busid = await Ticket.find({ busId });
      if (busid.length === 0) {
        return res.status(404).json({ msg: "Tickets not found for this bus" });
      }
      const ticket = await Ticket.find({ busId, isBooked: true });
      if (ticket.length !== 0) {
        await Ticket.updateMany({ busId }, { $unset: { userId: "" } });
        await Ticket.updateMany({ busId }, { $unset: { passenger: "" } });
        await Ticket.updateMany({ busId }, { $set: { isBooked: false } });
        return res.status(200).json({ msg: "All tickets are open to book" });
      } else {
        return res
          .status(200)
          .json({ msg: "Ticket is aleardy open,No need to do reset" });
      }
    } else {
      return res.status(400).json({ msg: "Enter the valid token" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("sever error");
  }
});

module.exports = router;
