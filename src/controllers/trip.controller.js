const Trip = require('../models/Trip')
const Route = require('../models/Route')

/* ================= SEARCH TRIPS ================= */
exports.searchTrips = async (req, res) => {
  try {
    const { from, to, date } = req.query

    if (!from || !to || !date) {
      return res.status(400).json({ message: 'Missing search params' })
    }

    const route = await Route.findOne({ from, to })
    if (!route) return res.json([])

    const trips = await Trip.find({
      routeId: route._id,
      date
    }).populate('busId')

    res.json(trips)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= GET TRIP SEATS ================= */
exports.getTripSeats = async (req, res) => {
  try {
    const { tripId } = req.params

    const trip = await Trip.findById(tripId).populate('busId')
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    const availableSeats =
      trip.totalSeats - (trip.bookedSeats?.length || 0)

    res.json({
      tripId: trip._id,
      busType: trip.busId.type,
      totalSeats: trip.totalSeats,
      bookedSeats: trip.bookedSeats || [],
      availableSeats
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ================= CREATE TRIP (ADMIN) ================= */
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({...req.body, partnerId: req.user._id})
    res.status(201).json(trip)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

/* ================= ADMIN LIST ================= */
exports.getAllTrips = async (req, res) => {
  const trips = await Trip.find()
    .populate('busId')
    .populate('routeId')

  res.json(trips)
}

exports.assignDriver = async (req, res) => {
  const { tripId } = req.params
  const { driverId } = req.body

  const trip = await Trip.findById(tripId)
  if (!trip) return res.status(404).json({ message: 'Trip not found' })

  trip.driverId = driverId
  await trip.save()

  res.json({ message: 'Driver assigned successfully' })
}