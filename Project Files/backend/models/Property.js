const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a property name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please select property type (e.g., Apartment, Villa, House, Room)'],
      trim: true,
    },
    adType: {
      type: String,
      enum: ['Rent'],
      default: 'Rent',
    },
    address: {
      type: String,
      required: [true, 'Please add the complete address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please specify the city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please specify the state'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Please specify the pincode'],
      trim: true,
      match: [/^[0-9]{5,8}$/, 'Please add a valid pincode'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerContact: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: [true, 'Please add a monthly rent amount'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
    },
    area: {
      type: Number,
      required: [true, 'Please add property area in square feet'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
