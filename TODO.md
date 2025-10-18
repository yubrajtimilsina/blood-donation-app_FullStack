# TODO: Add Missing Routes and Components to Blood Donation App

## Current Routes Summary
### Admin-Panel (React Router)
- / (redirect based on role)
- /login, /register
- /admin/* (dashboard, prospects, donors, prospect/:id, newdonor, donor/:id, donor-portal/:id, bloodRequests, users)
- /hospital/* (dashboard, profile, inventory, requests, local-donors)

### PublicPortal (React Router)
- / (home), /about, /faq
- /login, /register
- /donor/* (dashboard, profile, portal/:id, nearby-requests, notifications)
- /recipient/* (dashboard, profile, my-requests, search-donors, notifications)

### Backend API (/api/v1)
- auth: register, login, me, password
- donors: CRUD, stats, monthly, history, record-donation, availability, search/nearby
- prospects: CRUD, monthly
- bloodRequests: CRUD, nearby
- recipients: profile CRUD, verify
- hospitals: profile, inventory, local-donors, requests, all
- admin: stats, users CRUD, verify, analytics
- notifications: CRUD, unread-count

## Missing Routes/Components to Add
- [ ] Forgot Password: /forgot-password (frontend + backend)
- [ ] Hospital Registration: /hospital/register (route HospitalRegister.jsx)
- [ ] Create Blood Request: /recipient/create-request (route CreateBloodRequest.jsx)
- [ ] Donation History: /donor/history (create DonationHistory.jsx page)
- [ ] Eligibility Checker: /donor/eligibility (create EligibilityChecker.jsx page)
- [ ] Contact Page: /contact (route Contact.jsx)
- [ ] User Verification: /verify (for OTP/email verification)
- [ ] Map View: /map (for nearby donors/requests, integrate LocationPicker)
- [ ] Analytics Dashboard: /admin/analytics (create Analytics.jsx page)
- [ ] Advanced Search: Add filters/pagination to existing search pages
- [ ] Real-time Notifications: Enhance NotificationBell with WebSocket/polling
- [x] Real-time Chat System: Implement Socket.IO chat for donors, recipients, hospitals, and admins
- [x] Remove ChatModal from HospitalDonors.jsx: Remove unused ChatModal import and related state from HospitalDonors.jsx
- [x] Add FloatingChatWidget to both App.jsx files: Implement role-based logic for chat widget visibility across all pages

## Features to Enhance
- [ ] Add pagination to lists (donors, requests, etc.)
- [ ] Add search filters (blood type, location, etc.)
- [ ] Integrate maps for location-based features
- [ ] Add email verification flow
- [ ] Add donation eligibility quiz
- [ ] Add user profile verification
- [ ] Add real-time notifications
