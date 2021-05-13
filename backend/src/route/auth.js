const express = require("express");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const config = require("../config/config.json");
const validation = require("../validation/uservalidation.js");
const uservalidation = validation.userValidation;
const { check, validationResult } = require("express-validator/check");
const router = express.Router();
const nodemailer = require("nodemailer");
const sendgridTransort = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransort({
    auth: {
      api_key:
        "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"
    }
  })
);
//Admin or user singup
router.post("/signup", async (req, res) => {
  let [result, data] = uservalidation(req.body);
  if (!result) return res.status(404).json({ data });

  const { name, gender, email, phoneNo, password, isAdmin } = req.body;
  try {
    //see user exite
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ errors: [{ msg: "user already exits" }] });
    }

    user = new User({
      name,
      gender,
      email,
      phoneNo,
      password,
      isAdmin
    });
    //encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    //return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("EmailId has be unique");
  }
}),
  //user or Admin login
  router.post(
    "/login",
    [
      check("email", "please enter a valid email").isEmail(),
      check("password", "please enter valid password").exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }
      try {
        const { email, password } = req.body;
        //see user exite
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "invalid credentials" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: "invalid credentials" }] });
        }
        //return jsonwebtoken
        const payload = {
          user: {
            id: user.id
          }
        };
        jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.log(err);
        res.status(500).send("server error");
      }
    }
  );

// forget Password;
router.post(
  "/resetPassword",
  [
    check("email", "please enter a valid email")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }
    try {
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          console.log(err);
        }
        const token = buffer.toString("hex");
        console.log(buffer);
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (!user) {
          return res
            .status(500)
            .json({ error: "user dont exist with that email" });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 360000;
        const result = await user.save();
        if (result) {
          transporter.sendMail({
            to: user.email,
            from: "shubhangis20@navgurukul.org",
            subject: "Password Reset",
            html: `
            <p> you requested for password reset</p>
            <h5>click on this <a href = "http://localhost:3000/reset/${token}">link</a> to reset the password
            `
          });
          res.json({ messege: "check your email", token });
          // res.send(token);
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("server error");
    }
  }
);
//new password API
router.post(
  "/newPassword",
  [
    check("password", "please enter a password")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }
    try {
      const newPassword = req.body.password;
      const sentToken = req.body.token;
      const user = await User.findOne({ resetToken: sentToken });
      console.log(user);
      if (!user) {
        return res.status(500).json({ error: "try again session expired" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetToken = undefined;
      user.expireToken = undefined;
      const savedUser = await user.save();
      if (savedUser) {
        res.json({ message: "password updated success" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
