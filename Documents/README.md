# HouseHunt - House Rental Management System

A rental platform built with the MERN stack (MongoDB, Express, React, Node) that connects property owners with renters. Features role-based dashboards, image uploads, search/filtering of listings, and booking request management.

## Tech Stack
* **Frontend**: React, React Router, Axios, Vite, Vanilla CSS
* **Backend**: Node.js, Express, Mongoose (MongoDB), JSON Web Tokens (JWT), Multer (image uploads)

---

## Directory Structure
* `backend/` - REST API server, database models, controllers, and upload middleware.
* `frontend/` - React frontend application using Vite.

---

## Setup & Running Locally

### 1. Prerequisites
* Install [Node.js](https://nodejs.org/) (v16+ recommended).
* A MongoDB instance (local or Atlas URI).

### 2. Configure Environment (Backend)
Create a `.env` file inside the `backend` directory (a template is available in `backend/.env`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Install & Start Backend
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 4. Seed Database (Optional)
To populate the database with dummy listings and users (Admin, Owners, Renters):
```bash
cd backend
npm run seed
```

### 5. Install & Start Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The client app will launch on `http://localhost:3000`. Vite is preconfigured to proxy API requests to port 5000.

---

## Testing Credentials (via Seed Script)

If you ran the seed script, you can log in with the following default accounts:

### Renter Account
* **Email:** `renter1@househunt.com`
* **Password:** `renterpassword123`

### Owner Account
* **Email:** `owner1@househunt.com`
* **Password:** `ownerpassword123`

### Admin Account
* **Email:** `admin@househunt.com`
* **Password:** `adminpassword123`
