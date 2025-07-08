// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {
  const token = Cookies.get('jwtToken');

  if (!token) {
    alert('로그인이 필요합니다.');
    return <Navigate to="/" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
