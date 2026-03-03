const Booking = require('../models/Booking')
const Partner = require('../models/Partner')
const Route = require('../models/Route')
const Trip = require('../models/Trip')
const Bus = require('../models/Bus')

const assignDriverToTrip = async (req, res) => {
  const { tripId } = req.params
  const { driverId } = req.body

  const trip = await Trip.findOneAndUpdate(
    { _id: tripId, partnerId: req.user._id },
    { driverId },
    { new: true }
  ).populate('driverId')

  if (!trip) return res.status(404).json({ message: 'Trip not found' })

  res.json(trip)
}

const updateSeatPricing = async (req, res) => {
  const { tripId } = req.params
  const { seater, sleeper } = req.body

  const trip = await Trip.findOneAndUpdate(
    { _id: tripId, partnerId: req.user._id },
    { seatPrices: { seater, sleeper } },
    { new: true }
  )

  res.json(trip)
}

const getPartnerEarnings = async (req, res) => {
  console.log('Calculating earnings for partner', req.user)
  const earnings = await Booking.aggregate([
    {
      $match: {
        partnerId: req.user._id,
        status: 'CONFIRMED'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ])

  res.json(earnings[0] || { total: 0, count: 0 })
}

const getRoutesWithTripCount = async (req, res) => {
  const routes = await Route.aggregate([
    {
      $match: { partnerId: req.user._id }
    },
    {
      $lookup: {
        from: 'trips',
        localField: '_id',
        foreignField: 'routeId',
        as: 'trips'
      }
    },
    {
      $addFields: {
        tripCount: { $size: '$trips' }
      }
    },
    {
      $project: {
        trips: 0
      }
    }
  ])

  res.json(routes)
}

const updateBus = async (req, res) => {
  const bus = await Bus.findOneAndUpdate(
    { _id: req.params.id, partnerId: req.user._id },
    req.body,
    { new: true }
  )
  res.json(bus)
}

const deleteBus = async (req, res) => {
  await Bus.findOneAndDelete({
    _id: req.params.id,
    partnerId: req.user._id
  })
  res.json({ success: true })
}

const updateRoute = async (req, res) => {
  const route = await Route.findOneAndUpdate(
    { _id: req.params.id, partnerId: req.user._id },
    req.body,
    { new: true }
  )
  res.json(route)
}

const deleteRoute = async (req, res) => {
  await Route.findOneAndDelete({
    _id: req.params.id,
    partnerId: req.user._id
  })
  res.json({ success: true })
}

const toggleRouteStatus = async (req, res) => {
  const route = await Route.findById(req.params.id)

  route.status = route.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  await route.save()

  res.json(route)
}


module.exports = {
  assignDriverToTrip,
  updateSeatPricing,
  getPartnerEarnings,
  getRoutesWithTripCount,
  toggleRouteStatus,
  updateRoute,
  deleteRoute,
  updateBus,
  deleteBus
}