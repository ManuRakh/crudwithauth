const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log("SIGNUP")
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      console.log("User registered successfully")
      res.send({ message: "User registered successfully!" });

    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ message: err.message });
    });
};
exports.sign_up_by_server = (req)=>{
  // Save User to Database
  User.create({
    username: req.username,
    email: req.email,
    password: bcrypt.hashSync(req.password, 8)
  })
    .then(user => {
      console.log("User registered successfully")

    })
    .catch(err => {
      console.log(err)
    });
}
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.logout = (req, res) => {
  
}