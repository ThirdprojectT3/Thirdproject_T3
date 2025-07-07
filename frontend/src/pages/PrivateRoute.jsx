// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('jwtToken');

  if (!token) {
    alert('로그인이 필요합니다.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
