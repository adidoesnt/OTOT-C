const mongoose = require('mongoose');

const { Schema } = mongoose;
const SessionSchema = new Schema({
  token: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('SessionModel', SessionSchema);
