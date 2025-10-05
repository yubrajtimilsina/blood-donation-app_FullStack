const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const donorRoute = require('./routes/donor');
const prospectRoute = require('./routes/prospect');
const bloodRequestRoute = require('./routes/bloodRequest');

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


// CORS - allow configured frontend origin
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));

//JSON
app.use(express.json());

//ROUTES
app.use("/api/v1/auth",    authRoute);
app.use("/api/v1/donors",  donorRoute);
app.use("/api/v1/prospects", prospectRoute);
app.use("/api/v1/bloodRequests", bloodRequestRoute);

module.exports = app;