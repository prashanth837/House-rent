const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProperties);
router.get('/owner/my-listings', protect, authorize('owner'), getMyListings);
router.get('/:id', getPropertyById);

router.post('/', protect, authorize('owner'), upload.array('images', 5), createProperty);
router.put('/:id', protect, authorize('owner'), upload.array('images', 5), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
