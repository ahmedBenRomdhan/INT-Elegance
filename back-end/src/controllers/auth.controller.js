const db = require("../models");
const userModel = db.user;
const bcrypt = require("bcrypt");
const tokenService = require("../services/token.service");
const authService = require("../services/auth.service");
const emailNotifications = require("../helpers/emailNotifications");
const jwt = require("jsonwebtoken");

module.exports = {
  signin: async (req, res) => {
    try {
      await authService.signin(req, res);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  refresh: async (req, res) => {
    try {
      const { token } = req.body;
      if (token) {
        const user = await tokenService.verifyRefreshToken(token);
        const accessToken = await tokenService.getAccessToken(user);
        res.send({ accessToken });
      } else {
        res.status(403).send("token Unavailable!!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  home: async (req, res) => {
    res.status(201).json({ user: req.user });
  },

  forgot: async (req, res) => {
    const { email } = req.body;
    try {
      console.log(email)
      const user = await userModel.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({ message: "user don't exist" });
      }
      const secret = process.env.TOKEN_KEY + user.password;
      const payload = {
        email: user.email,
        id: user.id,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const link = `http://${process.env.HOST}:4200/reset/${user.id}/${token}`;
      console.log("sending")
      emailNotifications.forgot(user.email, link);
      res.status(200).json({ message: "check your email" });
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },
  reset: async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const oldUser = await userModel.findOne({ where: { id: id } });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.TOKEN_KEY + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await userModel.update(
        { password: encryptedPassword },
        {
          where: { id: id },
        }
      );

      res.status(200).json({ message: "your password has been updated" });
    } catch (error) {
      res.json({ status: "Something Went Wrong" });
    }
  },
};
