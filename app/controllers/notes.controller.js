/* eslint-disable linebreak-style */
/* eslint-disable import/order */
/* eslint-disable camelcase */
const db = require('../models');

const { notes } = db;
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

async function decode_jwt(token) {
  // функция для распарсивания JWT токена и вытаскивания оттуда user id
  let user_id = 0;
  await new Promise((res) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      user_id = decoded.id;
      if (!err) res();
    });
  });
  return user_id;
}

exports.get_notes = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const user_id = await decode_jwt(token);
    const all_notes = await notes.findAll({ where: { user_id } });
    // eslint-disable-next-line no-restricted-syntax
    for (const note of all_notes) {
      note.dataValues.external_link = `${req.headers.host}/${note.dataValues.id}`;
    }
    res.status(200).send(all_notes);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.get_single_note = async (req, res) => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line camelcase
    const search_note = await notes.findOne({ where: { id } });
    delete search_note.dataValues.id;// удаляем ненужные поля согласно ТЗ
    delete search_note.dataValues.user_id;
    delete search_note.dataValues.createdAt;
    delete search_note.dataValues.updatedAt;
    delete search_note.dataValues.name;
    res.status(200).send(search_note);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.add_note = async (req, res) => {
  try {
    const { body } = req;
    const token = req.headers['x-access-token'];
    const user_id = await decode_jwt(token);
    body.user_id = user_id;
    const insert_note = await notes.create(body);
    res.status(200).send(insert_note);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.update_note = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const update_note = await notes.update(body, { where: { id } });
    if (update_note === 1) { res.status(200).send({ message: 'Successfully updated' }); } else res.status(200).send({ message: 'Nothing has changed' });
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.delete_note = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers['x-access-token'];
    const user_id = await decode_jwt(token);
    const delete_note = await notes.destroy({ where: { id, user_id } });
    res.sendStatus(200).send(delete_note);
  } catch (error) {
    res.status(400).send(error);
  }
};
