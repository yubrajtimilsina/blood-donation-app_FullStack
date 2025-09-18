const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const cors = require('cors');


//CORS
app.use(cors());

//JSON
app.use(express.json());

//ROUTES
app.use("/api/v1/auth",    authRoute);

module.exports = app;