import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const isAdmin = localStorage.getItem('adminKey') === 'KEY_ADMIN';

  return isAdmin ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
