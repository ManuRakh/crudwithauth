const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth_controller = require("./app/controllers/auth.controller")
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};
const Gateway = require('micromq/gateway');


const gateway = new Gateway({
  microservices: ['users'],
  rabbit: {
    url: 'amqp://guest:guest@localhost:5672',
  },
  requests: {
    timeout: 5000,
  }
});

app.use(gateway.middleware());
app.get(['/info', '/status'], async (req, res) => {
  await res.delegate('users');
});
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
var bcrypt = require("bcryptjs");

db.sequelize.sync().then(result=>{ //для теста создал единичный инсерт 1 юзера. Понятное дело что нужно было в сиды это сделать, но так быстрее.
  const User = db.user;
  let user_datas = require("./tests/config_files/config")
  console.log(user_datas.password)
  auth_controller.sign_up_by_server(user_datas)
});
app.get("/", (req, res) => {
  res.json({ message: "this works" });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require("./app/routes/note.routes")(app)


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app