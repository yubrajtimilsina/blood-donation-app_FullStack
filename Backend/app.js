const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const donorRoute = require('./routes/donor');
const prospectRoute = require('./routes/prospect');
const bloodRequestRoute = require('./routes/bloodRequest');
const recipientRoute = require('./routes/recipient');
const hospitalRoute = require('./routes/hospital');
const adminRoute = require('./routes/admin');
const notificationRoute = require('./routes/notification');

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// ✅ UPDATED: Allow both portals and additional ports
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
];

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

app.use(express.json());

//ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/donors", donorRoute);
app.use("/api/v1/prospects", prospectRoute);
app.use("/api/v1/bloodRequests", bloodRequestRoute);
app.use("/api/v1/recipients", recipientRoute);
app.use("/api/v1/hospitals", hospitalRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/notifications", notificationRoute);

app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'OK', message: 'Blood Donation API is running' });
});

app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

module.exports = app;