# Blood Donation App Enhancement Plan

## Overview
Enhance the blood donation app to make it a complete website by adding missing fields, a new "hospital" role for blood banks, and ensuring all roles are properly specified.

## Tasks

### 1. Update User Model
- [x] Add gender and dateOfBirth fields to User model
- [x] Add hospitalProfile reference for hospital role

### 2. Add Hospital Role
- [x] Update Backend/config/roles.js to include HOSPITAL role
- [x] Update Backend/config/roles.js permissions for hospital
- [x] Create Backend/models/Hospital.js with fields: name, address, contact, bloodInventory (object with blood groups), location, etc.
- [x] Update auth controller to handle hospital registration and profile creation
- [x] Create Backend/controllers/hospital.js for hospital-specific operations
- [x] Create Backend/routes/hospital.js
- [x] Update Backend/app.js to include hospital routes

### 3. Update Registration
- [x] Add gender and dateOfBirth to registration form
- [x] Add hospital role option
- [x] Update auth controller to handle new fields

### 4. Frontend Updates
- [x] Update frontend/src/utils/roleHelpers.js to include HOSPITAL role
- [x] Create frontend/src/pages/Hospital.jsx dashboard
- [x] Create frontend/src/pages/HospitalProfile.jsx
- [x] Create frontend/src/components/HospitalNavbar.jsx
- [x] Update registration form
- [x] Update login redirects for hospital role

### 5. Add Missing Fields to Profiles
- [x] Add gender and dateOfBirth to Donor and Recipient profiles
- [x] Update controllers to handle new fields

### 6. Testing and Verification
- [x] Test all roles and registrations
- [x] Verify permissions and access control
- [x] Run frontend and backend servers
- [x] Check for any missing features

## Followup Steps
- Install dependencies if needed
- Run npm install in frontend and backend
- Start servers: backend on port 5000, frontend dev server
- Test all functionalities
