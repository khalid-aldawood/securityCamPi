const mongoose = require('mongoose');

const SensorReadingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  alert: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }


});

const SensorReading = mongoose.model('SensorReading', SensorReadingSchema);

module.exports = SensorReading;