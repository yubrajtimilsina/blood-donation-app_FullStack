const mongoose = require('mongoose');

// Role definitions and permissions
const ROLES = {
    ADMIN: 'admin',
    DONOR: 'donor',
    RECIPIENT: 'recipient',
    HOSPITAL: 'hospital'
  };
  
  const PERMISSIONS = {
    // Admin permissions
    MANAGE_USERS: ['admin'],
    DELETE_REQUESTS: ['admin'],
    VIEW_ALL_DATA: ['admin'],
    
    // Donor permissions
    UPDATE_AVAILABILITY: ['donor', 'admin'],
    VIEW_REQUESTS: ['donor', 'admin'],
    DONATE_BLOOD: ['donor', 'admin'],
    
    // Recipient permissions
    CREATE_REQUEST: ['recipient', 'admin'],
    VIEW_DONORS: ['recipient', 'admin'],
    CONTACT_DONORS: ['recipient', 'admin'],

    // Hospital permissions
    MANAGE_INVENTORY: ['hospital', 'admin'],
    VIEW_LOCAL_DONORS: ['hospital', 'admin'],
    PROCESS_DONATIONS: ['hospital', 'admin'],
    SEND_REQUESTS: ['hospital', 'admin']
  };
  
  const hasPermission = (userRole, permission) => {
    return PERMISSIONS[permission]?.includes(userRole) || false;
  };
  
  module.exports = {
    ROLES,
    PERMISSIONS,
    hasPermission
  };