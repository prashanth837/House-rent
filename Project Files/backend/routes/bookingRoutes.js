const express = require('express');
const router = express.Router();
const {
  createBooking,
  getRenterBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAdminBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('renter'), createBooking);
router.get('/renter', protect, authorize('renter'), getRenterBookings);
router.get('/owner', protect, authorize('owner'), getOwnerBookings);
router.get('/admin', protect, authorize('admin'), getAdminBookings);
router.put('/:id/status', protect, authorize('owner'), updateBookingStatus);

module.exports = router;
