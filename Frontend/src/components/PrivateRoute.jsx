import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.user.currentUser);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'donor') {
      return <Navigate to="/donor/dashboard" replace />;
    } else if (user.role === 'recipient') {
      return <Navigate to="/recipient/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;