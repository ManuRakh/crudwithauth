/* eslint-disable global-require */
/* eslint-disable camelcase */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth_controller = require('./app/controllers/auth.controller')

const app = express();
const db = require('./app/models');

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:8081'
};
// eslint-disable-next-line import/order
const Gateway = require('micromq/gateway');

const gateway = new Gateway({
  microservices: ['users'],
  rabbit: {
    url: 'amqp://guest:guest@localhost:5672', //путь для докер image с запущенным rabbitmq
  },
  requests: {
    timeout: 5000,
  },
});

app.use(gateway.middleware());

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database

// eslint-disable-next-line max-len
db.sequelize.sync().then(() => { // для теста создал единичный инсерт 1 юзера. Понятное дело что нужно было в сиды это сделать, но так быстрее.
  // eslint-disable-next-line global-require
  // eslint-disable-next-line camelcase
  const user_datas = require('./tests/config_files/config');
  auth_controller.sign_up_by_server(user_datas);
});

// routes
app.get('/', (req, res) => {
  res.json({ message: 'this works' });
});
app.get(['/info', '/status'], async (req, res) => {
  await res.delegate('users');
});
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/note.routes')(app)

// set port, listen for requests
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app; // экспортирую для того, чтобы затем запустить в тестах
