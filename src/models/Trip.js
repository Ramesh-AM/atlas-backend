const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  busId: { type: mongoose.ObjectId, ref: 'Bus' },
  routeId: { type: mongoose.ObjectId, ref: 'Route' },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  date: String,
  journeyDate: String,
  departureTime: String,
  arrivalTime: String,
  fare: Number,
  availableSeats: Number,
  bookedSeats: [String],
  status: {
    type: String,
    enum: ['SCHEDULED', 'STARTED', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  seatPrices: {
    seater: Number,
    sleeper: Number
  }
}, { timestamps: true })

module.exports = mongoose.model('Trip', tripSchema)
