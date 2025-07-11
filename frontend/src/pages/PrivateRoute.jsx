import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from '../api/axios';
import Loading from '../components/loading/Loading';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const hasAlertedRef = useRef(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/auth/me'); // 백엔드에서 인증 확인
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loading message="로딩 중..." fullscreen />;
  }

  if (!authenticated) {
    if (!hasAlertedRef.current) {
      alert('로그인이 필요합니다.');
      hasAlertedRef.current = true;
    }
    return <Navigate to="/login" replace />;
  }


  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
