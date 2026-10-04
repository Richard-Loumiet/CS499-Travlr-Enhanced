const mongoose = require('mongoose');

const Reservation = mongoose.model('reservations');
const Trip = mongoose.model('trips');

// POST: /reservations
// Creates a reservation for the currently authenticated user.
const reservationsCreate = async (req, res) => {
    try {
        const { tripCode, guestCount } = req.body;

        // Verify that a trip code was supplied.
        if (!tripCode) {
            return res
                .status(400)
                .json({ message: 'Trip code is required' });
        }

        // Find the selected trip.
        const trip = await Trip.findOne({ code: tripCode });

        if (!trip) {
            return res
                .status(404)
                .json({ message: 'Trip not found' });
        }

        // Create the reservation using the authenticated user's ID
        // and the selected trip's MongoDB ObjectId.
        const reservation = new Reservation({
            user: req.auth._id,
            trip: trip._id,
            guestCount: guestCount || 1,
            status: 'pending'
        });

        const savedReservation = await reservation.save();

        // Return the reservation with useful trip information populated.
        const populatedReservation = await Reservation
            .findById(savedReservation._id)
            .populate('trip', 'code name resort start perPerson')
            .populate('user', 'name email');

        return res
            .status(201)
            .json(populatedReservation);

    } catch (err) {
        console.log(err);

        return res
            .status(400)
            .json(err);
    }
};


// GET: /reservations
// Returns reservations belonging to the currently authenticated user.
const reservationsListByUser = async (req, res) => {
    try {
        const reservations = await Reservation
            .find({ user: req.auth._id })
            .populate('trip', 'code name resort start perPerson')
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(reservations);

    } catch (err) {
        console.log(err);

        return res
            .status(500)
            .json(err);
    }
};


module.exports = {
    reservationsCreate,
    reservationsListByUser
};