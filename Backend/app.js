const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const donorRoute = require('./routes/donor');
const prospectRoute = require('./routes/prospect');
const bloodRequestRoute = require('./routes/bloodRequest');

const cors = require('cors');


//CORS
app.use(cors());

//JSON
app.use(express.json());

//ROUTES
app.use("/api/v1/auth",    authRoute);
app.use("/api/v1/donors",  donorRoute);
app.use("/api/v1/prospects", prospectRoute);
app.use("/api/v1/bloodRequests", bloodRequestRoute);

module.exports = app;