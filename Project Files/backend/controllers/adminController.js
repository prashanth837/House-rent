const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res) => {
  try {
    const totalRenters = await User.countDocuments({ role: 'renter' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Add additional metrics like pending vs approved bookings
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'Approved' });
    const rejectedBookings = await Booking.countDocuments({ status: 'Rejected' });

    res.json({
      totalRenters,
      totalOwners,
      totalProperties,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with renter role
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const renters = await User.find({ role: 'renter' }).select('-password').sort({ createdAt: -1 });
    res.json(renters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all property owners
// @route   GET /api/admin/owners
// @access  Private (Admin only)
const getOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('-password').sort({ createdAt: -1 });
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties
// @route   GET /api/admin/properties
// @access  Private (Admin only)
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user and all their associated records
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin users cannot be deleted' });
    }

    const userId = user._id;

    if (user.role === 'owner') {
      // Find and delete owner properties
      const properties = await Property.find({ owner: userId });
      const propertyIds = properties.map((p) => p._id);

      // Delete bookings associated with these properties
      await Booking.deleteMany({ property: { $in: propertyIds } });
      // Delete owner properties
      await Property.deleteMany({ owner: userId });
      // Delete bookings created by this owner (if any)
      await Booking.deleteMany({ owner: userId });
    } else if (user.role === 'renter') {
      // Delete bookings created by this renter
      await Booking.deleteMany({ renter: userId });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  getOwners,
  getProperties,
  deleteUser,
};
