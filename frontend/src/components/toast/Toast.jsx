import React from 'react';
import './Toast.css';

const Toast = ({ message, onClose }) => (
  <div className="toast-custom">
    <div className="toast-flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="toast-icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="toast-content">
        <strong className="toast-title">알림</strong>
        <p className="toast-message">{message}</p>
      </div>
      <button
        className="toast-close"
        type="button"
        aria-label="Dismiss alert"
        onClick={onClose}
      >
        <span className="sr-only">Dismiss popup</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="toast-close-icon"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

export default Toast;