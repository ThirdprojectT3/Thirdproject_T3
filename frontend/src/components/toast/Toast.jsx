import React from 'react';
import './Toast.css';

const Toast = ({ message }) => (
  <div className="toast">{message}</div>
);

export default Toast;