const express = require('express');
const app = express();
const cors = require('cors');


//CORS
app.use(cors());

//JSON
app.use(express.json());

//ROUTES

module.exports = app;