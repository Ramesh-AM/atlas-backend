const approveTrip = async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(
    req.params.tripId,
    { status: 'APPROVED' },
    { new: true }
  )

  res.json(trip)
}

const rejectTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id)

  trip.status = 'REJECTED'
  trip.timeline.push({ status: 'ADMIN_REJECTED', time: new Date() })

  await trip.save()
  res.json(trip)
}

module.exports = {
  approveTrip,
  rejectTrip
}