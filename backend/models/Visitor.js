const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Visitor', visitorSchema);
