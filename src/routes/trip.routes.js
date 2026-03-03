const router = require('express').Router()
const tripController = require('../controllers/trip.controller')
const auth = require('../middlewares/auth.middleware').authorize()

router.get('/search', tripController.searchTrips)
router.get('/:tripId/seats', tripController.getTripSeats)

router.post('/create', tripController.createTrip)
router.get('/', tripController.getAllTrips)

module.exports = router