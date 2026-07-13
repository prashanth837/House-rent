const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a booking request
// @route   POST /api/bookings
// @access  Private (Renter only)
const createBooking = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: 'Please provide a property ID' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.isAvailable) {
      return res.status(400).json({ message: 'Property is currently occupied or unavailable' });
    }

    // Check if renter already has a pending booking for this property
    const existingBooking = await Booking.findOne({
      property: propertyId,
      renter: req.user._id,
      status: 'Pending',
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a pending booking request for this property' });
    }

    const booking = new Booking({
      property: propertyId,
      renter: req.user._id,
      owner: property.owner,
      message,
      status: 'Pending',
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings made by the renter
// @route   GET /api/bookings/renter
// @access  Private (Renter only)
const getRenterBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate('property')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all booking requests for the owner's listings
// @route   GET /api/bookings/owner
// @access  Private (Owner only)
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property')
      .populate('renter', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject a booking request
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Choose Approved or Rejected.' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking request not found' });
    }

    // Verify ownership
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this booking' });
    }

    booking.status = status;
    await booking.save();

    // If approved, update property availability status to false
    if (status === 'Approved') {
      await Property.findByIdAndUpdate(booking.property, { isAvailable: false });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin
// @access  Private (Admin only)
const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('property')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getRenterBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAdminBookings,
};
