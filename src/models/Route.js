const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  from: String,
  to: String,
  totalDistance: Number,
  expectedDuration: Number,
  boardingPoints: [String],
  droppingPoints: [String],
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
}, { timestamps: true })

module.exports = mongoose.model('Route', routeSchema)