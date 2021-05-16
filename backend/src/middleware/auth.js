const jwt = require("jsonwebtoken");
// const config = require("../config/config.json");
const process = require("process");
const jwtToken = process.env.JWTSECRET;
// console.log;
module.exports = function(req, res, next) {
  //get the token from header
  const token = req.header("x-auth-token");

  //checke if no token
  if (!token) {
    return res.status(401).json({ msg: "no token,authorization denied" });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, jwtToken);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
