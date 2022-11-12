const UserModel = require('./user');
const SessionModel = require('./session');
const mongoose = require('mongoose');
require('dotenv').config();
const mongoDB = process.env.DB_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function createUser(params) {
  return new UserModel(params);
}

async function createSession(params) {
  return new SessionModel(params);
}

module.exports = {
  createUser,
  createSession,
}