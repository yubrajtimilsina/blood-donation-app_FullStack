const { hasPermission } = require('../config/roles');

// Check if user has specific role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: No user information" });
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ 
        message: "Forbidden: You don't have permission to access this resource" 
      });
    }
  };
};

// Check if user has specific permission
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: No user information" });
    }

    if (hasPermission(req.user.role, permission)) {
      next();
    } else {
      return res.status(403).json({ 
        message: "Forbidden: You don't have required permission" 
      });
    }
  };
};

// Check if user is accessing their own resource or is admin
const checkOwnership = (req, res, next) => {
  const userId = req.params.userId || req.params.id;
  
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role === 'admin' || req.user.id === userId) {
    next();
  } else {
    return res.status(403).json({ 
      message: "Forbidden: You can only access your own resources" 
    });
  }
};

module.exports = {
  checkRole,
  checkPermission,
  checkOwnership
};