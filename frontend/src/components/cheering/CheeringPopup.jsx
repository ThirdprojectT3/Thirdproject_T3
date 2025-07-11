import React from 'react';
import './CheeringPopup.css';

const CheeringPopup = ({ message }) => {
  const handleClose = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="cheer-overlay" />
      <div className="cheer-popup">
        <button className="cheer-close-btn" onClick={handleClose} aria-label="닫기">&times;</button>
        <div className="cheer-message">🎉 {message}</div>
        <div className="cheer-btn-wrapper">
          <button onClick={handleClose} className="button">
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front"><span>화이팅!</span></span>
          </button>
        </div>
      </div>
    </>
  );
};

export default CheeringPopup;