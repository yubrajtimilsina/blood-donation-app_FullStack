// Role definitions
export const ROLES = {
    ADMIN: 'admin',
    DONOR: 'donor',
    RECIPIENT: 'recipient'
  };
  
  // Check if user has specific role
  export const hasRole = (user, role) => {
    return user && user.role === role;
  };
  
  // Check if user has any of the specified roles
  export const hasAnyRole = (user, roles) => {
    return user && roles.includes(user.role);
  };
  
  // Get dashboard route based on role
  export const getDashboardRoute = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return '/admin';
      case ROLES.DONOR:
        return '/donor/dashboard';
      case ROLES.RECIPIENT:
        return '/recipient/dashboard';
      default:
        return '/';
    }
  };
  
  // Get role display name
  export const getRoleDisplayName = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'Administrator';
      case ROLES.DONOR:
        return 'Blood Donor';
      case ROLES.RECIPIENT:
        return 'Blood Recipient';
      default:
        return 'User';
    }
  };
  
  // Get role color for UI
  export const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'purple';
      case ROLES.DONOR:
        return 'red';
      case ROLES.RECIPIENT:
        return 'blue';
      default:
        return 'gray';
    }
  };
  
  // Check if user is admin
  export const isAdmin = (user) => {
    return hasRole(user, ROLES.ADMIN);
  };
  
  // Check if user is donor
  export const isDonor = (user) => {
    return hasRole(user, ROLES.DONOR);
  };
  
  // Check if user is recipient
  export const isRecipient = (user) => {
    return hasRole(user, ROLES.RECIPIENT);
  };
  
  // Get available features based on role
  export const getFeaturesByRole = (role) => {
    const features = {
      [ROLES.ADMIN]: [
        'Manage Users',
        'View All Donors',
        'View All Recipients',
        'View All Requests',
        'Analytics Dashboard',
        'Approve Prospects',
        'Delete Records',
        'Send Notifications'
      ],
      [ROLES.DONOR]: [
        'Update Availability',
        'View Nearby Requests',
        'Donation History',
        'Profile Management',
        'Receive Notifications',
        'Track Next Eligible Date'
      ],
      [ROLES.RECIPIENT]: [
        'Create Blood Requests',
        'Search Donors',
        'Track Request Status',
        'Contact Donors',
        'Profile Management',
        'Receive Notifications'
      ]
    };
  
    return features[role] || [];
  };
  
  // Validate user permissions
  export const canAccessRoute = (user, requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };
  
  // Format user name with role badge
  export const formatUserNameWithRole = (user) => {
    if (!user) return 'Guest';
    return `${user.name} (${getRoleDisplayName(user.role)})`;
  };
  
  // Get navigation items based on role
  export const getNavigationItems = (role) => {
    const navItems = {
      [ROLES.ADMIN]: [
        { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
        { label: 'Donors', path: '/admin/donors', icon: 'blood' },
        { label: 'Prospects', path: '/admin/prospects', icon: 'users' },
        { label: 'Blood Requests', path: '/admin/bloodRequests', icon: 'request' },
        { label: 'Users', path: '/admin/users', icon: 'user' }
      ],
      [ROLES.DONOR]: [
        { label: 'Dashboard', path: '/donor/dashboard', icon: 'dashboard' },
        { label: 'Nearby Requests', path: '/donor/nearby-requests', icon: 'location' },
        { label: 'My Profile', path: '/donor/profile', icon: 'profile' },
        { label: 'Notifications', path: '/donor/notifications', icon: 'bell' }
      ],
      [ROLES.RECIPIENT]: [
        { label: 'Dashboard', path: '/recipient/dashboard', icon: 'dashboard' },
        { label: 'New Request', path: '/recipient/create-request', icon: 'plus' },
        { label: 'Search Donors', path: '/recipient/search-donors', icon: 'search' },
        { label: 'My Requests', path: '/recipient/my-requests', icon: 'list' },
        { label: 'Notifications', path: '/recipient/notifications', icon: 'bell' }
      ]
    };
  
    return navItems[role] || [];
  };
  
  export default {
    ROLES,
    hasRole,
    hasAnyRole,
    getDashboardRoute,
    getRoleDisplayName,
    getRoleColor,
    isAdmin,
    isDonor,
    isRecipient,
    getFeaturesByRole,
    canAccessRoute,
    formatUserNameWithRole,
    getNavigationItems
  };