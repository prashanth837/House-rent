const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Get all properties with filtering and search
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { city, type, minRent, maxRent, bedrooms, isAvailable } = req.query;
    let query = {};

    // Filter by availability (if specified, convert string to boolean)
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Filter by city (case-insensitive search)
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Filter by property type
    if (type) {
      query.type = type;
    }

    // Filter by rent range
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    // Filter by bedrooms
    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single property's details
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new property listing
// @route   POST /api/properties
// @access  Private (Owner only)
const createProperty = async (req, res) => {
  try {
    const {
      name,
      type,
      adType,
      address,
      city,
      state,
      pincode,
      rent,
      bedrooms,
      bathrooms,
      area,
      description,
      additionalInfo,
    } = req.body;

    if (
      !name ||
      !type ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !rent ||
      !bedrooms ||
      !bathrooms ||
      !area ||
      !description
    ) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Handle files (Multer saves to req.files)
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Save relative path: e.g. 'uploads/filename.jpg'
        images.push(`uploads/${file.filename}`);
      });
    }

    const property = new Property({
      name,
      type,
      adType: adType || 'Rent',
      address,
      city,
      state,
      pincode,
      owner: req.user._id,
      ownerName: req.user.name,
      ownerContact: req.user.phone,
      rent: Number(rent),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      description,
      additionalInfo,
      images,
      isAvailable: true,
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    // Edit fields
    property.name = req.body.name || property.name;
    property.type = req.body.type || property.type;
    property.address = req.body.address || property.address;
    property.city = req.body.city || property.city;
    property.state = req.body.state || property.state;
    property.pincode = req.body.pincode || property.pincode;
    property.rent = req.body.rent !== undefined ? Number(req.body.rent) : property.rent;
    property.bedrooms = req.body.bedrooms !== undefined ? Number(req.body.bedrooms) : property.bedrooms;
    property.bathrooms = req.body.bathrooms !== undefined ? Number(req.body.bathrooms) : property.bathrooms;
    property.area = req.body.area !== undefined ? Number(req.body.area) : property.area;
    property.description = req.body.description || property.description;
    property.additionalInfo = req.body.additionalInfo || property.additionalInfo;
    
    if (req.body.isAvailable !== undefined) {
      property.isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    }

    // Handle new image uploads if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `uploads/${file.filename}`);
      // Append or replace? Let's append new images to the existing ones
      property.images = [...property.images, ...newImages];
    }

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner or Admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Verify ownership or check if Admin
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    // Delete associated bookings first
    await Booking.deleteMany({ property: property._id });

    // Delete the property itself
    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property and associated bookings deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get listings by logged-in Owner
// @route   GET /api/properties/owner/my-listings
// @access  Private (Owner only)
const getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
};
