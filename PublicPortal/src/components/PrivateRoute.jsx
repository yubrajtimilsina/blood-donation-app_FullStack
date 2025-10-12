import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.user.currentUser);

  if (!user) {
    return ;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'donor') {
      return ;
    } else if (user.role === 'recipient') {
      return ;
    }
    return ;
  }

  return children;
};

export default PrivateRoute;