const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  getOwners,
  getProperties,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here require protect and authorize('admin')
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/owners', getOwners);
router.get('/properties', getProperties);
router.delete('/users/:id', deleteUser);

module.exports = router;
