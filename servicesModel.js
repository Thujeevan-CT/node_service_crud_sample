const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');

const serviceSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: String,
    default: () => moment.utc().format()
  },
  updated_at: {
    type: String,
    default: () => moment.utc().format()
  },
});

serviceSchema.pre('findOneAndUpdate', function() {
  this.set({ updated_at: moment.utc().format() });
});

const Service = mongoose.model("service", serviceSchema);

module.exports = Service;