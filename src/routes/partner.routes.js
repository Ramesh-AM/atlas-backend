const router = require('express').Router()
const { authenticate } = require('../middlewares/auth.middleware')
const Bus = require('../models/Bus')
const Route = require('../models/Route')
const Trip = require('../models/Trip')
//const Driver = require('../models/Driver')
const { 
  updateSeatPricing, 
  getPartnerEarnings, 
  updateRoute, 
  deleteRoute, 
  toggleRouteStatus, 
  updateBus, 
  deleteBus } = require('../controllers/partner.controller')

//router.use(auth('PARTNER'))

router.post('/create/buses', authenticate, async (req, res) => {
  res.json(await Bus.create({ ...req.body, operatorId: req.user._id }))
})
router.get('/buses', authenticate, async (req, res) => {
  console.log('Fetching buses for operator', req.user._id)
  res.json(await Bus.find({ operatorId: req.user._id }))
})

router.post('/create/routes', authenticate, async (req, res) => {
  console.log('Creating route for operator', req.user._id, req.body)
  res.json(await Route.create({ ...req.body, operatorId: req.user._id }))
})
router.get('/routes', authenticate, async (req, res) => {
  console.log('Fetching routes for operator', req.user._id)
  res.json(await Route.find({ operatorId: req.user._id }))
})

// router.post('/create/drivers', async (req, res) => {
//   res.json(await Driver.create({ ...req.body, operatorId: req.user.id }))
// })
// router.get('/drivers', async (req, res) => {
//   res.json(await Driver.find({ operatorId: req.user.id }))
// })

router.post('/create/trips', authenticate, async (req, res) => {
  res.json(await Trip.create({ ...req.body, operatorId: req.user._id }))
})
router.get('/trips', authenticate, async (req, res) => {
  res.json(await Trip.find({ operatorId: req.user.id }).populate('routeId busId driverId'))
})

// ASSIGN DRIVER
router.put('/trips/:id/assign-driver', authenticate, async (req, res) => {
  await Trip.findByIdAndUpdate(req.params.id, {
    driverId: req.body.driverId
  })
  res.json({ message: 'Driver assigned' })
})

router.patch('/trips/:tripId/pricing', authenticate, updateSeatPricing, async (req, res) => {
  res.json({ message: 'Seat pricing updated', trip: req.trip })
})

router.get('/earnings', authenticate, getPartnerEarnings, async (req, res) => {
  console.log('Earnings', req.earnings)
  res.json({ totalEarnings: req.earnings.total, bookingCount: req.earnings.count })
})

router.patch('/update/routes/:id', authenticate, updateRoute)
router.patch('/routes/:id/status', authenticate, toggleRouteStatus)
router.delete('/routes/:id', authenticate, deleteRoute)

router.patch('/update/buses/:id', authenticate, updateBus)
router.delete('/buses/:id', authenticate, deleteBus)

module.exports = router