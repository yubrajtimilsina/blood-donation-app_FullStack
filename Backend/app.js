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
app.use("/api/v1/recipients", recipientRoute);
app.use("/api/v1/hospitals", hospitalRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/notifications", notificationRoute);


// Health check
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