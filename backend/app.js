require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db.js");
const bodyParser = require("body-parser");

const app = express();
app.use((req, res, next) => {
  console.log("loggg");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-auth-token, Accept"
  );
  next();
});

app.use(bodyParser.json());

connectDB();

const apiRoutes = require("./src/route/ticket.js");
const user = require("./src/route/auth.js");
const bus = require("./src/route/bus.js");
app.use("/api", apiRoutes);
app.use("/api", user);
app.use("/api", bus);

// listen for requests
app.listen(7900, () => {
  console.log("Server is listening on port 7900");
});
