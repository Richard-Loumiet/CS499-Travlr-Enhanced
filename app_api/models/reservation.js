const mongoose = require('mongoose');

// Define the reservation schema
const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true
    },

    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'trips',
      required: true,
      index: true
    },

    guestCount: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Index commonly used reservation lookups.
reservationSchema.index({ user: 1, createdAt: -1 });
reservationSchema.index({ trip: 1, status: 1 });

const Reservation = mongoose.model(
  'reservations',
  reservationSchema
);

module.exports = Reservation;