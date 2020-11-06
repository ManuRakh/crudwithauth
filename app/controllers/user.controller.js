const db = require("../models");
const notes = db.notes;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { use } = require("chai");


exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
