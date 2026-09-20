const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    Trip
        .find({})
        .then((trips) => {
            if (!trips) {
                return res
                    .status(404)
                    .json({ "message": "trips not found" });
            } else {
                return res
                    .status(200)
                    .json(trips);
            }
        })
        .catch((err) => {
            console.log(err);
            return res
                .status(404)
                .json(err);
        });
};

// GET: /trips/:tripCode - finds a specific trip by code
const tripsFindByCode = async (req, res) => {
    Trip
        .find({ 'code': req.params.tripCode })
        .then((trip) => {
            if (!trip) {
                return res
                    .status(404)
                    .json({ "message": "trip not found" });
            } else {
                return res
                    .status(200)
                    .json(trip);
            }
        })
        .catch((err) => {
            console.log(err);
            return res
                .status(404)
                .json(err);
        });
};

// POST: /trips - adds a new trip
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    try {
        const trip = await newTrip.save();

        return res
            .status(201)
            .json(trip);
    } catch (err) {
        console.log(err);

        return res
            .status(400)
            .json(err);
    }
};

// PUT: /trips/:tripCode - updates an existing trip
const tripsUpdateTrip = async (req, res) => {
    try {
        const trip = await Trip
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                }
            )
            .exec();

        if (!trip) {
            return res
                .status(400)
                .json({ "message": "Trip not found" });
        }

        return res
            .status(201)
            .json(trip);

    } catch (err) {
        console.log(err);

        return res
            .status(400)
            .json(err);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};