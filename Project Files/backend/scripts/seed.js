const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const usersData = [
  {
    name: 'System Admin',
    email: 'admin@househunt.com',
    password: 'adminpassword123',
    phone: '+919999999999',
    role: 'admin',
  },
  {
    name: 'Rajesh Kumar',
    email: 'owner1@househunt.com',
    password: 'ownerpassword123',
    phone: '+919876543210',
    role: 'owner',
  },
  {
    name: 'Sarah Dsouza',
    email: 'owner2@househunt.com',
    password: 'ownerpassword123',
    phone: '+919876543211',
    role: 'owner',
  },
  {
    name: 'Amit Sharma',
    email: 'renter1@househunt.com',
    password: 'renterpassword123',
    phone: '+919123456789',
    role: 'renter',
  },
  {
    name: 'Priya Patel',
    email: 'renter2@househunt.com',
    password: 'renterpassword123',
    phone: '+919123456780',
    role: 'renter',
  },
];

const propertiesData = (owner1, owner2) => [
  {
    name: 'Cozy 2BHK Apartment near Metro',
    type: 'Apartment',
    adType: 'Rent',
    address: 'A-402, Green Meadows, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    owner: owner1._id,
    ownerName: owner1.name,
    ownerContact: owner1.phone,
    rent: 28000,
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    description: 'A beautifully furnished 2BHK apartment with great ventilation and natural light. It is just a 5-minute walk to the nearest metro station, making it highly accessible. Modern kitchen amenities, wardrobes, and modular fittings are included.',
    additionalInfo: '24/7 security, piped gas, gym access, children\'s playground.',
    images: [],
    isAvailable: true,
  },
  {
    name: 'Luxury 4BHK Villa with Private Garden',
    type: 'Villa',
    adType: 'Rent',
    address: 'Villa 14, Royal Palms Estate, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    owner: owner1._id,
    ownerName: owner1.name,
    ownerContact: owner1.phone,
    rent: 85000,
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    description: 'An premium, ultra-spacious 4BHK villa located in one of Pune\'s most elite areas. Features a private landscaped garden, covered parking for 2 cars, servant quarters, and modular home automation features.',
    additionalInfo: 'Private swimming pool access, club membership, solar water heating, pet-friendly environment.',
    images: [],
    isAvailable: true,
  },
  {
    name: 'Modern 1BHK Studio Apartment',
    type: 'Apartment',
    adType: 'Rent',
    address: 'Studio 105, Urban Living Spaces, HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560102',
    owner: owner2._id,
    ownerName: owner2.name,
    ownerContact: owner2.phone,
    rent: 18000,
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    description: 'Perfect for working professionals or young couples. A smart studio apartment equipped with functional space-saving furniture, a modular kitchen, high-speed fiber internet, and workspace setup.',
    additionalInfo: 'Power backup, elevator, bike parking, laundry service in building.',
    images: [],
    isAvailable: true,
  },
  {
    name: 'Spacious 3BHK Penthouse',
    type: 'House',
    adType: 'Rent',
    address: 'Penthouse 12B, Skyline Towers, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    owner: owner2._id,
    ownerName: owner2.name,
    ownerContact: owner2.phone,
    rent: 42000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    description: 'Experience luxury at this double-height penthouse offering breathtaking views of the city skyline. Features a massive wrap-around terrace, private elevator access, marble flooring, and a walk-in wardrobe.',
    additionalInfo: 'Dedicated terrace area, community pool, tennis court, close to major corporate offices.',
    images: [],
    isAvailable: true,
  },
];

const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    console.log(`Connecting to database to seed: ${connStr.replace(/\/\/.*@/, '//<credentials>@')}`);
    
    await mongoose.connect(connStr);
    console.log('Connected to database.');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    console.log('Database cleared.');

    // Seed Users
    console.log('Seeding users...');
    const createdUsers = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`Successfully seeded ${createdUsers.length} users.`);

    // Find owners
    const owner1 = createdUsers.find(u => u.email === 'owner1@househunt.com');
    const owner2 = createdUsers.find(u => u.email === 'owner2@househunt.com');

    // Seed Properties
    console.log('Seeding properties...');
    const properties = propertiesData(owner1, owner2);
    const createdProperties = await Property.insertMany(properties);
    console.log(`Successfully seeded ${createdProperties.length} properties.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
