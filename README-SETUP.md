# LifeLink Blood Donation App - Complete Setup Guide

## 🩸 Overview
A comprehensive full-stack blood donation management system with two separate panels:

- **Admin/Hospital Panel** (Port 5174) - For hospitals and administrators
- **Donor/Recipient Panel** (Port 5173) - For donors and blood recipients
- **Backend API** (Port 3000) - Shared backend for both panels
- **Background Services** (Port 3001) - Email notifications and scheduled tasks

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Environment Setup

Create the following `.env` files:

#### Backend/.env
```env
PORT=3000
DB_URI=mongodb://localhost:27017/blooddonation
JWT_SEC=your_jwt_secret_key_here
PASS_SEC=your_password_encryption_secret_here
FRONTEND_ORIGIN=http://localhost:5173
ADMIN_ORIGIN=http://localhost:5174
```

#### BackgroundServices/.env
```env
PORT=3001
DB_URI=mongodb://localhost:27017/blooddonation
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

#### admin-panel/.env
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1/
```

#### donor-panel/.env
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1/
```

### 2. Database Setup

1. Start MongoDB service
2. The app will automatically create collections and indexes on first run

### 3. Install Dependencies

```bash
# Backend
cd Backend
npm install

# Admin Panel
cd ../admin-panel
npm install

# Donor Panel
cd ../donor-panel
npm install

# Background Services
cd ../BackgroundServices
npm install
```

### 4. Start the Application

#### Windows
```bash
# Run the batch file
start-apps.bat
```

#### Linux/Mac
```bash
# Make executable and run
chmod +x start-apps.sh
./start-apps.sh
```

#### Manual Start (All Platforms)
```bash
# Terminal 1 - Backend
cd Backend && npm run dev

# Terminal 2 - Admin Panel
cd admin-panel && npm run dev

# Terminal 3 - Donor Panel
cd donor-panel && npm run dev

# Terminal 4 - Background Services
cd BackgroundServices && npm run dev
```

## 🌐 Access Points

- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:5174
- **Donor Panel**: http://localhost:5173

## 👥 User Roles & Access

### Admin Panel (Port 5174)
- **Admin**: Full system access
- **Hospital**: Hospital-specific management
- Features: Dashboard, Donor Management, Blood Inventory, Reports

### Donor Panel (Port 5173)
- **Donor**: Blood donation management
- **Recipient**: Blood request management
- **Prospect**: Registration and approval process
- Features: Registration, Blood Requests, Donor Portal, Notifications

## 🔧 Key Features

### Backend Features
- ✅ JWT Authentication with role-based access
- ✅ MongoDB with geospatial queries
- ✅ Email notifications (Gmail SMTP)
- ✅ Blood inventory management
- ✅ Location-based donor search
- ✅ Real-time notifications
- ✅ Data validation and error handling

### Admin Panel Features
- ✅ Dashboard with real-time statistics
- ✅ Donor management and approval
- ✅ Blood inventory tracking
- ✅ Hospital management
- ✅ Blood request monitoring
- ✅ Reports and analytics

### Donor Panel Features
- ✅ User registration with role selection
- ✅ Blood request creation and management
- ✅ Donor profile management
- ✅ Location-based donor search
- ✅ Notification system
- ✅ Mobile-responsive design

## 🛠️ Development

### Project Structure
```
Blood donationApp/
├── Backend/                 # Node.js/Express API
├── admin-panel/            # React admin panel (Port 5174)
├── donor-panel/            # React donor panel (Port 5173)
├── BackgroundServices/     # Email and scheduled tasks
├── start-apps.bat         # Windows startup script
├── start-apps.sh          # Linux/Mac startup script
└── README-SETUP.md        # This file
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

#### Donors
- `GET /api/v1/donors` - List donors
- `POST /api/v1/donors` - Create donor
- `GET /api/v1/donors/:id` - Get donor details
- `PUT /api/v1/donors/:id` - Update donor
- `GET /api/v1/donors/search/nearby` - Find nearby donors

#### Blood Requests
- `GET /api/v1/bloodrequests` - List requests
- `POST /api/v1/bloodrequests` - Create request
- `PUT /api/v1/bloodrequests/:id` - Update request
- `GET /api/v1/bloodrequests/nearby` - Find nearby requests

## 🔐 Security Features

- JWT token authentication
- Role-based access control (RBAC)
- Password encryption with CryptoJS
- CORS protection
- Input validation and sanitization
- Rate limiting (can be added)

## 📧 Email Configuration

1. Enable 2-factor authentication on Gmail
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS` environment variable

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change ports in respective config files
   - Kill processes using the ports

2. **MongoDB connection failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`

3. **Email not sending**
   - Verify Gmail credentials
   - Check App Password setup

4. **CORS errors**
   - Update `FRONTEND_ORIGIN` and `ADMIN_ORIGIN` in backend `.env`

### Logs
- Backend logs: Console output
- Frontend logs: Browser DevTools Console
- Email logs: BackgroundServices console

## 🚀 Production Deployment

### Environment Variables
Update all `.env` files with production values:
- Database URLs
- JWT secrets
- Email credentials
- CORS origins

### Build Commands
```bash
# Build admin panel
cd admin-panel && npm run build

# Build donor panel
cd donor-panel && npm run build

# Start production backend
cd Backend && npm start
```

## 📱 Mobile Support
Both panels are fully responsive and work on mobile devices.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License.

## 🆘 Support
For issues and questions:
1. Check this README
2. Review console logs
3. Check MongoDB connection
4. Verify environment variables

---

**Happy Coding! 🩸💉**
